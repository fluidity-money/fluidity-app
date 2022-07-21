// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package log

import (
	"os"
	"os/exec"
	"testing"
)

// TestFatal to see if the process exits, running in an `exec` subprocess
func TestFatal(t *testing.T) {
	if os.Getenv("FLU_EXIT_FATAL") == "1" {
		Fatal(func(k *Log) {})
		return
	}

	cmd := exec.Command(os.Args[0], "-test.run=TestFatal")
	cmd.Env = append(os.Environ(), "FLU_EXIT_FATAL=1")
	err := cmd.Run()

	if e, ok := err.(*exec.ExitError); ok && !e.Success() {
		return
	}

	t.Fatalf("process ran with err %v, want exit status 1", err)
}
