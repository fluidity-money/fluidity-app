package pyth

import (
	"context"
	"fmt"
	"math/big"

	solana "github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

type (
	// pyth enum {Unknown, Price}
	PriceType uint32

	// pyth Exponentially-weighted moving average
	Ema struct {
		Val   int64
		Numer int64
		Denom int64
	}

	// pyth enum {Unknown, Trading, Halted, Auction}
	PriceStatus uint8

	// pyth enum {NoCorpAct}
	CorpAction uint8

	PriceInfo struct {
		// current price
		Price int64
		// confidence interval
		Conf uint64
		// status of price
		Status PriceStatus
		// notificatoin of corporate action
		CorpAct CorpAction
		PubSlot uint64
	}

	PriceComp struct {
		// key of contributing publisher
		Publisher solana.PublicKey
		// the price used to compute the current aggregate price
		Agg PriceInfo
		// The publisher's latest price. This price will be incorporated into the aggregate price
		// when price aggregation runs next.
		Latest PriceInfo
	}

	Price struct {
		// pyth magic number
		Magic uint32
		// program version
		Ver uint32
		// account type
		Atype uint32
		// price account size
		Size uint32
		// price or calculation type
		Ptype PriceType
		// price exponent
		Expo int32
		// number of component prices
		Num uint32
		// number of quoters that make up aggregate
		Num_qt uint32
		// slot of last valid (not unknown) aggregate price
		Last_slot uint64
		// valid slot-time of agg. price
		Valid_slot uint64
		// time-weighted average price
		Twap Ema
		// time-weighted average confidence interval
		Twac Ema
		// space for future derived values
		Drv1 int64
		// space for future derived values
		Drv2 int64
		// product account key
		Prod solana.PublicKey
		// next Price account in linked list
		Next solana.PublicKey
		// valid slot of previous update
		Prev_slot uint64
		// aggregate price of previous update
		Prev_price int64
		// confidence interval of previous update
		Prev_conf uint64
		// space for future derived values
		Drv3 int64
		// aggregate price info
		Agg PriceInfo
		// price components one per quoter
		Comp [32]PriceComp
	}
)

func GetPrice(solanaClient *rpc.Client, pricePubkey solana.PublicKey) (*big.Rat, error) {

	// get reserve bytes

	resp, err := solanaClient.GetAccountInfo(
		context.TODO(),
		pricePubkey,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get price account with pubkey %#v! %v",
			pricePubkey,
			err,
		)
	}

	// deserialise price bytes

	price := new(Price)

	err = borsh.Deserialize(price, resp.Value.Data.GetBinary())

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to deserialize price data! %v",
			err,
		)
	}

	if price.Magic != 0xa1b2c3d4 {
		return nil, fmt.Errorf(
			"Bad pyth magic bytes with pubkey %#v!",
			pricePubkey,
		)
	}

	priceExpo := big.NewRat(10, 1)

	priceExpo = bigPowInt32(priceExpo, price.Expo)

	priceRat := new(big.Rat).SetInt64(price.Agg.Price)

	priceRat.Mul(priceRat, priceExpo)

	return priceRat, nil
}

