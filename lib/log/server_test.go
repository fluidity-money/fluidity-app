package log

import (
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDebug(t *testing.T) {

	if os.Getenv(EnvDebug) != "true" {
		t.Skip(fmt.Sprintf(
			"%v not set, skipping Debug output!",
			EnvDebug,
		))
	}

	// mock logging stream
	var err error
	loggingStream, err = os.CreateTemp(t.TempDir(), "*")

	require.NoError(t, err,
		fmt.Sprintf(
			"Failed to create temp file for testing debug output! %v",
			err,
		),
	)

	message := "Test debug message"
	context := "TESTING"

	// make function call
	Debug(func(k *Log) {
		k.Message = message
		k.Context = context
	})

	// read output from mocked file
	result, err := ioutil.ReadFile(loggingStream.Name())

	require.NoError(t, err,
		fmt.Sprintf(
			"Failed to read bytes from mocked STDERR! %v",
			err,
		),
	)

	// check correctness
	formatString := fmt.Sprintf("\\[.*\\] \\[debug:%v\\] %v", context, message)
	matched, err := regexp.Match(formatString, result)

	assert.NoError(t, err,
		fmt.Sprintf(
			"Debug(%v) failed to match regexp! %v",
			message,
			err,
		),
	)

	assert.True(t, matched,
		fmt.Sprintf(
			"Debug(%v) = %v, want regexp match %v!",
			message,
			string(result),
			formatString,
		),
	)
}

func TestApp(t *testing.T) {
	// mock logging stream
	var err error
	loggingStream, err = os.CreateTemp(t.TempDir(), "*")

	require.NoError(t, err,
		fmt.Sprintf(
			"Failed to create temp file for testing app output! %v",
			err,
		),
	)

	message := "Test app message"
	context := "TESTING"

	// make function call
	App(func(k *Log) {
		k.Message = message
		k.Context = context
	})

	// read output from mocked file
	result, err := ioutil.ReadFile(loggingStream.Name())

	require.NoError(t, err,
		fmt.Sprintf(
			"Failed to read bytes from mocked STDERR! %v",
			err,
		),
	)

	// check correctness
	formatString := fmt.Sprintf("\\[.*\\] \\[app:%v\\] %v", context, message)
	matched, err := regexp.Match(formatString, result)

	assert.NoError(t, err,
		fmt.Sprintf(
			"App(%v) failed to match regexp! %v",
			message,
			err,
		),
	)

	assert.True(t, matched,
		fmt.Sprintf(
			"App(%v) = %v, want regexp match %v!",
			message,
			string(result),
			formatString,
		),
	)
}
