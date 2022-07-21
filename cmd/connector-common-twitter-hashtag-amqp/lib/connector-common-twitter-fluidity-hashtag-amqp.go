// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package connector_common_twitter_fluidity_hashtag_amqp

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
	twitter "github.com/fluidity-money/fluidity-app/lib/types/twitter"
)

type (
	twitterBearerTransport struct {
		bearerToken string
	}

	twitterStreamRulesList struct {
		Data []struct {
			Id    string `json:"id"`
			Value string `json:"value"`
			Tag   string `json:"tag"`
		} `json:"data"`
	}

	twitterStreamRulesAdd struct {
		Value string `json:"value"`
		Tag   string `json:"tag"`
	}

	twitterStreamRulesSet struct {
		Add    []twitterStreamRulesAdd   `json:"add", omitempty`
		Delete *twitterStreamRulesDelete `json:"delete,omitempty"`
	}

	twitterStreamRulesDelete struct {
		Ids []string `json:"ids"`
	}

	twitterTweetMatchingRule struct {
		Id  string `json:"id"`
		Tag string `json:"tag"`
	}

	twitterTweet struct {
		Data struct {
			AuthorId string `json:"author_id"`
			Id       string `json:"id"`
			Text     string `json:"text"`
		} `json:"data"`

		Includes struct {
			Users []struct {
				Id       string `json:"id"`
				Name     string `json:"name"`
				Username string `json:"username"`
			} `json:"users"`
		} `json:"includes"`

		MatchingRules []twitterTweetMatchingRule `json:"matching_rules"`
	}
)

func (transport *twitterBearerTransport) RoundTrip(req *http.Request) (*http.Response, error) {

	bearerToken := fmt.Sprintf("Bearer %v", transport.bearerToken)

	req.Header.Add("Authorization", bearerToken)

	return http.DefaultTransport.RoundTrip(req)
}

// getStreamRules currently in place, returning IDs
func getStreamRules(client *http.Client) ([]string, error) {
	resp, err := client.Get("https://api.twitter.com/2/tweets/search/stream/rules")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get the stream list that's currently in use! %v",
			err,
		)
	}

	defer resp.Body.Close()

	var buf bytes.Buffer

	if _, err := buf.ReadFrom(resp.Body); err != nil {
		return nil, fmt.Errorf(
			"failed to read from the response body for twitter stream rules! %v",
			err,
		)
	}

	bufCopy := buf

	bufCopy.WriteTo(os.Stderr)

	var streamRules twitterStreamRulesList

	err = json.NewDecoder(&buf).Decode(&streamRules)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to decode the stream containing the rules! %v",
			err,
		)
	}

	streamRulesData := streamRules.Data

	streamRulesIds := make([]string, len(streamRulesData))

	for i, streamRule := range streamRulesData {
		streamRulesIds[i] = streamRule.Id
	}

	return streamRulesIds, nil
}

// deleteStreamRules using their ids
func deleteStreamRules(client *http.Client, ids ...string) error {

	twitterStreamRulesDelete := twitterStreamRulesDelete{
		Ids: ids,
	}

	streamRules := twitterStreamRulesSet{
		Delete: &twitterStreamRulesDelete,
	}

	var buf bytes.Buffer

	err := json.NewEncoder(&buf).Encode(&streamRules)

	if err != nil {
		return fmt.Errorf(
			"failed to encode the stream rules data to the buffer! %v",
			err,
		)
	}

	resp, err := client.Post(
		"https://api.twitter.com/2/tweets/search/stream/rules",
		"application/json",
		&buf,
	)

	if err != nil {
		return fmt.Errorf(
			"failed to make the get request to delete the stream rules! %v",
			err,
		)
	}

	defer resp.Body.Close()

	var respBuf bytes.Buffer

	if _, err := respBuf.ReadFrom(resp.Body); err != nil {
		return fmt.Errorf(
			"failed to read the reply from the HTTP POST to twitter! %v",
			err,
		)
	}

	if _, err := buf.WriteTo(os.Stderr); err != nil {
		return fmt.Errorf(
			"failed to write the results of setting the stream rules to stderr! %v",
			err,
		)
	}

	return nil
}

// setStreamRules using the values specified
func setStreamRules(client *http.Client, tags ...string) error {

	rulesAdd := make([]twitterStreamRulesAdd, len(tags))

	for i, tag := range tags {
		rulesAdd[i] = twitterStreamRulesAdd{
			Value: tag,
			Tag:   tag,
		}
	}

	streamRules := twitterStreamRulesSet{
		Add: rulesAdd,
	}

	var buf bytes.Buffer

	if err := json.NewEncoder(&buf).Encode(streamRules); err != nil {
		return fmt.Errorf(
			"failed to encode the stream rules to a buffer! %v",
			err,
		)
	}

	resp, err := client.Post(
		"https://api.twitter.com/2/tweets/search/stream/rules",
		"application/json",
		&buf,
	)

	if err != nil {
		return fmt.Errorf(
			"failed to send the request to twitter with the stream rules! %v",
			err,
		)
	}

	defer resp.Body.Close()

	var respBuf bytes.Buffer

	if _, err := respBuf.ReadFrom(resp.Body); err != nil {
		return fmt.Errorf(
			"failed to read the reply from the HTTP POST to twitter! %v",
			err,
		)
	}

	if _, err := respBuf.WriteTo(os.Stderr); err != nil {
		return fmt.Errorf(
			"failed to write the results of setting the stream rules to stderr! %v",
			err,
		)
	}

	return nil
}

