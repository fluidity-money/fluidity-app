#!/bin/sh

. ./tests-profile.sh

for i in `seq 5`; do
	psql "$FLU_TIMESCALE_URI" --quiet -c 'select 1;' 2>&1 >/dev/null
	if [ $? = 0 ]; then break; fi
	sleep 5
	>&2 echo 'retrying timescale'
done

for i in `seq 5`; do
	psql "$FLU_POSTGRES_URI" --quiet -c 'select 1;' 2>&1 >/dev/null
	if [ $? = 0 ]; then break; fi
	sleep 5
	>&2 echo 'retrying postgres'
done

go test ../...
