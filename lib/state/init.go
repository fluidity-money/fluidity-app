// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package state

import (
	"context"
	"os"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/go-redis/redis/v8"
)

func init() {
	var (
		redisAddr     = util.GetEnvOrFatal(EnvRedisAddr)
		redisPassword = os.Getenv(EnvRedisPassword)
	)

	redisOptions := redis.Options{
		Addr:     redisAddr,
		Password: redisPassword,
		DB:       0,
	}

	// sets state.go _redisClient

	_redisClient = redis.NewClient(&redisOptions)

	log.Debugf(
		"Connecting to the Redis server!",
	)

	err := _redisClient.Ping(context.Background()).Err()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to connect to the Redis server!"
			k.Payload = err
		})
	}

	log.Debugf(
		"Connected to the Redis server!",
	)

	go func() {
		for {
			redisReadyChan <- true
		}
	}()
}
