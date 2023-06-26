// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package elliptic

import (
	"testing"
	"net/http"
	"fmt"
	"bytes"
	"encoding/json"
	"net/http/httptest"

	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"

	"github.com/stretchr/testify/assert"
)

const testWalletAnalysisJson = `
{
	"analysed_by": {
		"id": "ebf35e9e-3519-4293-accb-db70209731bc",
		"type": "api_key"
	},
	"cluster_entities": [
		{
			"name": "Example name",
			"category": "Example category",
			"is_primary_entity": true,
			"is_vasp": false
		}
	],
	"id": "bcbd4c6f-78b5-453a-af30-147b6332863c",
	"screening_id": "86b09f7b-160e-44f8-bd25-136611e4ff4d",
	"subject": {
		"asset": "holistic",
		"hash": "0x9b322e68bee8f7d6c1c4d32083e9fe159a36aab1",
		"type": "address",
		"blockchain": "holistic"
	},
	"type": "wallet_exposure",
	"customer": {
		"reference": "my_customer"
	},
	"created_at": "2023-05-10T19:03:30.837Z",
	"updated_at": "2023-05-10T19:05:42.840Z",
	"analysed_at": "2023-05-10T19:05:43.560Z",
	"process_status": "complete",
	"process_status_id": 2,
	"workflow_status_id": 1,
	"workflow_status": "active",
	"error": null,
	"asset_tier": "full",
	"risk_score": 10,
	"blockchain_info": {
		"cluster": {
			"inflow_value": {
				"usd": 1234567.9
			},
			"outflow_value": {
				"usd": 1234555.9
			}
		}
	},
	"risk_score_detail": {
		"destination": 10,
		"source": 10
	},
	"evaluation_detail": {
		"source": [
			{
				"rule_id": "8e32e0ea-6b5f-44f3-9b5c-20c9938be29a",
				"risk_score": 10,
				"matched_elements": [
					{
						"contributions": [
							{
								"risk_triggers": {
									"category_id": "e7dad301-3cd1-45c5-a40f-f23c9f8e765b",
									"category": "Example category",
									"is_sanctioned": false
								},
								"contribution_percentage": 100,
								"entity": "Example name",
								"contribution_value": {
									"usd": 123.45
								}
							}
						],
						"category": "Example category",
						"contribution_percentage": 100,
						"contribution_value": {
							"usd": 123.45
						}
					}
				],
				"rule_name": "My custom risk rule"
			}
		],
		"destination": [
			{
				"rule_id": "8e32e0ea-6b5f-44f3-9b5c-20c9938be29a",
				"risk_score": 10,
				"matched_elements": [
					{
						"contributions": [
							{
								"risk_triggers": {
									"category_id": "e7dad301-3cd1-45c5-a40f-f23c9f8e765b",
									"category": "Example category",
									"is_sanctioned": false
								},
								"contribution_percentage": 100,
								"entity": "Example name",
								"contribution_value": {
									"usd": 123.45
								}
							}
						],
						"category": "Example category",
						"contribution_percentage": 100,
						"contribution_value": {
							"usd": 123.45
						}
					}
				],
				"rule_name": "My custom risk rule"
			}
		]
	},
	"contributions": {
		"source": [
			{
				"entities": [
					{
						"name": "Example entity name",
						"category": "Example entity category",
						"is_primary_entity": true,
						"is_vasp": false
					}
				],
				"contribution_percentage": 100,
				"contribution_value": {
					"usd": 123.45
				}
			}
		],
		"destination": [
			{
				"entities": [
					{
						"name": "Example entity name",
						"category": "Example entity category",
						"is_primary_entity": true,
						"is_vasp": false
					}
				],
				"contribution_percentage": 100,
				"contribution_value": {
					"usd": 123.45
				}
			}
		]
	},
	"changes": {
		"risk_score_change": 0
	}
}
`

func mockServer() *httptest.Server {
	web.Endpoint("/wallet-screen", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, testWalletAnalysisJson)
	})

	return httptest.NewServer(nil)
}

func TestGetWalletAnalysis(t *testing.T) {
	srv := mockServer()

	res, err := getWalletAnalysis(
		srv.URL + "/wallet-screen",
		"",
		"",
		network.NetworkArbitrum,
		ethereum.AddressFromString(""),
	)

	if err != nil {
		t.Fatalf("failed to get wallet analysis in mock: %v", err)
	}

	v := new(bytes.Buffer)

	json.NewEncoder(v).Encode(res)

	assert.JSONEq(t, v.String(), testWalletAnalysisJson)
}
