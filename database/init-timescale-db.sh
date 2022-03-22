#!/bin/sh

set -e

REPO="/usr/src/fluidity-migrations-timescale"

dbmate -u "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@:5432/${POSTGRES_DB}?sslmode=disable" -d "$REPO/build/timescale" up

