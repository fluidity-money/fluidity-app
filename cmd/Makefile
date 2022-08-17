
.PHONY: install

install: $(shell find . -name '*.go')
	@find . -mindepth 1 -maxdepth 1 -type d \
		-exec sh -c 'cd {} && ${MAKE} install' \;
