
REPO := solana.fluidity.money

FRONTEND_SRC_DIR := src
BACKEND_SRC_DIR := cmd

FRONTEND_SRC_TS_DIR := ${FRONTEND_SRC_DIR}
FRONTEND_SRC_SASS_DIR := ${FRONTEND_SRC_DIR}/scss

FRONTEND_SRC_TS := $(shell find ${FRONTEND_SRC_TS_DIR} -name '*ts*')
FRONTEND_SRC_SASS := ${FRONTEND_SRC_SASS_DIR}/style.scss

FRONTEND_SRC := ${FRONTEND_SRC_TS} ${FRONTEND_SRC_SASS}

FRONTEND_BUILD_ASSET_MANIFEST := \
	${FRONTEND_BUILD_DIR}/asset-manifest.json

FRONTEND_BUILD_DIR := build

include ../../web.mk

js: ${FRONTEND_BUILD_ASSET_MANIFEST}

css: ${FRONTEND_BUILD_CSS}

${FRONTEND_BUILD_CSS}: ${FRONTEND_SRC_SASS}
	${NPX_SASS} ${FRONTEND_SRC_SASS} ${FRONTEND_BUILD_CSS}

${FRONTEND_BUILD_ASSET_MANIFEST}: ${FRONTEND_SRC_TS} ${FRONTEND_TSCONFIG_JSON}
	@echo >${FRONTEND_SRC_TS_DIR}/stub.css
	@${NPX_REACTSCRIPTS} build

${FRONTEND_BUILD}: js css
	@touch ${FRONTEND_BUILD}

docker-frontend: ${FRONTEND_SRC}
	@${DOCKER_BUILD} \
		-t "${ORG_ROOT}/${REPO}-frontend" \
		-f Dockerfile.frontend \
		.

	@touch docker-frontend

run-docker: ${FILES} docker
	@${DOCKER} run -i -p 3000:80 ${REPO}

watch-css:
	@${NPX_SASS} --watch ${FRONTEND_SRC_SASS} ${FRONTEND_PUBLIC_CSS}
