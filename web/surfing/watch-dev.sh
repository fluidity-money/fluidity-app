#!/bin/bash

# This script is used to watch for changes in the source files and
# automatically recompile the project. It is useful for development.

rm -rf ../surfing-prebuilt
mkdir ../surfing-prebuilt
cp package.json ../surfing-prebuilt
tsc -w --outDir ../surfing-prebuilt/dist/types & \
npx vite build --mode lib -w --outDir ../surfing-prebuilt/dist