func GetPriceByToken(solanaClient *rpc.Client,  token string) (*big.Rat, error){
	PythPrices := map[string]string{
		/*
		"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD",
		"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "3vxLXJqLqF3JG5TCbYycbKWRBbCJQLxQmBGCkyqEEefL",
		*/
		"F6v4wfAdJB8D8p77bMXZgYt8TDKsYxLYxH5AFhUkYx9W": "5bmWuR1dgP4avtGYMNKLuxumZTVKGgoN2BCMXWDNL9nY",
		"8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh": "9xYBiDWYsh2fHzpsz3aaCnNHCKWBNtfEDLtU6kS4aFD9",
		"Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1": "8Td9VML1nHxQK6M8VVyzsHo32D7VBk72jSpa9U861z2A",
		"HtKKipqmgxMQJUob9XCgZBG6zSCZx4nA433ZfDuLyUTg": "HqFyq1wh1xKvL7KDqqT7NJeSPdAqsDqnmBisUC2XdXAX",
		"PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y": "jrMH4afMEodMqirQ7P89q5bGNJxD8uceELcsZaVBDeh",
		"9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E": "GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU",
		"orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE": "4ivThkX8uRxBpHsdWSqyXYihzKF3zpRGAUCqyuagnLoV",
		"EsPKhGTMf3bGoy4Qm7pCv3UCcWqAmbC1UGHBTDxRjjD4": "7Dn52EY5EGE8Nvvw98KVMGPWTiTGn3PF4y24TVLyXdT9",
		"9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i": "H8DvrfSaRfUyP1Ytse1exGf7VSinLWtmKNNaBhA4as9P",
		"MERt85fc5boKw3BW1eYdxonEuJNvXbiMbs6hvheau5K": "G4AQpTYKH1Fmg38VpFQbv6uKYQMpRhJzNPALhp7hqdrs",
		"SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt": "3NBReDRTLKMQEKiLD5tGcx4kXbTf88b7f2xLS9UuGjym",
		"4tfNrjsyMR35Jbvua7RM2n2zsrvWBfPsuqovGxcL2DHB": "EcV1X1gY2yb4KXxjVQtTHTbioum2gvmPnFk4zYAt7zne",
		"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD",
		"7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": "Bt1hEbY62aMriY1SyQqbeZbm8VmSbQVGBFzSzMuVNWzN",
		"So11111111111111111111111111111111111111112": "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
		"Ajf4bxNoKCyFVfV35sRTgGwZK1dfJJJVXgNFs7ncC5EF": "3vxLXJqLqF3JG5TCbYycbKWRBbCJQLxQmBGCkyqEEefL",
		"HxhWkVpk5NS4Ltg5nij2G671CKXFRKPK8vy271Ub4uEK": "B47CC1ULLw1jKTSsr1N1198zrUHp3LPduzepJyzgLn2g",
		/*
		"": "E4v1BBgoso9s64TQvmyownAVJbhbEPGyzA3qn4n46qj9",
		"": "HMVfAm6uuwnPnHRzaqfMhLNyrYHxaczKTbzeDcjBvuDo",
		"": "2k1qZ9ZMNUNmpGghq6ZQRj7z2d2ATNnzzYugVhiTDCPn",
		"": "79wm3jjcPr6RaNQ4DGvP5KxG1mNd3gEBsg6FsNVFezK4",
		"": "7ycfa1ENNT5dVVoMtiMjsgVbkWKFJbu6nF2h1UVT18Cf",
		"": "4p19xb5BAJaykjbdXwqowmNrYwbSBRSGz5hRm7c7TUBJ",
		"": "m24crrKFG5jw5ySpvb1k83PRFKVUgzTRm4uvK2WYZtX",
		"": "HkGEau5xY1e8REXUFbwvWWvyJGywkgiAZZFpryyraWqJ",
		"": "8WgyG6Rss2MzHu5bJh7ELxkH6XtwE4wsFouVSb4DvHpR",
		"": "8JPJJkmDScpcNmBRKGZuPuG2GYAveQgP3t5gFuMymwvF",
		"": "AtZbXC9LFhSPxYikz78CaLUuDZcmweWLY96eRJbzspB8",
		"": "JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB",
		"": "8RMnV1eD55iqUFJLMguPkYBkq8DCtx81XcmAja93LvRR",
		"": "AnLf8tVYCM816gmBjiy8n53eXKKEDydT5piYjjQDPgTB",
		"": "BkN8hYgRjhyH5WNBQfDV73ivvdqNKfonCMhiYVJ1D9n9",
		"": "Ax9ujW5B9oqcv59N8m6f1BpTBq2rGeGaBcpKjC5UYsXU",
		"": "ECSFWQ1bnnpqPVvoy9237t2wddZAaHisW88mYxuEHKWf",
		"": "4JZWJpMYPvNyADn2BgVwy8Z3zTgXfyWiaV2gvKNda4Hw",
		"": "EHkW5sh588isxidKdTvpmBgRQTg9fta6qQMcWQirPVD2",
		"": "GAD1XUUU6pU41LZXMbBzbKDT5SGB1nSamFosF2HrX23s",
		"": "kQC7awXFEMX6Kcva1SAgCtEyUEDgg8S1sh2ddoQpwDZ",
		"": "9j2xgDVWMY4WZXSj4AL4asCBtzCXz8jqRcDMbcVeZgNU",
		"": "FsSM3s38PX9K7Dn6eGzuE29S2Dsk1Sss1baytTQdCaQj",
		"": "45rTB9ezDcTX5tMZx2uJUBbBEqAWDhXykYbBfaSWUXvD",
		"": "GCXQHTQYCpNDyx41kUkxs3S4Vmuoq18rgTjKzc6pWd89",
		"": "CrCpTerNqtZvqLcKqz1k13oVeXV9WkMD2zA9hBKXrsbN",
		"": "ETp9eKXVv1dWwHSpsXRUuXHmw24PwRkttCGVgpZEY9zF",
		"": "B8piRrj78PWq59VL5PJ4fZ8JxbsQB6sFKQTuaEEGsCuz",
		"": "H6dt83FavYgfJR8oV7HewKWZjzveFFiDhq41VbmDYnVF",
		*/
	}

	pythPricePubkeyString := PythPrices[token]

	if pythPricePubkeyString == "" {
		return nil, fmt.Errorf(
			"Token not found in Pyth price pubkey map!",
		)
	}

	pythPricePubkey := solana.MustPublicKeyFromBase58(pythPricePubkeyString)

	pythPrice, err := GetPrice(solanaClient, pythPricePubkey)

	return pythPrice, err
}
