package main

import (
	"bufio"
	"bytes"
	"fmt"
	"net/http"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/fluidity-money/fluidity-app/lib/web/websocket"
)

// EnvLogins, separated by , with username:password to indicate the
// login details for BASIC auth for the long poll
const EnvLogins = `FLU_LOGINS`

func rejectWithAuthenticateHeader(w http.ResponseWriter) {
	w.Header().Set("WWW-Authenticate", "Basic")
	http.Error(w, "Unauthorised", http.StatusUnauthorized)
}

func main() {
	logins_ := util.GetEnvOrFatal(EnvLogins)

	loginPairs := strings.Split(logins_, ",")

	logins := make(map[string]string, len(loginPairs))

	for i, loginPair_ := range loginPairs {
		loginPair := strings.Split(loginPair_, ":")

		if len(loginPair) != 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Login pair at position %v length not 2! Should be username:password!",
					i,
				)
			})
		}

		var (
			username = loginPair[0]
			password = loginPair[1]
		)

		logins[username] = password
	}

	broadcast := websocket.NewBroadcast()

	go func() {
		queue.GetMessages("#", func(message queue.Message) {
			var (
				topic   = message.Topic
				content = message.Content
			)

			var buf bytes.Buffer

			_, _ = buf.WriteString(topic)

			fmt.Fprint(&buf, ": ")

			_, _ = buf.ReadFrom(content)

			fmt.Fprint(&buf, "\n\r")

			broadcast.Broadcast(buf.Bytes())
		})
	}()

	web.Endpoint("/", func(w http.ResponseWriter, r *http.Request) {
		ipAddress := web.GetIpAddress(r)

		username, password, ok := r.BasicAuth()

		if !ok {
			log.App(func(k *log.Log) {
				k.Format(
					"Requested username and password from IP %v not provided!",
					ipAddress,
				)
			})

			rejectWithAuthenticateHeader(w)

			return
		}

		passwordFound, usernameFound := logins[username]

		if !usernameFound || passwordFound != password {
			log.App(func(k *log.Log) {
				k.Format(
					"Ip address %v supplied bad credentials!",
					ipAddress,
				)
			})

			rejectWithAuthenticateHeader(w)

			return
		}

		log.Debugf(
			"Ip address %v streaming messages!",
			ipAddress,
		)

		messages := make(chan []byte)

		// when the user disconnects, walk away

		cookie := broadcast.Subscribe(messages)

		go func() {
			<-r.Context().Done()
			broadcast.Unsubscribe(cookie)
		}()

		w.Header().Set("Content-Type", "text/plain")

		wFlusher := w.(http.Flusher)

		buf := bufio.NewWriterSize(w, 1024 * 2)

		for message := range messages {
			_, err := buf.Write(message)

			if err != nil {
				log.App(func(k *log.Log) {
					k.Format(
						"Ip address %v failed to write broadcast message!",
						err,
					)

					k.Payload = err
				})

				return
			}

			lessThanHalfAvailable := buf.Available() <= 512

			if lessThanHalfAvailable {
				_ = buf.Flush()
				wFlusher.Flush()
			}
		}
	})

	web.Listen()
}
