
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
include config.mk

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

watch-js:
	echo '@import "http://localhost:3000/index.css";' \
		>${FRONTEND_SRC_DIR}/stub.css

	@env REACT_APP_WEBSOCKET=$${REACT_APP_WEBSOCKET:-ws://localhost:8081/updates} \
		REACT_APP_API_URL=$${REACT_APP_API_URL:-http://localhost:8081} \
		REACT_APP_FLUID_PROGRAM_ID=$${REACT_APP_FLUID_PROGRAM_ID:-HXCKzsLf5ohVEYo5shk7MjhbqeUemwikBj4667aPhmK9} \
		REACT_APP_FLU_DATA_ACCOUNT_USDC=$${REACT_APP_FLU_DATA_ACCOUNT_USDC:-7ZaehFMj49vvLQbRpWhfv1evF1c8jMcuLkXy4YFAfb52} \
		REACT_APP_FLU_OBLIGATION_USDC=$${REACT_APP_FLU_OBLIGATION_USDC:-HbmfhzwMF71jWxfKoD7sjCLrsVhvt2zEEux8t8oWqFAH} \
		REACT_APP_FLU_DATA_ACCOUNT_USDT=$${REACT_APP_FLU_DATA_ACCOUNT_USDT:-9hKfDTt2C7Q9NDHADQpaGTuQjmotCHfvkrmjmaYonEjy} \
		REACT_APP_FLU_OBLIGATION_USDT=$${REACT_APP_FLU_OBLIGATION_USDT:-2VmszETnb3HkvuMKYqTaPbr7zWh8jfhHut6bUQPwAdrR} \
		REACT_APP_SOL_NETWORK=$${REACT_APP_SOL_NETWORK:-devnet} \
		${NPX_REACTSCRIPTS} start

watch:
	@${MAKE} -j2 watch-css watch-js

clean:
	rm -f docker-backend docker-frontend

frontend-test:
	@${NPX_REACTSCRIPTS} test
	@touch frontend-test
