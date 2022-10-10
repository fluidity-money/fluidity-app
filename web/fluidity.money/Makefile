
REPO := fluidity.money

FRONTEND_SRC_DIR := src
BACKEND_SRC_DIR := cmd

FRONTEND_SRC_TS_DIR := ${FRONTEND_SRC_DIR}
FRONTEND_SRC_SASS_DIR := ${FRONTEND_SRC_DIR}/styles

FRONTEND_SRC_TS := $(shell find ${FRONTEND_SRC_TS_DIR} -name '*ts*')
FRONTEND_SRC_SASS := ${FRONTEND_SRC_SASS_DIR}/config.scss

FRONTEND_SRC := ${FRONTEND_SRC_TS} ${FRONTEND_SRC_SASS}

include ../../web.mk

NEXTJS_BUILD := npm run build

nextjs:
	${NEXTJS_BUILD}

${FRONTEND_BUILD}: nextjs
	@touch ${FRONTEND_BUILD}

docker-frontend: ${FRONTEND_SRC}
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		${DOCKER_BUILD_ARGS} \
		-t "${ORG_ROOT}/${REPO}-frontend" \
		-f Dockerfile.frontend \
		.

	@touch docker-frontend

run-docker: ${FILES} docker
	@${DOCKER} run ${DOCKERFLAGS} -i -p 80:80 ${REPO}

clean:
	rm -f docker-backend docker-frontend
