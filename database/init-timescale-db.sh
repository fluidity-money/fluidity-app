#!/bin/sh

set -e

repo="/usr/src/fluidity-migrations-timescale"

$repo/dbmate -u "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@:5432/${POSTGRES_DB}?sslmode=disable" -d "$repo/build/timescale" up

