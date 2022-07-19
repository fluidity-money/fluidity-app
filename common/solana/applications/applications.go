package applications

import "fmt"

// Application supported by the Solana application server
type Application int64

const (
	// ApplicationSpl is the default application, representing a transfer
	ApplicationSpl Application = iota
	ApplicationSaber
)

// applicationNames is used to map human readable names to their enum varients
var applicationNames = map[string]Application{
	"spl":   ApplicationSpl,
	"saber": ApplicationSaber,
}

// ParseApplication based on the name given, looking it up in the internal
// map with the internal definition
func ParseApplicationName(name string) (*Application, error) {
	app_, exists := applicationNames[name]

	if !exists {
		return nil, fmt.Errorf(
			"unknown app name %s",
			name,
		)
	}

	app := app_

	return &app, nil
}
