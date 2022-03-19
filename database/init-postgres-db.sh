#!/bin/sh

set -e

REPO="/usr/src/fluidity-migrations-postgres"

$REPO/dbmate -u "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@:5432/${POSTGRES_DB}?sslmode=disable" -d "$REPO/build/postgres" up

