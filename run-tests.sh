#!/bin/sh -e

export FLU_DEBUG_DIE_FAST=true

go test ./...
