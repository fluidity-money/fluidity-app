#!/bin/sh -e

. ./tests-profile.sh

go test -skip "$TestPipeline" ../...
