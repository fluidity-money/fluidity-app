package util

func UintMin(left, right int) int {
	if left > right {
		return right
	} else {
		return left
	}
}
