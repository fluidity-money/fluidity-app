
include build.mk

.PHONY: \
	docker \
	docker-web \
	docker-compose-up \
	docker-compose-ps \
	docker-compose-down

AUTOMATION_DIR := automation

DOCKER_COMPOSE := \
	@${DOCKER_COMPOSE} \
		-f "${AUTOMATION_DIR}/docker-compose.ethereum.yml" \
		-f "${AUTOMATION_DIR}/docker-compose.infrastructure.yml" \
		-f "${AUTOMATION_DIR}/docker-compose.ethereum.fluidity.money.yml"

docker:
	@${DOCKER_BUILD} -t ${ORG_ROOT}/build-container .

docker-web: docker
	@${DOCKER_BUILD} -t ${ORG_ROOT}/web-container -f Dockerfile.web .

docker-compose-up: docker
	${DOCKER_COMPOSE} up --build

docker-compose-ps:
	${DOCKER_COMPOSE} ps

docker-compose-down:
	${DOCKER_COMPOSE} down
