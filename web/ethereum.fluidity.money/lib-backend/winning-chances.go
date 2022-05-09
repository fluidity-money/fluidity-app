package api_fluidity_money

import (
	"net/http"
	"errors"

	"github.com/graphql-go/graphql"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/fluidity-money/fluidity-app/lib/log"
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

					var output Result

					size := len(p.Args)
					if size < 8 {
						return output, errors.New("Bad request, missing payload value")
					}
					
					var (
						gasFee                           = convertFloat64toBigrat(p.Args["gasFee"].(float64))
						atx                              = convertFloat64toBigrat(p.Args["atx"].(float64))
						bpyStakedUsd                     = convertFloat64toBigrat(p.Args["bpyStakedUsd"].(float64))
						sizeOfThePool                    = convertUint64toBigrat(uint64(p.Args["sizeOfThePool"].(int)))
						underlyingTokenDecimalsRat       = convertUint64toBigrat(uint64(p.Args["underlyingTokenDecimalsRat"].(int)))
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

	return result
}

func HandleWinningChances(w http.ResponseWriter, r *http.Request) interface{} {
	ipAddress := web.GetIpAddress(r)
	result := executeQuery(r.URL.Query().Get("query"), schema)

	if len(result.Errors) > 0 {
		log.App(func(k *log.Log) {
			k.Format(
				"Failed to execute a GraphQL request from ip address %#v, due to  %s",
				ipAddress,
				result.Errors,
			)
		})
		w.WriteHeader(http.StatusBadRequest)
	}
	
	return result
}