func openStream(client *http.Client) (io.ReadCloser, error) {
	resp, err := client.Get("https://api.twitter.com/2/tweets/search/stream?expansions=author_id")

	if err != nil {
		return nil, fmt.Errorf(
			"failed to start getting the tweets stream! %v",
			err,
		)
	}

	return resp.Body, nil
}

func getHashtags(matchingRules []twitterTweetMatchingRule) []string {
	hashtags := make([]string, len(matchingRules))

	for i, rule := range matchingRules {
		hashtag := rule.Tag

		if len(hashtag) == 0 {
			continue
		}

		hashtag = strings.ToLower(hashtag)

		hashtags[i] = hashtag[1:]
	}

	return hashtags
}

func makeUrl(username, tweetId string) string {
	return fmt.Sprintf(
		"https://twitter.com/%v/status/%v",
		username,
		tweetId,
	)
}

func handleStreaming(stream io.Reader, chanTweets chan twitter.Tweet) error {

	reader := bufio.NewReader(stream)

	for {
		line, _, err := reader.ReadLine()

		if err == io.EOF {
			continue
		}

		if err != nil {
			return fmt.Errorf(
				"failed to read a line off the messages being received from twitter! %v",
				err,
			)
		}

		if len(line) == 0 {
			continue
		}

		log.Debug(func(k *log.Log) {
			k.Format(
				"Got this tweet blob: %#v!",
				string(line),
			)
		})

		if strings.Contains(string(line), "Unauthorized") {
			return fmt.Errorf(
				"failed to connect to twitter: Unauthorized! content: %#v",
				string(line),
			)
		}

		if strings.Contains(string(line), "ConnectionException") {
			return fmt.Errorf(
				"failed to connect to twitter: ConnectionException! content: %#v",
				string(line),
			)
		}

		if strings.Contains(string(line), "OperationalDisconnect") {
			return fmt.Errorf(
				"failed to connect to twitter: OperationalDisconnect! content: %#v",
				string(line),
			)
		}

		var twitterTweet twitterTweet

		if err := json.Unmarshal(line, &twitterTweet); err != nil {
			return fmt.Errorf(
				"failed to unmarshal a line off the messages being received from twitter! content %#v %v",
				string(line),
				err,
			)
		}

		var (
			authorId      = twitterTweet.Data.AuthorId
			includes      = twitterTweet.Includes.Users
			content       = twitterTweet.Data.Text
			matchingRules = twitterTweet.MatchingRules
			tweetId       = twitterTweet.Data.Id

			username string
		)

		// this seems to be the case consistently and this entire codebase needs
		// refractoring so doing it this way for now
		if len(includes) > 0 {
			username = includes[0].Username
		}

		url := makeUrl(username, tweetId)

		// if the twitter url doesn't get parsed meaningfully it's likely we have an error
		if url == "https://twitter.com//status/" {
			log.Debug(func(k *log.Log) {
				k.Format(
					"failed to meaningfully parse the twitter URL, possibly indicates an error %#v!",
					string(line),
				)
			})
		}

		hashtags := getHashtags(matchingRules)

		tweet := twitter.Tweet{
			TweeterUsername: username,
			TweeterAuthorId: authorId,
			TweetContent:    content,
			Hashtags:        hashtags,
			Url:             url,
		}

		chanTweets <- tweet
	}
}

// RunStreamTweets with a seperate goroutine following a hashtag
func RunStreamTweets(bearerToken string, hashtags ...string) (<-chan twitter.Tweet, <-chan error, error) {
	twitterTransport := twitterBearerTransport{
		bearerToken: bearerToken,
	}

	httpClient := http.Client{
		Transport: &twitterTransport,
	}

	streamRulesIds, err := getStreamRules(&httpClient)

	if err != nil {
		return nil, nil, fmt.Errorf(
			"failed to get the stream rules to use to delete! %v",
			err,
		)
	}

	log.App(func(k *log.Log) {
		k.Message = "Deleting the following stream rules: "
		k.Payload = streamRulesIds
	})

	if deleteStreamRules(&httpClient, streamRulesIds...); err != nil {
		return nil, nil, fmt.Errorf(
			"failed to delete the stream rules! %v",
			err,
		)
	}

	log.App(func(k *log.Log) {
		k.Message = "Setting the stream rules to include"
		k.Payload = hashtags
	})

	if err := setStreamRules(&httpClient, hashtags...); err != nil {
		return nil, nil, fmt.Errorf(
			"failed to set the stream rules for twitter! %v",
			err,
		)
	}

	log.App(func(k *log.Log) {
		k.Message = "Set the stream rules! Streaming!"
	})

	var (
		chanTweets = make(chan twitter.Tweet)
		chanErrors = make(chan error)
	)

	streams := make(chan io.Reader)

	go func() {
		for {
			stream, err := openStream(&httpClient)

			if err == io.EOF {
				continue
			}

			if err != nil {
				chanErrors <- fmt.Errorf(
					"failed to start streaming! %v",
					err,
				)

				return
			}

			streams <- stream
		}
	}()

	go func() {
		for stream := range streams {
			err := handleStreaming(stream, chanTweets)

			if err != nil {
				chanErrors <- fmt.Errorf(
					"failed to stream tweets! %v",
					err,
				)
			}
		}
	}()

	return chanTweets, chanErrors, nil
}
