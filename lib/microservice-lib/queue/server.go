package queue

import (
	"fmt"
	"time"

	"github.com/streadway/amqp"
)

type amqpDetails struct {
	channel      *amqp.Channel
	exchangeName string
	workerId     string
}

var chanAmqpDetails = make(chan amqpDetails)

func queueConsume(queueName, topic, exchangeName, consumerId string, channel *amqp.Channel) (<-chan amqp.Delivery, error) {
	_, err := channel.QueueDeclare(
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
		return nil, fmt.Errorf(
			"failed to bind to a queue with name %#v, topic %#v! %v",
			queueName,
			topic,
			err,
		)
	}

	debug("Bound a queue %#v serving %v!", queueName, topic)

	messageChan, err := channel.Consume(
		queueName,
		consumerId,
		false, // autoAck
		false, // exclusive
		false, // noLocal
		false, // noWait
		nil,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to begin consuming from topic %#v with queue %#v! %v",
			topic,
			queueName,
			err,
		)
	}

	return messageChan, nil
}

func queuePublish(topic, exchangeName string, content []byte, channel *amqp.Channel) error {

	publishing := amqp.Publishing{
		DeliveryMode: amqp.Persistent,
		Timestamp:    time.Now(),
		ContentType:  "application/json",
		Body:         content,
	}

	debug(
		"channel.Publish a message to %#v topic %#v!",
		exchangeName,
		topic,
	)

	err := channel.Publish(
		exchangeName,
		topic,
		true,  // mandatory
		false, // immediate
		publishing,
	)

	// this error is only generated if the connection
	// fails or something similar happens

	if err != nil {
		return fmt.Errorf(
			"failed to publish a message! %v",
			err,
		)
	}

	return nil
}

func queueAckDeliveryTag(channel *amqp.Channel, deliveryTag uint64) error {
	return channel.Ack(deliveryTag, false)
}
