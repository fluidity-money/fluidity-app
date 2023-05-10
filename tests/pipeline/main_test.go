package main

import (
	"os"
	"testing"
)

const EnvRunPipelineTests = `FLU_RUN_PIPELINE_TESTS`

func TestMain(m *testing.M) {
	if os.Getenv(EnvRunPipelineTests) == "true" {
		m.Run()
	}
}
