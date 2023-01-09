#!/bin/sh -e

error() {
	>&2 echo "$@"
	exit 1
}

print_usage() {
	error "Usage: create-migration.sh -d <DATABASE NAME > -c <CATEGORY> -n <MIGRATION NAME>"
}

resolve_database() {
	case "$1" in
		postgres) echo 101-up-postgres;;
		timescale) echo 102-up-timescale;;
		shared) echo 100-up-sql-shared;;
		*) error "for database, (postgres|timescale|shared) expected!";;
	esac
}

main() {
	local OPTIND migration_dir name

	while getopts 'd:c:n:' flag; do
		case "$flag" in
			d) database_name="$(resolve_database $OPTARG)";;
			c) category="$OPTARG";;
			n) name="$OPTARG" ;;
			*) print_usage;;
		esac
	done

	[ -z "$database_name" ] && print_usage
	[ -z "$category" ] && print_usage
	[ -z "$name" ] && print_usage

	timestamp="$(date +%Y%m%d%H%M%S)"

	file="$database_name/$timestamp-${category}_$name.sql"

	touch $file

	echo "$file"

	[ -z "$EDITOR" ] || $EDITOR $file &
}

main $@
