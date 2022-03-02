
include build.mk

.PHONY: docker

ARTIFACT_DOCKER := artifacts/docker

docker: ${ARTIFACT_DOCKER}

${ARTIFACT_DOCKER}: $(shell find cmd common)
	@${DOCKER_BUILD} -t ${ORG_ROOT}/build-container .
	@touch ${ARTIFACT_DOCKER}
