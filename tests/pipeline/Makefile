TESTS := spooler utility-mining
TARGETS := $(addprefix test-, $(TESTS))

DOCKER_COMPOSE := docker compose

.PHONY: \
	tests-all \
	$(TARGETS)

tests-all: $(TARGETS)

$(TARGETS):
	${DOCKER_COMPOSE} up --build $@
	${DOCKER_COMPOSE} down --volumes --timeout 1

