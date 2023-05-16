package twitter

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

type twitterInReplyTo struct {
	InReplyTo string `json:"in_reply_to_tweet_id"`
}

func SendTweet(text, replyToTweetId string) (tweetId string) {
	twitterBearerToken, _ := getTwitterEnvs()

	httpClient := http.Client{
		Transport: &twitterBearerTransport{
			bearerToken: twitterBearerToken,
		},
	}

	var twitterJson struct {
		Text  string            `json:"text"`
		Reply *twitterInReplyTo `json:"reply,omitempty"`
	}

	if replyToTweetId != "" {
		twitterJson.Reply = &twitterInReplyTo{
			InReplyTo: replyToTweetId,
		}
	}

	var buf bytes.Buffer

	err := json.NewEncoder(&buf).Encode(twitterJson)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to encode Twitter RPC json to the buffer"
			k.Payload = err
		})
	}

	resp, err := httpClient.Post(UrlPostTweets, "application/json", &buf)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to make Twitter RPC request!"
			k.Payload = err
		})
	}

	defer resp.Body.Close()

	var twitterResp struct {
		Data struct {
			Id   string `json:"id"`
			Text string `json:"text"`
		} `json:"data"`
	}

	err = json.NewDecoder(resp.Body).Decode(&twitterResp)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode a Twitter tweet response!"
			k.Payload = err
		})
	}

	tweetId = twitterResp.Data.Id

	return tweetId
}
