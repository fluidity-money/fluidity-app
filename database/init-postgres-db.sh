#!/bin/sh

set -e

repo="/usr/src/fluidity-migrations-postgres"

$repo/dbmate -u "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@:5432/${POSTGRES_DB}?sslmode=disable" -d "$repo/build/postgres" up

