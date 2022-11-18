#!/bin/sh -e

error() {
	>&2 echo "$@"
	exit 1
}

print_usage() {
	error "Usage: create-migration.sh -d (<SQL DIRECTORY>) -s <MIGRATION NAME>"
}

main() {
	local OPTIND migration_dir name

	while getopts 'd:s:' flag; do
		case "${flag}" in
			d) migration_dir="${migration_dir} ${OPTARG}" ;;
			s) name="${OPTARG}" ;;
			*) print_usage;;
		esac
	done

	[ -z "$migration_dir" ] && print_usage
	[ -z "$name" ] && print_usage

	[ -z "$EDITOR" ] && error "EDITOR not set!"

	timestamp="$(date +%s)"

	file="$migration_dir/$timestamp-$name.sql"

	touch $file

	echo "$file"

	$EDITOR $file
}

main $@
