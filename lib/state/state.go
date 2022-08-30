// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package state

// state implements code used by workers to record their state for other
// workers to interact with (and to survive crashes...) May be also used
// as a middleware technology for web apis.

import (
	"context"
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"

	"github.com/go-redis/redis/v8"

	"github.com/go-redsync/redsync/v4"
	redsyncRedis "github.com/go-redsync/redsync/v4/redis"
	"github.com/go-redsync/redsync/v4/redis/goredis/v8"
)

const (
	// EnvRedisAddr to use when connecting to Redis
	EnvRedisAddr = `FLU_REDIS_ADDR`

	// EnvRedisPassword to use when authenticating to the Redis server
	EnvRedisPassword = `FLU_REDIS_PASSWORD`

	// Context to use when writing logging messages
	Context = `REDIS`
)

var (
	// redisReadyChan communicates that the client can be used safely
	redisReadyChan = make(chan bool)

	// _redisClient is used to connect to Redis
	// please use client() !
	_redisClient *redis.Client
)

func client() *redis.Client {
	_ = <-redisReadyChan

	return _redisClient
}

// Leaky access to the underlying Redis handle. Be careful!
func Leaky() *redis.Client {
	return client()
}

func pool() redsyncRedis.Pool {
	redisClient := client()

	return goredis.NewPool(redisClient)
}

// returns a redsync distributed mutex on top of redis client
func NewRedsync() *redsync.Redsync {
	_pool := pool()
	return redsync.New(_pool)
}

// LLen is the length of the list at key
func LLen(key string) int64 {
	redisClient := client()

	intCmd := redisClient.LLen(context.Background(), key)

	length, err := intCmd.Result()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to fetch length of key %s!",
				key,
			)

			k.Payload = err
		})
	}

	return length
}

func LPush(key string, content interface{}) {
	redisClient := client()

	intCmd := redisClient.LPush(context.Background(), key, content)

	if err := intCmd.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to LPush key!"
			k.Payload = err
		})
	}
}

func RPush(key string, content interface{}) {
	redisClient := client()

	intCmd := redisClient.RPush(context.Background(), key, content)

	if err := intCmd.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to RPush key!"
			k.Payload = err
		})
	}
}

func ZRem(key, member string) {
	redisClient := client()

	intCmd := redisClient.ZRem(context.Background(), key, member)

	if err := intCmd.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to ZRem key!"
			k.Payload = err
		})
	}
}

// ZPeep looks at the first member of a sorted set without popping it
// returning it and a boolean of whether there was an element or not
func ZPeep(key string) (string, bool) {
	redisClient := client()

	timestampIds, err := redisClient.ZRange(context.Background(), key, 0, 0).Result()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to check the top of a set!"
			k.Payload = err
		})
	}

	if len(timestampIds) == 1 {
		return timestampIds[0], true
	}

	return "", false
}

// Set state to the key containing the JSON-encoded content
func Set(key string, content interface{}) {
	redisClient := client()

	contentBytes := serialiseToBytes(content)

	log.Debugf(
		"About to set this state to key %s: %v",
		key,
		contentBytes,
	)

	statusCmd := redisClient.Set(context.Background(), key, contentBytes, 0)

	if err := statusCmd.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to set state!"
			k.Payload = err
		})
	}
}

// SetNxTimed, returning didSet as true if the value was set (didn't exist already!)
func SetNxTimed(key string, content interface{}, expiry time.Duration) (didSet bool) {
	redisClient := client()

	contentBytes := serialiseToBytes(content)

	log.Debugf(
		"About to set this state to key %s with expiry %v: %v",
		key,
		expiry,
		contentBytes,
	)

	boolCmd := redisClient.SetNX(context.Background(), key, contentBytes, expiry)

	result, err := boolCmd.Result()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to set state!"
			k.Payload = err
		})
	}

	return result
}

// Delete zero or more key-value pairs
func Del(keys ...string) {
	redisClient := client()

	log.Debugf(
		"About to delete the key/s %s",
		keys,
	)

	intCmd := redisClient.Del(context.Background(), keys...)

	if err := intCmd.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to delete key/s!"
			k.Payload = err
		})
	}
}

