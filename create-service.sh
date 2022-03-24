#!/bin/sh

if [ $# -eq 0 ]; then
  echo "Provide a name for the new service!"
  exit 1
fi

cd cmd

REPO=$1

if [ -d "$REPO" ]; then
  echo "Directory $REPO already exists - Not going to overwrite!"
  exit 1
fi

mkdir $REPO
cd $REPO

echo "
# $REPO

enter README description here!

## Environment variables

|             Name             |                                  Description
|------------------------------|------------------------------------------------------------------------------|
| \`ENV_1\`                      | Env 1 description                                                            |
| \`ENV_2\`                      | Env 2 description                                                            |

## Building

    make build

## Testing

    make test

## Docker

    make docker
" > README.md

echo "
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/$REPO

RUN make

ENTRYPOINT [ \\
    "wait-for-ws", \\
    "wait-for-amqp", \\
    "./$REPO.o" \\
]" > Dockerfile

echo "
REPO := $REPO

include ../../golang.mk" > Makefile

echo "package main

import (
    \"github.com/fluidity-money/fluidity-app/lib/log\"
)

func main() {
    log.App(func(k *log.Log) {
        k.Context = \"$REPO\"
        k.Message = \"Hello world!\"
    }) 
}" > main.go

echo "Done!"
