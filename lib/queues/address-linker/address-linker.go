package addresslinker

import (
	"github.com/fluidity-money/fluidity-app/lib/queue"
	types "github.com/fluidity-money/fluidity-app/lib/types/address-linker"
)

const (
	TopicLinkedAddresses = `ethereum.linked_addresses`
)

type (
	LinkedAddresses = types.LinkedAddresses
)

func LinkedAddressesEthereum(f func(LinkedAddresses)) {
	queue.GetMessages(TopicLinkedAddresses, func(message queue.Message) {
		var linkedAddresses LinkedAddresses

		message.Decode(&linkedAddresses)

		f(linkedAddresses)
	})
}
