package main

import (
	"bufio"
	"bytes"
	"io"
	"os"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

// EnvTopicPublish to use when publishing messages down from stdin
const EnvTopicPublish = `FLU_AMQP_TOPIC_PUBLISH`

func main() {
	publishTopic := util.GetEnvOrFatal(EnvTopicPublish)

	defer queue.Finish()

	reader := bufio.NewReader(os.Stdin)

	var buf bytes.Buffer

LineReading:
	for {
		line, isPrefix, err := reader.ReadLine()

		if err == io.EOF {
			break LineReading
		}

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to continue reading lines!"
				k.Payload = err
			})
		}

		_, _ = buf.Write(line)

		_, _ = buf.Write([]byte{'\n'})

		// continue reading the line, but have to exhaust
		// what's left first

		for isPrefix {
			line, isPrefix, err = reader.ReadLine()

			if err == io.EOF {
				break LineReading
			}

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to continue reading lines!"
					k.Payload = err
				})
			}

			_, _ = buf.Write(line)
		}
	}

	queue.SendMessageBytes(publishTopic, buf.Bytes())
}
