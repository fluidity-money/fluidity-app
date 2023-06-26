// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package elliptic

import (
	"bytes"
	"encoding/json"
	"crypto/hmac"
	"io"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

// Context for logging
const Context = "ELLIPTIC"

// UrlEllipticAml to use for making any qeuests
const UrlEllipticAml = "https://aml-api.elliptic.co/v2/wallet/synchronous"

type transport struct {
	apiKey string
	secret string
}

type (
	// ContributionValue tracking values of the kind { usd: 123.82 }
	ContributionValue map[string]float64

	Entity struct {
		Name            string `json:"name"`
		Category        string `json:"category"`
		IsPrimaryEntity bool   `json:"is_primary_entity"`
		IsVasp          bool   `json:"is_vasp"`
	}
)

type (
	WalletAnalysisDetail struct {
		RuleId          uuid.NullUUID `json:"rule_id"`
		RiskScore       int           `json:"risk_score"`
		RuleName        string        `json:"rule_name"`
		MatchedElements []struct {
			Category               string            `json:"category"`
			ContributionPercentage int               `json:"contribution_percentage"`
			ContributionValue      ContributionValue `json:"contribution_value"`
			Contributions          []struct {
				ContributionPercentage int               `json:"contribution_percentage"`
				Entity                 string            `json:"entity"`
				ContributionValue      ContributionValue `json:"contribution_value"`
				RiskTriggers           struct {
					CategoryId   uuid.NullUUID `json:"category_id"`
					Category     string        `json:"category"`
					IsSanctioned bool          `json:"is_sanctioned"`
				} `json:"risk_triggers"`
			} `json:"contributions"`
		} `json:"matched_elements"`
	}

	WalletAnalysisResponse struct {
		Id               uuid.NullUUID `json:"id"`
		ScreeningId      uuid.NullUUID `json:"screening_id"`
		Type             string        `json:"type"`
		CreatedAt        time.Time     `json:"created_at"`
		UpdatedAt        time.Time     `json:"updated_at"`
		AnalysedAt       time.Time     `json:"analysed_at"`
		ProcessStatus    string        `json:"process_status"`
		ProcessStatusId  int           `json:"process_status_id"`
		WorkflowStatusId int           `json:"workflow_status_id"`
		WorkflowStatus   string        `json:"workflow_status"`
		Error            string        `json:"error"`
		AssetTier        string        `json:"asset_tier"`
		RiskScore        int           `json:"risk_score"`

		AnalysedBy struct {
			Id   uuid.NullUUID `json:"id"`
			Type string        `json:"id"`
		} `json:"analysed_by"`

		ClusterEntities []struct {
			Name            string `json:"name"`
			Category        string `json:"category"`
			IsPrimaryEntity bool   `json:"is_primary_entity"`
			IsVasp          bool   `json:"is_vasp"`
		} `json:"cluster_entities"`

		Subject struct {
			Asset      string           `json:"asset"`
			Hash       ethereum.Address `json:"hash"`
			Type       string           `json:"type"`
			Blockchain string           `json:"blockchain"`
		} `json:"subject"`

		Customer struct {
			Reference string `json:"reference"`
		} `json:"customer"`

		BlockchainInfo struct {
			Cluster struct {
				InflowValue  ContributionValue `json:"inflow_value"`
				OutflowValue ContributionValue `json:"outflow_value"`
			} `json:"cluster"`
		} `json:"blockchain_info"`

		RiskScoreDetail struct {
			Destination int `json:"destination"`
			Source      int `json:"source"`
		} `json:"risk_score_detail"`

		EvaluationDetail struct {
			Source      []WalletAnalysisDetail `json:"source"`
			Destination []WalletAnalysisDetail `json:"destination"`
		} `json:"evaluation_detail"`

		Contributions struct {
			Source []struct {
				Entities               []Entity          `json:"entities"`
				ContributionPercentage int               `json:"contribution_percentage"`
				ContributionValue      ContributionValue `json:"contribution_value"`
			} `json:"source"`

			Destination []struct {
				Entities               []Entity          `json:"entities"`
				ContributionPercentage int               `json:"contribution_percentage"`
				ContributionValue      ContributionValue `json:"contribution_value"`
			} `json:"destination"`
		} `json:"contributions"`

		Changes struct {
			RiskScoreChanges int `json:"risk_score_changes"`
		} `json:"changes"`
	}
)

func (t *transport) RoundTrip(req *http.Request) (*http.Response, error) {
	ds, err := base64.StdEncoding.DecodeString(t.secret)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to encode decode elliptic secret string for request: %v",
			err,
		)
	}

	h := hmac.New(sha256.New, []byte(ds))

	now := time.Now().Unix()

	path := req.URL.Path

	method := req.Method

	body := new(bytes.Buffer)

	if _, err := body.ReadFrom(req.Body); err != nil {
		return nil, fmt.Errorf(
			"failed to read from the http request body: %v",
			err,
		)
	}

	req.Body = io.NopCloser(body)

	_, err = fmt.Fprintf(h, "%d%s%s%s", now, method, path, body)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to encode request secret for elliptic: %v",
			err,
		)
	}

	sig := base64.StdEncoding.EncodeToString(h.Sum(nil))

	req.Header.Set("Content-Type", "application/json")

	req.Header.Set("Accept", "application/json")

	req.Header.Set("x-access-key", t.apiKey)

	req.Header.Set("x-access-sign", sig)

	req.Header.Set("x-access-timestamp", strconv.FormatInt(now, 10))

	return http.DefaultTransport.RoundTrip(req)
}

func getWalletAnalysis(u, apiKey, secret string, network_ network.BlockchainNetwork, address ethereum.Address) (*WalletAnalysisResponse, error) {
	t := transport{
		apiKey: apiKey,
		secret: secret,
	}

	c := http.Client{
		Transport: &t,
	}

	b := new(bytes.Buffer)

	json.NewEncoder(b).Encode(map[string]interface{}{
		"subject": map[string]interface{}{
			"asset": "holistic",
			"blockchain": string(network_),
			"type": "address",
			"hash": address.String(),
		},
	})

	resp, err := c.Post(u, "", b)

	if err != nil {
		return nil, fmt.Errorf("failed to decode wallet analysis response: %v", err)
	}

	defer resp.Body.Close()

	var analysis WalletAnalysisResponse

	err = json.NewDecoder(resp.Body).Decode(&analysis)

	if err != nil {
		return nil, fmt.Errorf("failed to decode a wallet analysis response: %v", err)
	}

	return &analysis, nil
}

func GetWalletAnalysis(network_ network.BlockchainNetwork, address ethereum.Address) WalletAnalysisResponse {
	config := <-keyRequests

	var (
		apiKey = config.apiKey
		secret = config.secret
	)

	resp, err := getWalletAnalysis(UrlEllipticAml, apiKey, secret, network_, address)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to get wallet analysis for addr %v, network %v",
				address,
				network_,
			)

			k.Payload = err
		})
	}

	return *resp
}
