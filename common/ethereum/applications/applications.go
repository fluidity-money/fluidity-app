package applications

// Enum that represents supported applications on Ethereum, used to obtain
// application-specific information like fees and senders/recipients.
type Application int64

const (
	// ApplicationNone is the nil value representing an invalid application.
	ApplicationNone Application = iota
	ApplicationUniswapV2
	ApplicationOneInchLPV2
	ApplicationOneInchLPV1
	ApplicationMooniswap
	ApplicationOneInchFixedRateSwap
	ApplicationOneInchP2P
)

const (
	UniswapSwapLogTopic          = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
	OneInchLPV2SwapLogTopic      = "0xbd99c6719f088aa0abd9e7b7a4a635d1f931601e9f304b538dc42be25d8c65c6"
	OneInchLPV1SwapLogTopic      = "0x2a368c7f33bb86e2d999940a3989d849031aff29b750f67947e6b8e8c3d2ffd6"
	MooniswapSwapLogTopic        = "0x86c49b5d8577da08444947f1427d23ef191cfabf2c0788f93324d79e926a9302"
	OneInchFixedRateSwapLogTopic = "0x803540962ed9acbf87226c32486d71e1c86c2bdb208e771bab2fd8a626f61e89"
)
