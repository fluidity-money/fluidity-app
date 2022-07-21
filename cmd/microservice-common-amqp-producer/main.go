// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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

L:
	for {
		var buf bytes.Buffer

		for {
			line, isPrefix, err := reader.ReadLine()

			if err == io.EOF {
				break L
			}

			if _, err := buf.Write(line); err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get a line off stdin entirely!"
					k.Payload = err
				})
			}

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to continue reading lines!"
					k.Payload = err
				})
			}

			if !isPrefix {
				break
			}
		}

		queue.SendMessageBytes(publishTopic, buf.Bytes())
	}
}
