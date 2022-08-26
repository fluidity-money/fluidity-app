package pyth

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/near/borsh-go"
)

// PythMagicNumber is a specific u32 at the start of certain Pyth structs to
// help ensure the validity of Pyth data
const PythMagicNumber = 0xa1b2c3d4

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

func GetPrice(solanaClient *solana.SolanaRPCHandle, pricePubkey solana.PublicKey) (*big.Rat, error) {

	// get reserve bytes

	resp, err := solanaClient.GetAccountInfo(
		pricePubkey,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get price account with pubkey %v! %v",
			pricePubkey,
			err,
		)
	}

	// deserialise price bytes

	price := new(Price)

	err = borsh.Deserialize(price, resp.Value.Data.GetBinary())

	if err != nil {
		return nil, fmt.Errorf(
			"failed to deserialize price data! %v",
			err,
		)
	}

	if price.Magic != PythMagicNumber {
		return nil, fmt.Errorf(
			"bad pyth magic bytes with pubkey %#v!",
			pricePubkey,
		)
	}

	priceExpo := big.NewRat(10, 1)

	priceExpo = bigPowInt32(priceExpo, price.Expo)

	priceRat := new(big.Rat).SetInt64(price.Agg.Price)

	priceRat.Mul(priceRat, priceExpo)

	return priceRat, nil
}

var pythPrices = map[string]string{
	"F6v4wfAdJB8D8p77bMXZgYt8TDKsYxLYxH5AFhUkYx9W": "5bmWuR1dgP4avtGYMNKLuxumZTVKGgoN2BCMXWDNL9nY",
	"8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh": "9xYBiDWYsh2fHzpsz3aaCnNHCKWBNtfEDLtU6kS4aFD9",
	"Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1":  "8Td9VML1nHxQK6M8VVyzsHo32D7VBk72jSpa9U861z2A",
	"HtKKipqmgxMQJUob9XCgZBG6zSCZx4nA433ZfDuLyUTg": "HqFyq1wh1xKvL7KDqqT7NJeSPdAqsDqnmBisUC2XdXAX",
	"PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y":  "jrMH4afMEodMqirQ7P89q5bGNJxD8uceELcsZaVBDeh",
	"9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E": "GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU",
	"orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE":  "4ivThkX8uRxBpHsdWSqyXYihzKF3zpRGAUCqyuagnLoV",
	"EsPKhGTMf3bGoy4Qm7pCv3UCcWqAmbC1UGHBTDxRjjD4": "7Dn52EY5EGE8Nvvw98KVMGPWTiTGn3PF4y24TVLyXdT9",
	"9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i": "H8DvrfSaRfUyP1Ytse1exGf7VSinLWtmKNNaBhA4as9P",
	"MERt85fc5boKw3BW1eYdxonEuJNvXbiMbs6hvheau5K":  "G4AQpTYKH1Fmg38VpFQbv6uKYQMpRhJzNPALhp7hqdrs",
	"SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt":  "3NBReDRTLKMQEKiLD5tGcx4kXbTf88b7f2xLS9UuGjym",
	"4tfNrjsyMR35Jbvua7RM2n2zsrvWBfPsuqovGxcL2DHB": "EcV1X1gY2yb4KXxjVQtTHTbioum2gvmPnFk4zYAt7zne",
	"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD",
	"7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": "Bt1hEbY62aMriY1SyQqbeZbm8VmSbQVGBFzSzMuVNWzN",
	"So11111111111111111111111111111111111111112":  "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
	"Ajf4bxNoKCyFVfV35sRTgGwZK1dfJJJVXgNFs7ncC5EF": "3vxLXJqLqF3JG5TCbYycbKWRBbCJQLxQmBGCkyqEEefL",
	"HxhWkVpk5NS4Ltg5nij2G671CKXFRKPK8vy271Ub4uEK": "B47CC1ULLw1jKTSsr1N1198zrUHp3LPduzepJyzgLn2g",
	"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So":  "E4v1BBgoso9s64TQvmyownAVJbhbEPGyzA3qn4n46qj9",
	"MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac":  "79wm3jjcPr6RaNQ4DGvP5KxG1mNd3gEBsg6FsNVFezK4",
	"SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp":  "HkGEau5xY1e8REXUFbwvWWvyJGywkgiAZZFpryyraWqJ",
	"AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3": "8JPJJkmDScpcNmBRKGZuPuG2GYAveQgP3t5gFuMymwvF",
	"2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk": "JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB",
	"GoQjhy3tBcXRWdNfvyh6MPhiQAkNdrAyCJdqWJ3WuUpW": "8RMnV1eD55iqUFJLMguPkYBkq8DCtx81XcmAja93LvRR",
	"4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": "AnLf8tVYCM816gmBjiy8n53eXKKEDydT5piYjjQDPgTB",
	"4dmKkXNHdgYsXqBHCuMikNQWwVomZURhYvkkX5c4pQ7y": "BkN8hYgRjhyH5WNBQfDV73ivvdqNKfonCMhiYVJ1D9n9",
	"AUrMpCDYYcPuHhyNX8gEEqbmDPFUpBpHrNW3vPeCFn5Z": "Ax9ujW5B9oqcv59N8m6f1BpTBq2rGeGaBcpKjC5UYsXU",
	"BYPsjxa3YuZESQz1dKuBw1QSFCSpecsm8nCQhY5xbU1Z": "ECSFWQ1bnnpqPVvoy9237t2wddZAaHisW88mYxuEHKWf",
	"JET6zMJWkCN9tpRT2v2jfAmm5VnQFDpUBCyaKojmGtz":  "9j2xgDVWMY4WZXSj4AL4asCBtzCXz8jqRcDMbcVeZgNU",
	"EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp": "ETp9eKXVv1dWwHSpsXRUuXHmw24PwRkttCGVgpZEY9zF",
}

// GetPriceByToken takes an spl-token, and returns the corresponding pyth price
// for that token, automatically finding the price account
func GetPriceByToken(solanaClient *solana.SolanaRPCHandle, token string) (*big.Rat, error) {

	pythPricePubkeyString := pythPrices[token]

	if pythPricePubkeyString == "" {
		return nil, fmt.Errorf(
			"token %#v not found in Pyth price pubkey map!",
			token,
		)
	}

	pythPricePubkey, err := solana.PublicKeyFromBase58(pythPricePubkeyString)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get public key of Pyth price address %#v! %v",
			pythPricePubkeyString,
			err,
		)
	}

	pythPrice, err := GetPrice(solanaClient, pythPricePubkey)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get token Pyth price at Pyth price account %#v! %v",
			pythPricePubkey,
			err,
		)
	}

	return pythPrice, err
}
