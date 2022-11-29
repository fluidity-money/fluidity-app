package trm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/fluidity-money/fluidity-app/lib/util"
)

type RiskScoreLevel int

const (
	Unknown RiskScoreLevel = 0
	Low     RiskScoreLevel = 1
	Medium  RiskScoreLevel = 5
	High    RiskScoreLevel = 10
	Severe  RiskScoreLevel = 15
)

type RiskType int

const (
	COUNTERPARTY RiskType = iota
	INDIRECT
	OWNERSHIP
)

type AddressRiskRequestEntry struct {
	Address           string `json:"address"`
	Chain             string `json:"chain"`
	AccountExternalId string `json:"accountExternalId"`
}

type AddressRiskRequest []AddressRiskRequestEntry

type AddressRiskIndicator struct {
	Category                    string         `json:"category"`
	CategoryId                  string         `json:"categoryId"`
	CategoryRiskScoreLevel      RiskScoreLevel `json:"categoryRiskScoreLevel"`
	CategoryRiskScoreLevelLabel string         `json:"categoryRiskScoreLevelLabel"`
	IncomingVolumeUsd           string         `json:"incomingVolumeUsd"`
	OutgoingVolumeUsd           string         `json:"outgoingVolumeUsd"`
	RiskType                    RiskType       `json:"riskType"`
	TotalVolumeUsd              string         `json:"totalVolumeUsd"`
}

type Entity struct {
	Category            string         `json:"category"`
	CategoryId          string         `json:"categoryId"`
	Entity              string         `json:"entity"`
	RiskScoreLevel      RiskScoreLevel `json:"RiskScoreLevel"`
	RiskScoreLevelLabel string         `json:"RiskScoreLevelLabel"`
	TrmUrn              string         `json:"trmUrn"`
	TrmAppUrl           string         `json:"trmAppUrl"`
}

type AddressRiskResponse []struct {
	AccountExternalId     string                 `json:"accountExternalId"`
	Address               string                 `json:"address"`
	AddressRiskIndicators []AddressRiskIndicator `json:"addressRiskIndicators"`
	AddressSubmitted      string                 `json:"addressSubmitted"`
	Chain                 string                 `json:"chain"`
	Entities              []Entity               `json:"entities"`
	TrmAppUrl             string                 `json:"trmAppUrl"`
}

// EnvTrmUrl to interact with the TRM Labs API
const EnvTrmUrl = `FLU_WEB_TRM_URL`

// GetAddressesRisk to fetch the risk score of an address on a given network
func GetAddressesRisk(addresses []string, network string) ([]RiskScoreLevel, error) {

	trmUrl := util.GetEnvOrDefault(EnvTrmUrl, "")

	if trmUrl == "" {
		return nil, fmt.Errorf(
			"TRM URL environment variable was unset!",
		)
	}

	request_ := make(AddressRiskRequest, len(addresses))
	for i, address := range addresses {
		request_[i] = AddressRiskRequestEntry{
			Address: address,
			Chain:   network,
		}
	}

	requestBuffer, err := json.Marshal(request_)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to marshal address risk request! %v",
			err,
		)
	}

	request, err := http.NewRequest("POST", trmUrl, bytes.NewBuffer(requestBuffer))

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to create address risk request! %v",
			err,
		)
	}

	client := http.DefaultClient

	response, err := client.Do(request)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to post address risk request! %v",
			err,
		)
	}

	defer response.Body.Close()

	body, _ := ioutil.ReadAll(response.Body)

	var risks AddressRiskResponse

	if err := json.Unmarshal(body, &risks); err != nil {
		return nil, fmt.Errorf(
			"Failed to unmarshal address risk response! %v",
			err,
		)
	}

	riskLevels := make([]RiskScoreLevel, len(risks))
	for i, risk := range risks {
		var (
			indicators = risk.AddressRiskIndicators
			indicator  = indicators[0]
		)
		riskLevels[i] = indicator.CategoryRiskScoreLevel
	}

	return riskLevels, nil
}

// AreAddressesBanned to return whether or not addresses should be considered banned
func AreAddressesBanned(addresses []string, network string) ([]bool, error) {
	riskLevels, err := GetAddressesRisk(addresses, network)

	if err != nil {
		return nil, err
	}

	banned := make([]bool, len(riskLevels))
	for i, riskLevel := range riskLevels {
		banned[i] = riskLevel > High
	}

	return banned, nil
}
