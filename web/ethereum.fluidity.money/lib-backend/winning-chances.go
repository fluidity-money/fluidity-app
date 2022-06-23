package api_fluidity_money

import (
	"errors"
	"fmt"
	"math/big"
	"net/http"

	"github.com/fluidity-money/fluidity-app/common/calculation/probability"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/graphql-go/graphql"
)

type Result struct {
	N       string  `json:"n"`
	Payouts []int64 `json:"payouts"`
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

					var output Result
					err := errors.New("Bad request, missing payload value")

					gasFee, ok := validArgFloat64toBigrat(p.Args, "gasFee")
					if !ok {
						return nil, err
					}

					atx, ok := validArgFloat64toBigrat(p.Args, "atx")
					if !ok {
						return nil, err
					}

					sizeOfThePool, ok := validArgInt64toUInt64Bigrat(p.Args, "sizeOfThePool")
					if !ok {
						return nil, err
					}

					underlyingTokenDecimalsRat, ok := validArgInt64toUInt64Bigrat(p.Args, "underlyingTokenDecimalsRat")
					if !ok {
						return nil, err
					}

					averageTransfersInBlock, ok := validArgInt(p.Args, "averageTransfersInBlock")
					if !ok {
						return nil, err
					}

					secondsSinceLastBlock, ok := validArgInt(p.Args, "secondsSinceLastBlock")
					if !ok {
						return nil, err
					}

					tokenName, ok := validArgString(p.Args, "tokenName")
					if !ok {
						return nil, err
					}

					emission := worker.NewEthereumEmission()
					emission.Network = "ethereum"
					emission.TokenDetails = token_details.New(tokenName, p.Args["underlyingTokenDecimalsRat"].(int))

					var (
						winningClasses   = fluidity.WinningClasses
						deltaWeightNum   = fluidity.DeltaWeightNum
						deltaWeightDenom = fluidity.DeltaWeightDenom
						payoutFreqNum    = fluidity.PayoutFreqNum
						payoutFreqDenom  = fluidity.PayoutFreqDenom
					)

					var (
						deltaWeight = big.NewRat(deltaWeightNum, deltaWeightDenom)
						payoutFreq  = big.NewRat(payoutFreqNum, payoutFreqDenom)
					)

					randomN, randomPayouts := probability.WinningChances(
						gasFee,
						atx,
						sizeOfThePool,
						underlyingTokenDecimalsRat,
						payoutFreq,
						deltaWeight,
						winningClasses,
						averageTransfersInBlock,
						uint64(secondsSinceLastBlock),
						emission,
					)

					output.N = fmt.Sprintf("%v", randomN)
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
		Query: queryType,
	},
)

func executeQuery(query string, schema graphql.Schema) *graphql.Result {
	result := graphql.Do(graphql.Params{
		Schema:        schema,
		RequestString: query,
	})

	return result
}

func HandleWinningChances(w http.ResponseWriter, r *http.Request) interface{} {
	result := executeQuery(r.URL.Query().Get("query"), schema)

	if len(result.Errors) > 0 {
		graphQLErrorLogHandler(w, r, result.Errors)
		return nil
	}

	return result
}
