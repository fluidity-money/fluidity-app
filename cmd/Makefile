
.PHONY: build docker install clean

all: build

build:
	@find . -mindepth 1 -maxdepth 1 -type d \
		-exec sh -c 'cd {} && ${MAKE} build' \;

docker:
	@find . -mindepth 1 -maxdepth 1 -type d \
		-exec sh -c 'cd {} && ${MAKE} docker' \;

install:
	@find . -mindepth 1 -maxdepth 1 -type d \
		-exec sh -c 'cd {} && ${MAKE} install' \;

clean:
	@find . -mindepth 1 -maxdepth 1 -type d \
		-exec sh -c 'cd {} && ${MAKE} clean' \;
