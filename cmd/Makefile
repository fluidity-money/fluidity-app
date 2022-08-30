
.PHONY: install clean

install:
	@find . -mindepth 1 -maxdepth 1 -type d \
		-exec sh -c 'cd {} && ${MAKE} install' \;

clean:
	@find . -mindepth 1 -maxdepth 1 -type d \
		-exec sh -c 'cd {} && ${MAKE} clean' \;
