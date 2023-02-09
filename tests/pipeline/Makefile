
REPO := tests-pipeline

include ../../golang.mk

build-tests: ${GO_FILES}
	${GO_TEST} -c -o ${REPO}.tests
