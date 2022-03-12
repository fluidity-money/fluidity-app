
include build.mk

AUTOMATION_DIR := automation

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

docker-compose-up-testing:
	./docker-compose.sh \
		--env-file ${AUTOMATION_DIR}/testing/docker-compose-envs \
		up
