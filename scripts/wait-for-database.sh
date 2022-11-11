#!/bin/sh -e

# loops until the database at environment variable FLU_TIMESCALE_URI and
# FLU_POSTGRES_URI connects or 50 attempts are made unsuccessfully

arguments="$@"

timescale="$(echo $FLU_TIMESCALE_URI | sed 's/[?&]\?binary_parameters=\(true\|false\)//g')"
postgres="$FLU_POSTGRES_URI"

err() {
	>&1 echo $@
	exit 1
}

test_database() {
	database="$1"
	counter=0

	while ! psql $database --quiet -c 'select 1;' 2>&1 >/dev/null; do
		if [ "$counter" -gt 50 ]; then
			err "50 connection attempts exceeded!"
		fi

		sleep 1
		counter=$((counter+1))
	done
}

if [ -z "$timescale" ] && [ -z "$postgres" ]; then
	err "(FLU_TIMESCALE_URI|FLU_POSTGRES_URI) not set!"
fi

[ -z "$timescale" ] || test_database "$timescale"
[ -z "$postgres" ] || test_database "$postgres"

exec $arguments
