package postgres

import "testing"

func TestDebug(t *testing.T) {
	debug("msg %v %v", 123, 345)
}
