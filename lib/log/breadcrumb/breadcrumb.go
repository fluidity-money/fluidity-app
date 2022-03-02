package breadcrumb

import (
	"fmt"
	"runtime"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

// Breadcrumb that can have its arguments printed and cleared with some
// information on the function that called it
type Breadcrumb struct {
	content map[string]interface{} `json:"content"`
}

func NewBreadcrumb() *Breadcrumb {
	map_ := make(map[string]interface{}, 0)

	breadcrumb := Breadcrumb{
		content: map_,
	}

	return &breadcrumb
}

func (breadcrumb *Breadcrumb) Clear() {
	length := len(breadcrumb.content)

	breadcrumb.content = make(map[string]interface{}, length)
}

func (breadcrumb *Breadcrumb) Content() map[string]interface{} {
	return breadcrumb.content
}

func (crumb *Breadcrumb) Set(f func(k *Breadcrumb)) {

	if !log.DebugEnabled() {
		return
	}

	f(crumb)
}

func (crumb *Breadcrumb) Many(items map[string]interface{}) {

	_, file, line, _ := runtime.Caller(3)

	for key, value := range items {

		formattedName := fmt.Sprintf(
			"%v:%v /%v/",
			file,
			line,
			key,
		)

		crumb.content[formattedName] = value
	}
}

func (crumb Breadcrumb) One(key string, value interface{}) {

	_, file, line, _ := runtime.Caller(3)

	formattedName := fmt.Sprintf(
		"%v:%v /%v/",
		file,
		line,
		key,
	)

	crumb.content[formattedName] = value
}
