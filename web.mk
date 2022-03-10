
include ../../build.mk

NPX_REACTSCRIPTS := npx react-scripts
NPX_SASS := npx sass

FRONTEND_SRC_TS := $(shell find src-frontend -name '*ts*')
FRONTEND_SRC_CSS := $(shell find src-frontend -name '*.*ss')

BUILD_DIR := build
PUBLIC_DIR := public

