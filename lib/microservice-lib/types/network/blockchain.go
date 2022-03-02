package network

// blockchain networks that we currently support, hardcoded for the SQL constants

// BlockchainNetwork backend that we currently support
type BlockchainNetwork string

const (
	NetworkEthereum BlockchainNetwork = `ethereum`
	NetworkSolana   BlockchainNetwork = `solana`
)
