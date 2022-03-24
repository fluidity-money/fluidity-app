package main

import (
	"fmt"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/streadway/amqp"
)

// AmqpExchangeType to use when grabbing and relaying messages
const AmqpExchangeType = "topic"

const (
	// EnvAmqpCopyFromExchange name to use when copying messages off the
	// source AMQP
	EnvAmqpCopyFromExchange = "FLU_AMQP_COPY_FROM_EXCHANGE"

	// EnvAmqpCopyFromUri to connect to to get messages off the queue from
	EnvAmqpCopyFromUri = "FLU_AMQP_COPY_FROM_URI"

	// EnvAmqpCopyFromTopicName to use to get the topic for the
	EnvAmqpCopyFromTopicName = "FLU_AMQP_COPY_FROM_TOPIC_NAME"

	// EnvAmqpCopyToExchange to use as an exchange to send messages to
	EnvAmqpCopyToExchange = "FLU_AMQP_COPY_TO_EXCHANGE"

	// EnvAmqpCopyToUri to connect to and send messages down
	EnvAmqpCopyToUri = "FLU_AMQP_COPY_TO_URI"

	// EnvAmqpCopyToTopicName to publish messages to
	EnvAmqpCopyToTopicName = "FLU_AMQP_COPY_TO_TOPIC_NAME"
)

func generateQueueName(workerId, topicName string) string {
	return fmt.Sprintf("%s.%s", workerId, topicName)
}

func debug(s string, args ...interface{}) {
	log.Debug(func(k *log.Log) {
		k.Format(s, args...)
	})
}

func configureChannel(client *amqp.Connection, workerId, topicName, exchangeName string) (*amqp.Channel, string, error) {
	channel, err := client.Channel()

	if err != nil {
		return nil, "", fmt.Errorf(
			"failed to get a channel from the AMQP connection! %v",
			err,
		)
	}

	err = channel.ExchangeDeclare(
		exchangeName,
		AmqpExchangeType,
		true,  // durable
		false, // autoDelete,
		false, // internal
		false, // noWait
		nil,   // args
	)

	if err != nil {
		return nil, "", fmt.Errorf(
			"failed to declare an exchange with the name given! %v",
			err,
		)
	}

	queueName := generateQueueName(workerId, topicName)

	_, err = channel.QueueDeclare(
		queueName,
		true,  // durable
		false, // autoDelete
		false, // exclusive
		false, // noWait,
		nil,   // args
	)

	if err != nil {
		return nil, "", fmt.Errorf(
			"failed to declare a queue with queue name %#v! %v",
			queueName,
			err,
		)
	}

	err = channel.QueueBind(
		queueName,
		topicName,
		exchangeName,
		false, // noWait
		nil,   // args
	)

	if err != nil {
		return nil, "", fmt.Errorf(
			"failed to bind to a queue with name %#v, topic %#v! %v",
			queueName,
			topicName,
			err,
		)
	}

	return channel, queueName, nil
}

func main() {
	var (
		amqpCopyFromExchange  = util.GetEnvOrFatal(EnvAmqpCopyFromExchange)
		amqpCopyFromUri       = util.GetEnvOrFatal(EnvAmqpCopyFromUri)
		amqpCopyFromTopicName = util.GetEnvOrFatal(EnvAmqpCopyFromTopicName)

		amqpCopyToExchange  = util.GetEnvOrFatal(EnvAmqpCopyToExchange)
		amqpCopyToUri       = util.GetEnvOrFatal(EnvAmqpCopyToUri)
		amqpCopyToTopicName = util.GetEnvOrFatal(EnvAmqpCopyToTopicName)

		workerId = util.GetWorkerId()
	)

	clientFrom, err := amqp.Dial(amqpCopyFromUri)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to the AMQP copy from URI!"
			k.Payload = err
		})
	}

	defer clientFrom.Close()

	clientTo, err := amqp.Dial(amqpCopyToUri)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to the AMQP copy to URI!"
			k.Payload = err
		})
	}

	defer clientTo.Close()

	channelFrom, queueFromName, err := configureChannel(
		clientFrom,
		workerId,
		amqpCopyFromTopicName,
		amqpCopyFromExchange,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to configure the channel for the from source!"
			k.Payload = err
		})
	}

	debug(
		`Bound %s to %s at exchange %s!
Sending to %s`,
		queueFromName,
		amqpCopyFromTopicName,
		amqpCopyFromExchange,
		amqpCopyToTopicName,
	)

	messages, err := channelFrom.Consume(
		queueFromName,
		workerId,
		false, // autoAck
		false, // exclusive
		false, // noLocal
		false, // noWait
		nil,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to consume from the channel from!"
			k.Payload = err
		})
	}

	for message := range messages {
		deliveryTag := message.DeliveryTag

		publishing := amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			Timestamp:    time.Now(),
			ContentType:  "application/json",
			Body:         message.Body,
		}

		debug(
			"Publishing to %#v with content %s!",
			amqpCopyToTopicName,
			string(message.Body),
		)

		err := channelFrom.Publish(
			amqpCopyToExchange,
			amqpCopyToTopicName,
			true,  // mandatory
			false, // immediate
			publishing,
		)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to publish a message to %#v!",
					amqpCopyToUri,
				)

				k.Payload = err
			})
		}

		if err := channelFrom.Ack(deliveryTag, false); err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to ack a message to %#v!",
					amqpCopyToUri,
				)

				k.Payload = err
			})
		}
	}
}
