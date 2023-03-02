package libtest

import (
	"crypto/ecdsa"

	"github.com/ethereum/go-ethereum/accounts"
	"github.com/fluidity-money/fluidity-app/lib/log"
	hdwallet "github.com/miguelmota/go-ethereum-hdwallet"
)

const DefaultEthDerivationPath = "m/44'/60'/0'/0/0"

type Wallet struct {
    wallet *hdwallet.Wallet
    nextPath func() accounts.DerivationPath
}

func (w *Wallet) Next() accounts.Account {
    return mustDerive(w.wallet, w.nextPath())
}

func (w *Wallet) PrivateKey(account accounts.Account) (*ecdsa.PrivateKey, error) {
    return w.wallet.PrivateKey(account)
}

func NewWalletFromSeed(seed string) Wallet {
    wallet, err := hdwallet.NewFromMnemonic(seed)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Format("Failed to derive a wallet from %s", seed)
            k.Payload = err
        })
    }

    basePath := hdwallet.MustParseDerivationPath(DefaultEthDerivationPath)

    return Wallet{
    	wallet: wallet,
    	nextPath: accounts.DefaultIterator(basePath),
    }
}

func mustDerive(wallet *hdwallet.Wallet, path accounts.DerivationPath) accounts.Account {
    account, err := wallet.Derive(path, false)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to derive an account!"
            k.Payload = err
        })
    }

    return account
}