// SetTimed state to the key containing JSON-encoded content, deleting after
// the time period defined as a constant in state.
func SetTimed(key string, seconds uint64, content interface{}) {
	redisClient := client()

	contentBytes := serialiseToBytes(content)

	log.Debugf(
		"Setting a timed length for the key %v value %#v to expire in %v seconds!",
		key,
		string(contentBytes),
		seconds,
	)

	timeToLive := time.Duration(seconds) * time.Second

	statusCmd := redisClient.Set(
		context.Background(),
		key,
		contentBytes,
		timeToLive,
	)

	if err := statusCmd.Err(); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to set a timed value!"
			k.Payload = err
		})
	}
}

// Get state using the key
func Get(key string) []byte {
	redisClient := client()

	stringCmd := redisClient.Get(context.Background(), key)

	bytesContent, err := stringCmd.Result()

	if err != nil && err != redis.Nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get from key %v and convert to bytes!",
				key,
			)

			k.Payload = err
		})
	}

	return []byte(bytesContent)
}

func GetSet(key string, content interface{}) []byte {
	redisClient := client()

	contentBytes := serialiseToBytes(content)

	log.Debugf(
		"About to set this state to key %s: %v",
		key,
		contentBytes,
	)

	stringCmd := redisClient.GetSet(context.Background(), key, contentBytes)

	bytesContent, err := stringCmd.Result()

	if err != nil && err != redis.Nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to getset a key %v and convert to bytes!",
				key,
			)

			k.Payload = err
		})
	}

	return []byte(bytesContent)
}

// Rpush a value into a key, returning the new length.
func Rpush(key string, value interface{}) int64 {
	redisClient := client()

	intCmd := redisClient.RPush(context.Background(), key, value)

	result, err := intCmd.Result()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to rpush a value to key %#v!",
				key,
			)

			k.Payload = err
		})
	}

	return result
}

// Lpop something from the Redis, returning an empty byte slice if empty.
func Lpop(key string) []byte {
	redisClient := client()

	stringCmd := redisClient.LPop(context.Background(), key)

	result, err := stringCmd.Result()

	if err != nil && err != redis.Nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to lpop from key %#v!",
				key,
			)

			k.Payload = err
		})
	}

	if result == "" {
		return nil
	}

	bytes, err := stringCmd.Bytes()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to convert the returned stringcmd from key %#v to bytes!",
				key,
			)

			k.Payload = err
		})
	}

	return bytes
}

// Rpop something from the Redis, returning an empty byte slice if empty.
func Rpop(key string) []byte {
	redisClient := client()

	stringCmd := redisClient.RPop(context.Background(), key)

	result, err := stringCmd.Result()

	if err != nil && err != redis.Nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to rpop from key %#v!",
				key,
			)

			k.Payload = err
		})
	}

	if result == "" {
		return nil
	}

	bytes, err := stringCmd.Bytes()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to convert the returned stringcmd from key %#v to bytes!",
				key,
			)

			k.Payload = err
		})
	}

	return bytes
}

func LPopCount(key string, count int) [][]byte {
	redisClient := client()

	stringSliceCmd := redisClient.LPopCount(
		context.Background(),
		key,
		count,
	)

	result, err := stringSliceCmd.Result()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to lpop with a count from key %#v!",
				key,
			)

			k.Payload = err
		})
	}

	byteResults := make([][]byte, len(result))

	for i, result := range result {
		byteResults[i] = []byte(result)
	}

	return byteResults
}

func LRange(key string, start, end int64) [][]byte {
	redisClient := client()

	stringSliceCmd := redisClient.LRange(
		context.Background(),
		key,
		start,
		end,
	)

	result, err := stringSliceCmd.Result()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to lrange with a count of %v to %v from key %#v!",
				start,
				end,
				key,
			)

			k.Payload = err
		})
	}

	byteResults := make([][]byte, len(result))

	for i, result := range result {
		byteResults[i] = []byte(result)
	}

	return byteResults

}

// SetTimed attempts to set a cookie with the JSON of value if the key is
// already set and not empty.
func SetTimedIfSet(name string, value interface{}) (set bool) {
	return true
}

// Incr increments the value of a key by 1 atomically.
func Incr(key string) int64 {
	redisClient := client()

	intCmd := redisClient.Incr(context.Background(), key)

	result, err := intCmd.Result()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to incr key %#v!",
				key,
			)

			k.Payload = err
		})
	}

	return result
}

// Expire sets the expiration time of a key.
func Expire(key string, seconds int64) {
	redisClient := client()

	intCmd := redisClient.Expire(
		context.Background(),
		key,
		time.Duration(seconds)*time.Second,
	)

	_, err := intCmd.Result()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to expire key %#v!",
				key,
			)

			k.Payload = err
		})
	}
}
