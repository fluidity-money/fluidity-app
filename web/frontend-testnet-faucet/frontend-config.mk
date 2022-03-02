
FRONTEND_SRC_DIR := src-frontend

FRONTEND_SRC_FILES := $(shell find ${FRONTEND_SRC_DIR})

FRONTEND_PUBLIC_DIR := public

FRONTEND_PUBLIC_HTML := ${FRONTEND_PUBLIC_DIR}/index.html

FRONTEND_PUBLIC_MISC_FILES := \
	$(shell find ${FRONTEND_PUBLIC_DIR} \
		! -name index.html \
		! -name .)

FRONTEND_DIST_DIR := dist

FRONTEND_DIST_JS := ${FRONTEND_DIST_DIR}/index.js
FRONTEND_DIST_HTML := ${FRONTEND_DIST_DIR}/index.html

FRONTEND_DIST_MISC_ARTIFACT := ${FRONTEND_DIST_DIR}/artifact-misc

FRONTEND_DIST_DOCKER := frontend-docker
