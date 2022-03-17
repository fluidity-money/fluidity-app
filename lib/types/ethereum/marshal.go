package ethereum

// marshal handles marshal and unmarshal code for our ethereum types

import "encoding/json"

func marshalJson(obj interface{}) ([]byte, error) {
	return json.Marshal(obj)
}

func (blockHeader BlockHeader) MarshalBinary() ([]byte, error) {
	return marshalJson(blockHeader)
}

func (transaction Transaction) MarshalBinary() ([]byte, error) {
	return marshalJson(transaction)
}

func (log Log) MarshalBinary() ([]byte, error) {
	return marshalJson(log)
}

func (receipt Receipt) MarshalBinary() ([]byte, error) {
	return marshalJson(receipt)
}
