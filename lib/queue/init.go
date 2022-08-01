package queue

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"

	amqp "github.com/rabbitmq/amqp091-go"
)

func init() {
	var (
		workerId  = util.GetWorkerId()
		queueAddr = util.GetEnvOrFatal(EnvQueueAddr)
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

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to open a channel on AMQP!"
			k.Payload = err
		})
	}

	go func() {
		errors := make(chan *amqp.Error)

		err, closed := <-channel.NotifyClose(errors)

		if closed && err == nil {
			log.Fatal(func(k *log.Log) {
				k.Context = Context
				k.Message = "AMQP closed on its own without an error!!!"
			})
		}

		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Channel to AMQP closed prematurely with error!"
			k.Payload = err
		})
	}()

	err = channel.ExchangeDeclare(
		ExchangeName,
		ExchangeType,
		true,  // durable
		false, // autoDelete,
		false, // internal
		false, // noWait
		nil,   // args
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to declare an exchange!"
			k.Payload = err
		})
	}

	log.Debugf(
		"Declared a queue with name %#v type %#v!",
		ExchangeName,
		ExchangeType,
	)

	log.RegisterShutdown(func() {
		_ = channel.Close()
	})

	go func() {
		for {
			chanAmqpDetails <- amqpDetails{
				channel:      channel,
				exchangeName: ExchangeName,
				workerId:     workerId,
			}
		}
	}()
}
