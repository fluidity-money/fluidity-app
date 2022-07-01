package applications

// Enum that represents supported applications on Ethereum, used to obtain
// application-specific information like fees and senders/recipients.
type Application int64

const (
	// ApplicationNone is the nil value representing an invalid application.
	ApplicationNone Application = iota
	ApplicationUniswapV2
	ApplicationOneInchSwap
	ApplicationMooniswap
	// TODO: OneInchP2P
)

const (
	UniswapSwapLogTopic   = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
	OneInchSwapLogTopic   = "0xbd99c6719f088aa0abd9e7b7a4a635d1f931601e9f304b538dc42be25d8c65c6"
	MooniswapSwapLogTopic = "0x86c49b5d8577da08444947f1427d23ef191cfabf2c0788f93324d79e926a9302"
)
