
include ../../build.mk

NPX_REACTSCRIPTS := npx react-scripts
NPX_SASS := npx sass

FRONTEND_SRC_DIR := src
BACKEND_SRC_DIR := cmd

FRONTEND_SRC_TS_DIR := ${FRONTEND_SRC_DIR}
FRONTEND_SRC_SASS_DIR := ${FRONTEND_SRC_DIR}/scss

FRONTEND_SRC_TS := $(shell find ${FRONTEND_SRC_TS_DIR} -name '*ts*')
FRONTEND_SRC_SASS := ${FRONTEND_SRC_SASS_DIR}/style.scss

FRONTEND_SRC := ${FRONTEND_SRC_TS} ${FRONTEND_SRC_SASS}

FRONTEND_BUILD_DIR := build
FRONTEND_PUBLIC_DIR := public

FRONTEND_PUBLIC_CSS := ${FRONTEND_PUBLIC_DIR}/index.css

FRONTEND_TSCONFIG_JSON := tsconfig.json

FRONTEND_ASSET_MANIFEST_JSON := asset-manifest.json

FRONTEND_BUILD_ASSET_MANIFEST := ${FRONTEND_BUILD_DIR}/asset-manifest.json
FRONTEND_BUILD_CSS := ${FRONTEND_BUILD_DIR}/index.css

FRONTEND_BUILD := build-frontend

BACKEND_SRC_GO := $(shell find ${BACKEND_SRC_DIR} -name '*.go')

BACKEND_BUILD := ${REPO}.o

.PHONY: \
	clean-build \
	clean-publish \
	clean \
	css \
	js \
	build \
	frontend \
	backend \
	test \
	watch-css \
	watch-js \
	watch

js: ${FRONTEND_BUILD_ASSET_MANIFEST}

css: ${FRONTEND_BUILD_CSS}

${FRONTEND_BUILD}: js css
	@touch ${FRONTEND_BUILD}

${REPO}.o: ${BACKEND_SRC_GO}
	@cd ${BACKEND_SRC_DIR} && ${GO_BUILD} -o ../${REPO}.o

backend: ${BACKEND_BUILD}

frontend: ${FRONTEND_BUILD}

docker-frontend: ${FRONTEND_SRC}
	@${DOCKER_BUILD} \
		-t "${ORG_ROOT}/${REPO}-frontend" \
		-f Dockerfile.frontend \
		.

	@touch docker-frontend

docker-backend: ${BACKEND_SRC}
	@${DOCKER_BUILD} \
		-t "${ORG_ROOT}/${REPO}-backend" \
		-f Dockerfile.backend \
		.

	@touch docker-backend

watch:
	@${MAKE} -j2 watch-css watch-js
