
include ../../build.mk

NPX_REACTSCRIPTS := npx react-scripts
NPX_SASS := npx sass
NPX_WEBPACK := npx webpack

FRONTEND_PUBLIC_DIR := public

FRONTEND_PUBLIC_CSS := ${FRONTEND_PUBLIC_DIR}/index.css

FRONTEND_TSCONFIG_JSON := tsconfig.json

FRONTEND_BUILD_ASSET_MANIFEST := ${FRONTEND_BUILD_DIR}/asset-manifest.json
FRONTEND_BUILD_CSS := ${FRONTEND_BUILD_DIR}/index.css

FRONTEND_BUILD := build-frontend

BACKEND_SRC_GO := $(shell find ${BACKEND_SRC_DIR} -name '*.go')

BACKEND_BUILD := ${REPO}.out

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

all: frontend

${REPO}.out: ${BACKEND_SRC_GO}
	@cd ${BACKEND_SRC_DIR} && ${GO_BUILD} -o ../${REPO}.out

backend: ${BACKEND_BUILD}

frontend: ${FRONTEND_BUILD}

docker-backend: ${BACKEND_SRC}
	@${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		-t "${ORG_ROOT}/${REPO}-backend" \
		-f Dockerfile.backend \
		.

	@touch docker-backend


