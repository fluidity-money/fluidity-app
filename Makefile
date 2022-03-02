
include build.mk

docker: $(shell find cmd common)
	@${DOCKER_BUILD} -t ${ORG_ROOT}/build-container .
	@touch docker
