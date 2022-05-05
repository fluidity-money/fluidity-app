package api_fluidity_money

import (
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
)

type Result struct {
	N          uint  `json:"n"`
	Payouts    []int64   `json:"payouts"`
}

var resultType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Result",
		Fields: graphql.Fields{
			"n": &graphql.Field{
				Type: graphql.Int,
			},
			"payouts": &graphql.Field{
				Type: graphql.NewList(graphql.Int),
			},
		},
	},
)

var queryType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			/* fetch winning-chance using query
			*  Example API query request
			*  http://localhost:8080/winning-chances?query={fetch(gasFee:3,atx:36000000,bpyStakedUsd:150,sizeOfThePool:10,underlyingTokenDecimalsRat:6,averageTransfersInBlock:13,secondsSinceLastBlock:15,tokenName:"USDT"){n,payouts}}
			*/
			"fetch": &graphql.Field{
				Type:        resultType,
				Description: "Get winnig-chances",
				Args: graphql.FieldConfigArgument{
					"gasFee": &graphql.ArgumentConfig{
						Type: graphql.Float,
					},
					"atx": &graphql.ArgumentConfig{
						Type: graphql.Float,
					},
					"bpyStakedUsd": &graphql.ArgumentConfig{
						Type: graphql.Float,
					},
					"sizeOfThePool": &graphql.ArgumentConfig{
						Type: graphql.Int,
					},
					"underlyingTokenDecimalsRat": &graphql.ArgumentConfig{
						Type: graphql.Int,
					},
					"averageTransfersInBlock": &graphql.ArgumentConfig{
						Type: graphql.Int,
					},
					"secondsSinceLastBlock": &graphql.ArgumentConfig{
						Type: graphql.Int,
					},
					"tokenName": &graphql.ArgumentConfig{
						Type: graphql.String,
					},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {

					var (
						gasFee                           = new(big.Rat).SetFloat64(p.Args["gasFee"].(float64))
						atx                              = new(big.Rat).SetFloat64(p.Args["atx"].(float64))
						bpyStakedUsd                     = new(big.Rat).SetFloat64(p.Args["bpyStakedUsd"].(float64))
						sizeOfThePool                    = new(big.Rat).SetUint64(uint64(p.Args["sizeOfThePool"].(int)))
						underlyingTokenDecimalsRat       = new(big.Rat).SetUint64(uint64(p.Args["underlyingTokenDecimalsRat"].(int)))
						averageTransfersInBlock          = p.Args["averageTransfersInBlock"].(int)
						secondsSinceLastBlock            = p.Args["secondsSinceLastBlock"].(int)
						tokenName                        = p.Args["tokenName"].(string)
					)

					emission := worker.NewEthereumEmission()
	                emission.Network = "ethereum"
	                emission.TokenDetails = token_details.New(tokenName, p.Args["underlyingTokenDecimalsRat"].(int))

					randomN, randomPayouts := probability.WinningChances(
						gasFee,
						atx,
						bpyStakedUsd,
						sizeOfThePool,
						underlyingTokenDecimalsRat,
						averageTransfersInBlock,
						uint64(secondsSinceLastBlock),
						emission,
					)

					var output Result
					output.N = randomN;
					for _, value := range randomPayouts {
						output.Payouts = append(output.Payouts, value.Int64())
					}

					return output, nil
				},
			},
		},
	})

var schema, _ = graphql.NewSchema(
	graphql.SchemaConfig{
		Query:    queryType,
	},
)

func executeQuery(query string, schema graphql.Schema) *graphql.Result {
	result := graphql.Do(graphql.Params{
		Schema:        schema,
		RequestString: query,
	})
	if len(result.Errors) > 0 {
		fmt.Printf("errors: %v", result.Errors)
	}
	return result
}

func HandleWinningChances(w http.ResponseWriter, r *http.Request) {
	result := executeQuery(r.URL.Query().Get("query"), schema)
	json.NewEncoder(w).Encode(result)
}