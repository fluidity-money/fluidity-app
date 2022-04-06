package misc

// misc implements misc types and functions for decoding datatypes to
// internal representations not dependant on the definitions in go ethereum
// (and more!)

// has0xPrefix validates str begins with '0x' or '0X'.
func has0xPrefix(str string) bool {
	return len(str) >= 2 && str[0] == '0' && (str[1] == 'x' || str[1] == 'X')
}
