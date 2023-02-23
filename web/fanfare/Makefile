REPO := fanfare

include ../../web.mk

FANFARE_BUILD := yarn build --filter fanfare

.PHONY: build docker

build:
	${FANFARE_BUILD}

docker:
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		${DOCKER_BUILD_ARGS} \
		-t "${ORG_ROOT}/${REPO}" \
		.

	@touch docker

