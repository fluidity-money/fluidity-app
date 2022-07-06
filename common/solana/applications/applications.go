package applications

import "github.com/fluidity-money/fluidity-app/lib/log"

type Application int64

const (
	// ApplicationSpl is the default application, representing a transfer
	ApplicationSpl Application = iota
	ApplicationSaber
)

// applicationNames is used to map human readable names to their enum varients
var applicationNames = map[string]Application {
	"spl": ApplicationSpl,
	"saber": ApplicationSaber,
}

func ParseApplicationName(name string) Application {
	app, exists := applicationNames[name]
	if !exists {
		log.Fatal(func (k *log.Log) {
			k.Format("Unknown app name %s!", name)
		})
	}

	return app
}
