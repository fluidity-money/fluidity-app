package main

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/streadway/amqp"
)

// AmqpExchangeType to use when grabbing and relaying messages
const AmqpExchangeType = "topic"

const (
	EnvAmqpCopyFromExchange = "ENV_AMQP_COPY_FROM_EXCHANGE"

	EnvAmqpCopyFromUri = "ENV_AMQP_COPY_FROM_URI"

	EnvAmqpCopyFromTopicName = "ENV_AMQP_COPY_FROM_TOPIC_NAME"

	EnvAmqpCopyToExchange = "ENV_AMQP_COPY_TO_EXCHANGE"

	EnvAmqpCopyToUri = "ENV_AMQP_COPY_TO_URI"

	EnvAmqpCopyToTopicName = "ENV_AMQP_COPY_TO_TOPIC_NAME"
)

func configureReturnChannel(client *amqp.Connection, queueName, topicName, exchangeName string) (*amqp.Channel, error) {
	channel, err := client.Channel()

	if err != nil {
		return nil, fmt.Errorf(
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
		return nil, fmt.Errorf(
			"failed to declare an exchange with the name given! %v",
			err,
		)
	}

	_, err = channel.TopicDeclare(
		queueName,
		true,  // durable
		false, // autoDelete
		false, // exclusive
		false, // noWait,
		nil,   // args
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to declare a queue with queue name %#v! %v",
			queueName,
			err,
		)
	}

	err = channel.TopicBind(
		queueName,
		topicName,
		exchangeName,
		false, // noWait
		nil,   // args
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to bind to a queue with name %#v, topic %#v! %v",
			queueName,
			topicName,
			err,
		)
	}

	return channel, nil
}

func main() {
	var (
		amqpCopyFromExchange  = util.GetEnvOrFatal(EnvAmqpCopyFromExchange)
		amqpCopyFromUri       = util.GetEnvOrFatal(EnvAmqpCopyFromUri)
		amqpCopyFromTopicName = util.GetEnvOrFatal(EnvAmqpCopyFromTopicName)

		amqpCopyToExchange  = util.GetEnvOrFatal(EnvAmqpCopyToExchange)
		amqpCopyToUri       = util.GetEnvOrFatal(EnvAmqpCopyToUri)
		amqpCopyToTopicName = util.GetEnvOrFatal(EnvAmqpCopyToTopicName)
	)

	clientFrom, err := amqp.Dial(amqpCopyFromUri)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to the AMQP copy from URI!"
			k.Payload = err
		})
	}

	clientTo, err := amqp.Dial(amqpCopyToUri)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to connect to the AMQP copy to URI!"
			k.Payload = err
		})
	}

}
