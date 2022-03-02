package website

// website contains types relevant to messages generated on a
// public-facing information website

// Sources that the user went through to submit a question to our database!
const (
	SourceLanding = "landing"
	SourceFaucet = "faucet"
)

// Question asked by a user using a frontend
type (
	Question struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Question string `json:"question"`
		Source   string `json:"source"`
	}

	Subscription struct {
		Email string `json:"email"`
		Source string `json:"source"`
	}
)