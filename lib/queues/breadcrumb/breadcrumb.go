package breadcrumb

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/breadcrumb"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// TopicRoot to format using the worker id before sending down
	TopicRoot = "breadcrumbs"

	// Context used for logging
	Context = "BREADCRUMB"
)

type (
	Breadcrumb = breadcrumb.Breadcrumb

	BreadcrumbSent struct {
		Content  map[string]interface{} `json:"breadcrumb"`
		WorkerId string                 `json:"worker_id"`
	}
)

func NewBreadcrumb() *Breadcrumb {
	return breadcrumb.NewBreadcrumb()
}

func Send(crumb *Breadcrumb) {
	workerId := util.GetWorkerId()

	topic := fmt.Sprintf("%v.%v", TopicRoot, workerId)

	breadcrumbSent := BreadcrumbSent{
		Content:  crumb.Content(),
		WorkerId: workerId,
	}

	queue.SendMessage(topic, breadcrumbSent)

	log.Debug(func(k *log.Log) {
		k.Context = Context
		k.Message = "Sent breadcrumb with content"
		k.Payload = breadcrumbSent
	})
}

func SendAndClear(crumb *Breadcrumb) {
	Send(crumb)
	crumb.Clear()
}
