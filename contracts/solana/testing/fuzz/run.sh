#!/bin/bash
set -o errexit

if [ $# -eq 0 ]
then
    echo "Running all fuzzers:"
    cargo fuzz list --fuzz-dir testing/fuzz
    fuzz_targets=$(cargo fuzz list --fuzz-dir testing/fuzz)
else
    echo "Running fuzzers: $@"
    fuzz_targets=$@
fi 

fuzz_targets=$(echo $fuzz_targets | tr '\n' ' ' | tr ',' ' ')

cargo +nightly fuzz run $fuzz_targets --fuzz-dir testing/fuzz -- -max_total_time=10

echo "All done - All fuzz targets exited normally"
