
# intended for node scripts inside cmd

include ../../build.mk

TS_FILES := $(shell ls -1 *.ts)

${REPO}: ${TS_FILES} package.json
	@npm install

docker: ${TS_FILES} Dockerfile Makefile
	@${DOCKER_BUILD} -t "${ORG_ROOT}/${REPO}" .
	@touch docker

build: ${REPO}

clean:
	@rm -rf \
		node_modules \
		docker
