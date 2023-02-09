#!/bin/sh -e

go test -run "^$FLU_TEST$"

gotestoutput=$?

echo "GO TEST EXITED WITH STATUS '$gotestoutput'"
