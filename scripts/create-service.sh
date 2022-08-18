#!/bin/sh

write_err(){ echo $@ >&2; }

if [ $# -eq 0 ]; then
  write_err "Provide a name for the new service!"
  exit 1
fi

cd cmd

REPO=$1

if [ -d "$REPO" ]; then
  write_err "Directory $REPO already exists - Not going to overwrite!"
  exit 1
fi

mkdir $REPO
cd $REPO

cat > README.md << EOF

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
EOF

cat > Dockerfile << EOF
FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/$REPO

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/$REPO/$REPO.out .

ENTRYPOINT [ \\
	"wait-for-amqp", \\
	"./$REPO.o" \\
]
EOF

cat > Makefile << EOF

REPO := $REPO

include ../../golang.mk
EOF

cat > main.go << EOF
package main

import (
    "github.com/fluidity-money/fluidity-app/lib/log"
)

func main() {
    log.App(func(k *log.Log) {
        k.Context = "$REPO"
        k.Message = "Hello world!"
    })
}
EOF

write_err "Done!"
