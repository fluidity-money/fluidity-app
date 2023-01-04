#!/bin/sh -e

print_usage() {
	>&2 echo "Usage: build.sh -d (<SQL DIRECTORY>)* -o <OUT DIRECTORY>"
	exit 1
}

find_sql_folders() {
	path="$1"

	find "$path" -type f -name "*.sql" -exec dirname {} \; \
		| uniq
}

find_sqls() {
	path="$1"

	find "$path" -maxdepth 1 -type f -name "*.sql"
}

main() {
	local OPTIND migration_dirs out_dir

	while getopts 'd:o:' flag; do
		case "${flag}" in
			d) migration_dirs="${migration_dirs} ${OPTARG}" ;;
			o) out_dir="${OPTARG}" ;;
			*) print_usage;;
		esac
	done

	[ -z "$migration_dirs" ] && print_usage && return 1
	[ -z "$out_dir" ] && print_usage && return 1

	# move all SQL files from the directory given to the build directory given

	for migration_dir in $migration_dirs; do
		sql_folders="$sql_folders $(find_sql_folders $migration_dir)"
		for sql_folder in $sql_folders; do
			sql_files=$(find_sqls $sql_folder)
			for sql_file in $sql_files; do
				name="$(basename "$sql_file")"
				cp "$sql_file" "$out_dir/$name"
			done
		done
	done
}

main $@
