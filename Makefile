
include build.mk

.PHONY: \
	docker \
	docker-web \
	docker-compose-up \
	docker-compose-ps \
	docker-compose-down

docker:
	@${DOCKER_BUILD} -t ${ORG_ROOT}/build-container .

docker-web: docker
	@${DOCKER_BUILD} \
		-t ${ORG_ROOT}/web-container \
		-f Dockerfile.web \
		.
