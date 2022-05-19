package cookie

import (
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"crypto/rand"
	"fmt"
	"encoding/json"
	"io"
	"net/http"
)

func returnAccessDenied(w http.ResponseWriter) {
	w.WriteHeader(HeaderAccessDenied)
}

func setCorsHeaders(w http.ResponseWriter) {
	headers := w.Header()

	headers.Set(web.HeaderCorsAllowOrigin, "*")
	headers.Set(web.HeaderCorsAllowHeaders, "*")
}

func generateCookie() string {
	buf := make([]byte, CookieGeneratedSize / 2)

	if _, err := rand.Read(buf); err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context
			k.Message = "Failed to generate randomness for a cookie!"
			k.Payload = err
		})
	}

	cookie := fmt.Sprintf("%x", buf)

	return cookie
}

// sendEndpointLogin to the user, after creating it and serialising it
func sendEndpointLogin(w io.Writer, cookieName string, expiration uint64) error {
	endpointLoginReturn := EndpointLoginReturn {
		CookieName: cookieName,
		Expiration: expiration,
	}

	err := json.NewEncoder(w).Encode(endpointLoginReturn)

	if err != nil {
		return fmt.Errorf(
			"Failed to send the endpoint login return JSON! %v",
			err,
		)
	}

	return nil
}
