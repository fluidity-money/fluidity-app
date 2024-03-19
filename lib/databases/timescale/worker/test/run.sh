#!/bin/sh -e

export \
	FLU_TIMESCALE_URI=${FLU_TIMESCALE_URI:-postgres://fluidity:fluidity@localhost?sslmode=disable}

go test
