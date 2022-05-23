package queue

// queue implements code that talks to RabbitMQ over AMQP.

import (
	"bytes"
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strconv"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/state"
)

const (
	// Context is used to identify the AMQP server in logging
	Context = "AMQP"

	// EnvQueueAddr is the address to access RabbitMQ.
	EnvQueueAddr = `FLU_AMQP_QUEUE_ADDR`

	// ExchangeName to use for AMQP queues
	ExchangeName = `fluidity`

	// ExchangeType to use for routing messages inside the queue
	ExchangeType = `topic`

	// EnvMessageRetries is the number of times a message will be retried
	EnvMessageRetries = `FLU_QUEUE_MESSAGE_RETRIES`
)

type Message struct {
	Topic   string    `json:"topic"`
	Content io.Reader `json:"content"`
}

func (message Message) Decode(decoded interface{}) {
	// We decode everything that we receive as JSON.

	content := message.Content

	err := json.NewDecoder(content).Decode(decoded)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode a JSON message!"
			k.Payload = err
		})
	}

	log.Debugf("Successfully decoded a message from JSON!")
}

// GetMessages from the AMQP server, calling the function each time a
// message is received. If newTopic is set to true, a new queue name
// will be generated that will make this useful for receiving messages
// that would be received over broadcast that is unique to this worker.
// If it is set to false, every message that would be received is
// distributed across any worker sharing the same worker id.
func GetMessages(topic string, f func(message Message)) {

	amqpDetails := <-chanAmqpDetails

	var (
		channel      = amqpDetails.channel
		exchangeName = amqpDetails.exchangeName
		workerId     = amqpDetails.workerId
	)

	var (
		consumerId = generateRandomConsumerId(workerId)
		queueName  = fmt.Sprintf("%v.%v", topic, workerId)
	)

	messages, err := queueConsume(
		queueName,
		topic,
		exchangeName,
		consumerId,
		channel,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to start to consume queue %#v topic %#v, consumer id %#v, exchange %#v!",
				queueName,
				topic,
				consumerId,
				exchangeName,
			)

			k.Payload = err
		})
	}

	messageRetries := os.Getenv(EnvMessageRetries)
	maxRetryCount, err := strconv.Atoi(messageRetries)
	if err != nil {
		maxRetryCount = 5
	}

	for message := range messages {
		var (
			deliveryTag = message.DeliveryTag
			body        = message.Body
		)

		log.Debug(func(k *log.Log) {
			k.Context = Context
			k.Message = "Received a message from the queue!"
			k.Payload = string(body)
		})

		bodyBuf := bytes.NewBuffer(body)

		hasher := sha1.New()
		hasher.Write(body)
		hash := string(hasher.Sum(nil))

		retryKey := "worker.retry." + topic + "." + hash
		// if Atoi fails retryCount = 0
		retryCount, err := strconv.Atoi(string(state.Get(retryKey)))
		if err == nil {
			retryCount++

			if retryCount >= maxRetryCount {
				queueNackDeliveryTag(channel, deliveryTag)
				state.Del(retryKey) // Clean up the retry key
				continue
			}
		}

		state.Set(retryKey, strconv.Itoa(retryCount))

		f(Message{
			Topic:   topic,
			Content: bodyBuf,
		})

		log.Debugf(
			"Asking the server to ack the receipt of %v!",
			deliveryTag,
		)

		if err := queueAckDeliveryTag(channel, deliveryTag); err != nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context

				k.Format(
					"Failed to ack a message with tag %#v!",
					deliveryTag,
				)

				k.Payload = err
			})
		}

		log.Debugf(
			"Server acked the reply for %v!",
			deliveryTag,
		)

		state.Del(retryKey) // Clean up the retry key
	}
}

// SendMessage down a topic, with the JSON form of the content.
func SendMessage(topic string, content interface{}) {
	contentBytes, err := json.Marshal(content)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to encode a JSON structure!"
			k.Payload = err
		})
	}

	SendMessageBytes(topic, contentBytes)
}

// SendMessageBytes down a topic, with bytes as content
func SendMessageBytes(topic string, content []byte) {
	log.Debugf("Starting to send a publish request to the sending goroutine.")

	amqpDetails := <-chanAmqpDetails

	var (
		channel      = amqpDetails.channel
		exchangeName = amqpDetails.exchangeName
	)

	err := queuePublish(topic, exchangeName, content, channel)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to publish to the queue with topic %#v, exchange %#v! Error %#v",
				topic,
				exchangeName,
				err,
			)

			k.Payload = string(content)
		})
	}

	log.Debugf("Sending goroutine has received the request!")
}

// Finish up, by clearing the buffer
func Finish() {
	amqpDetails := <-chanAmqpDetails
	amqpDetails.channel.Close()
}
