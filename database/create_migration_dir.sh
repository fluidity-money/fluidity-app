#!/bin/sh -e

print_usage() {
    echo "Usage: sh join-sqls.sh -d (<SQL DIRECTORY>)* -o <OUT DIRECTORY>" >&2
}

find_sql_folders() {
    path="$1"

    find "$path" -type f -name "*.sql" -exec dirname {} \; \
        | uniq
        | sort -r
}

find_sqls() {
    path = "$1"

    find "$path" -type f -name "*.sql"
}

order_

    #local OPTIND migration_dirs out_file

    while getopts 'd:o:' flag; do
      case "${flag}" in
          d) migration_dirs="${migration_dirs} ${OPTARG}" ;;
          o) out_dir="${OPTARG}" ;;
          *) print_usage
             exit 1 ;;
      esac
    done

    [ -z "$migration_dirs" ] && return 1
    [ -z "$out_dir" ] && return 1

    # Get total number of all sql files across migration_dirs

    migration_dir_index=0
    for migration_dir in $migration_dirs; do
        sql_folders="$sql_folders $(find_sql_folders $migration_dir)"

        for sql_folder in $sql_folders; do
            hash=hash
        done
    done

    num_migration_dirs=$(echo $sql_files | wc -w)

    num_sql_folders=$()

    counter=0
    for sql_path in $sql_files; do
        file_name=$(basename $sql_path)
        echo $file_name
        prefix=$(printf "%0"$padding"d" $counter)
        echo $prefix
        cp $sql_path "$out_dir/$prefix-$file_name"

        counter=$((counter+1))
        echo $counter
    done

