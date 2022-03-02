
SRC_DIR := src

SRC_FILES := $(find ${SRC_DIR})

PUBLIC_DIR := public

PUBLIC_HTML := ${PUBLIC_DIR}/index.html

PUBLIC_CSS  := ${PUBLIC_DIR}/index.css
PUBLIC_CSS_MAP  := ${PUBLIC_DIR}/index.css.map

PUBLIC_IMAGES_FILES := $(shell find ${PUBLIC_DIR}/images)

PUBLIC_FONTS_FILES  := $(shell find ${PUBLIC_DIR}/fonts)

PUBLIC_LOGOS_FILES  := $(shell ls -1 ${PUBLIC_DIR}/logo*)

PUBLIC_MANIFEST := ${PUBLIC_DIR}/manifest.json

DIST_DIR := dist

DIST_JS := ${DIST_DIR}/index.js
DIST_HTML := ${DIST_DIR}/index.html
DIST_CSS := ${DIST_DIR}/index.css
DIST_CSS_MAP := ${DIST_DIR}/index.css.map

DIST_FONTS := ${DIST_DIR}/fonts

DIST_IMAGES := ${DIST_DIR}/images

DIST_IMAGES_ARTIFACT := ${DIST_DIR}/images-built

DIST_FONTS_ARTIFACT := ${DIST_DIR}/fonts-build

DIST_LOGOS_ARTIFACT := ${DIST_DIR}/logos-built

DIST_MANIFEST := ${DIST_DIR}/manifest.json

DIST_DOCKER := ${DIST_DIR}/docker

NPX := npx

WEBPACK := ${NPX} webpack

DOCKER := docker

DOCKER_BUILD := ${DOCKER} build
DOCKER_RUN := ${DOCKER} run

NPX_REACTSCRIPTS := npx react-scripts
NPX_SASS := npx sass --no-color

SASS_DIR := ${SRC_DIR}/scss
SASS_SRC := ${SASS_DIR}/style.scss

BUILD_STUB := ./build-stub.sh
STUB := src/stub.css
