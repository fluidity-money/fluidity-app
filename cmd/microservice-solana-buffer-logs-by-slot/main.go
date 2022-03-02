package main

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queues/solana"

	"github.com/streadway/amqp"
)

const (

	LogsArenaSize = 500

func sendBufferedLogs(channel amqp.Channel, currentSlot uint64, logs ...solana.TransactionLog) {
	if currentSlot == 0 {
		return
	}

	bufferedLogs := solana.BufferedTransactionLog{
		Slot: currentSlot,
		Logs: logs,
	}

	queue.SendMessage(solana.TopicBufferedTransactionLogs, bufferedLogs)
}

func main() {

	logsArena := make([]solana.TransactionLog, LogsArenaSize)

	var (
		currentSlot uint64 = 0
		count              = 0
	)

	client, err := amqp.Dial(queueAddr)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to connect to AMQP server!"
			k.Payload = err
		})
	}

	channel, err := client.Channel()

	_, err := channel.QueueDeclare(
		queueName,
		true,  // durable
		false, // autoDelete
		false, // exclusive
		false, // noWait,
		nil,   // args
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"failed to declare a queue with queue name %#v!",
				queueName,
			)

			k.Payload = err
		})
	}

	debug(
		"Binding a new queue with name %v and routing key %v on exchange %v!",
		queueName,
		topic,
		exchangeName,
	)

	err = channel.QueueBind(
		queueName,
		topic,
		exchangeName,
		false, // noWait
		nil,   // args
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"failed to bind to a queue with name %#v, topic %#v!",
				queueName,
				topic,
			)

			k.Payload = err
		})
	}

	debug("Bound a queue %#v serving %v!", queueName, topic)

	messageChan, err := channel.Consume(
		queueName,
		consumerId,
		true, // autoAck
		false, // exclusive
		false, // noLocal
		false, // noWait
		nil,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"failed to begin consuming from topic %#v with queue %#v! %v",
				topic,
				queueName,
			)

			k.Payload = err
		})
	}

	for message := range messageChan {
		var (
			body = message.Body
			transactionLog solana.TransactionLog
		)

		err := json.Unmarshal(body, &transactionLog)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to unmarshal the body %#v!",
					string(body),
				)

				k.Payload = err
			})
		}

		slot := transactionLog.Params.Result.Context.Slot

		if slot != currentSlot {
			sendBufferedLogs(channel, currentSlot, logsArena[0:count]...)
			count = 0
			currentSlot = slot
		}

		logsArena[count] = transactionLog
		count++
	}
}
