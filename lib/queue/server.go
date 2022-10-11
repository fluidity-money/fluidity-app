// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package queue

import (
	"fmt"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type amqpDetails struct {
	channel           *amqp.Channel
	exchangeName      string
	workerId          string
	deadLetterEnabled bool
	messageRetries    int
	goroutines        int
}

var chanAmqpDetails = make(chan amqpDetails)

func queueConsume(queueName, topic, exchangeName, consumerId string, channel *amqp.Channel, deadLetterEnabled, autoDelete bool) (<-chan amqp.Delivery, error) {

	log.Debugf(
		"Dead letter queue for %s enabled: %v",
		queueName,
		deadLetterEnabled,
	)

	err := channel.ExchangeDeclare(
		"dead-exchange",
		"direct",
		true,  // durable
		false, // autoDelete
		false, // exclusive
		false, // noWait,
		nil,   // args
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to declare an exchange with name %#v! %v",
			queueName+".dead-exchange",
			err,
		)
	}

	_, err = channel.QueueDeclare(
		queueName+".dead",
		true,       // durable
		autoDelete, // autoDelete
		false,      // exclusive
		false,      // noWait,
		nil,        // args
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to declare deadletter queue with queue name %#v! %v",
			queueName,
			err,
		)
	}

	err = channel.QueueBind(
		queueName+".dead",
		topic,           // Key
		"dead-exchange", // Exchange name
		false,           // noWait
		nil,             // args
	)

	if err != nil {
		return nil, fmt.Errorf(
			"unable to bind queue %#v to deadletter exchange! %v",
			queueName+".dead",
			err,
		)
	}

	_, err = channel.QueueDeclare(
		queueName,
		true,       // durable
		autoDelete, // autoDelete
		false,      // exclusive
		false,      // noWait,
		amqp.Table{
			"x-dead-letter-exchange": "dead-exchange",
		}, // args,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to declare a queue with queue name %#v! %v",
			queueName,
			err,
		)
	}

	log.Debugf(
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

	log.Debugf("Bound a queue %#v serving %v!", queueName, topic)

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

	log.Debugf(
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

func queueNackDeliveryTag(channel *amqp.Channel, deliveryTag uint64) error {
	return channel.Nack(deliveryTag, false, false)
}
