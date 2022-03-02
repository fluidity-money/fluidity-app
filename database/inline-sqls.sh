#!/bin/sh -e

list_sections() {
	migration_dir="$1"

	find "$migration_dir" -type f -name '*.sql' -exec dirname {} \; \
		| sort -r \
		| uniq
}

print_sqls() {
	folder="$1"

	cat $(find $folder -maxdepth 1 -type f | sort)
}

print_sections() {
	migration_dir="$1"

	for section in $(list_sections $migration_dir); do
		print_sqls $section
	done
}

main() {
	migration_dirs="$@"

	[ -z "$migration_dirs" ] && return 1

	for migration_dir in $migration_dirs; do
		print_sections $migration_dir
	done
}

main $@
