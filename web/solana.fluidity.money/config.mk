
DOCKER := docker
NPX_REACTSCRIPTS := npx react-app-rewired
NPX_SASS := npx sass --no-color

TS_SRC := $(shell find src -name '*.ts*')
SASS_SRC := $(shell find src -name '*.*ss')

BUILD_DIR := build
PUBLIC_DIR := public

SRC_DIR := src
SASS_DIR := ${SRC_DIR}/scss

FILES := \
	Dockerfile \
	${TS_SRC} \
	${SASS_SRC}

TSCONFIG_JSON := tsconfig.json

SASS_SRC := ${SASS_DIR}/style.scss

INDEX_JS := asset-manifest.json

INDEX_JS_CHUNKS := $(shell \
	find ${BUILD_DIR} \
		-path '${BUILD_DIR}/static/*' \
		-type f)

INDEX_CSS := index.css

BUILD_CSS := ${BUILD_DIR}/${INDEX_CSS}
BUILD_JS := ${BUILD_DIR}/${INDEX_JS}
