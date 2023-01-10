
SRC_FRONTEND := src-frontend

SRC_BACKEND := src-backend

SRC_SASS_DIR := ${SRC_FRONTEND}/src-sass
SRC_SCRBL_DIR := ${SRC_FRONTEND}/src-scrbl

SRC_GO_DIR := ${SRC_BACKEND}

SRC_SCRBL := $(shell find ${SRC_SCRBL_DIR} -name '*.scrbl')
SRC_SCRBL_MAIN := ${SRC_SCRBL_DIR}/index.scrbl

SRC_SASS := $(shell find ${SRC_SASS_DIR} -name '*.s*ss')
SRC_SASS_INDEX := ${SRC_SASS_DIR}/_all.sass

SRC_GO := $(shell find ${SRC_GO_DIR} -name '*.go')

PUBLISH := publish

OUT_HTML := ${PUBLISH}/index.html
OUT_CSS := ${PUBLISH}/index.css

RACKET := racket
SASS := sass

DOCKER_BUILD := docker build

DOCKER_RUN := docker run

GO_BUILD := go build
