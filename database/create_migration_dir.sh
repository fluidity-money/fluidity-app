#!/bin/sh -e

print_usage() {
    echo "Usage: sh join-sqls.sh -d (<SQL DIRECTORY>)* -o <OUT DIRECTORY>" >&2
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


#local OPTIND migration_dirs out_file

while getopts 'd:o:' flag; do
    case "${flag}" in
        d) migration_dirs="${migration_dirs} ${OPTARG}" ;;
        o) out_dir="${OPTARG}" ;;
        *) print_usage
            return 1 ;;
    esac
done

[ -z "$migration_dirs" ] && print_usage && return 1
[ -z "$out_dir" ] && print_usage && return 1

# Get total number of all sql files across migration_dirs

for migration_dir in $migration_dirs; do
    sql_folders="$sql_folders $(find_sql_folders $migration_dir)"

    for sql_folder in $sql_folders; do

        # Split by '/' - Only works on Unix
        sub_dirs=$(echo $sql_folder | tr '/' ' ')

        padding=""

        for sub_dir in $sub_dirs; do
            padding="$padding$(echo $sub_dir | grep -o '^[0-9]*')"
        done

        sql_files=$(find_sqls $sql_folder)

        for sql_file in $sql_files; do
            file_name=$(basename $sql_file)

            cp "$sql_file" "$out_dir/$padding$file_name"
        done
    done
done

