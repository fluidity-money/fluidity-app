package applications

// Enum that represents supported applications on Ethereum, used to obtain
// application-specific information like fees and senders/recipients.
type Application int64

const (
	// ApplicationNone is the nil value representing an invalid application.
	ApplicationNone Application = iota
	ApplicationUniswapV2
	ApplicationBalancerV2
)

const (
	UniswapSwapLogTopic  = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
	BalancerSwapLogTopic = "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b"
)
