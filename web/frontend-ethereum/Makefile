
include ./config.mk

TAG := fluidity/webwallet

.PHONY: \
	clean-build \
	clean-publish \
	clean \
	css \
	js \
	build \
	test \
	watch-css \
	watch-js \
	watch

all: build

build: ${BUILD_JS} ${BUILD_CSS}

${BUILD_JS}: ${TS_SRC} ${TSCONFIG_JSON}
	@echo >${SRC_DIR}/stub.css
	@${NPX_REACTSCRIPTS} build

js: ${BUILD_JS}

${BUILD_CSS}: ${SASS_SRC}
	${NPX_SASS} ${SASS_SRC} ${BUILD_CSS}

css: ${BUILD_CSS}

docker: ${FILES}
	@${DOCKER} build \
		--build-arg \
			REACT_APP_API_URL=$${REACT_APP_API_URL:-http://localhost:8080} \
		--build-arg \
			REACT_APP_WALLET_CONNECT_GETH_URI=$${REACT_APP_WALLET_CONNECT_GETH_URI:-ws://localhost:8545} \
		--build-arg \
			 REACT_APP_WEBSOCKET=$${REACT_APP_WEBSOCKET:-ws://localhost:8080/updates} \
		--build-arg \
			REACT_APP_CHAIN_ID=$${REACT_APP_CHAIN_ID:-31337} \
		--build-arg \
			REACT_APP_SENTRY_DSN=$${REACT_APP_SENTRY_DSN:-https://02225ae4a93c4b438998f8f56041566b@o1103433.ingest.sentry.io/6130103} \
		-t ${TAG} .

	@touch docker

run-docker: ${FILES} docker
	@${DOCKER} run -i -p 3000:80 ${TAG}

test: docker
	@docker-compose up -d hardhat
	@sleep 5 && npm test
	@docker-compose down

watch-css:
	@${NPX_SASS} --watch ${SASS_SRC} ${PUBLIC_DIR}/index.css

watch-js:
	echo "@import "$${FLU_PUBLIC_URL:-http://localhost:3000}/index.css";" \
		>${SRC_DIR}/stub.css

	@env REACT_APP_WEBSOCKET=$${REACT_APP_WEBSOCKET:-ws://localhost:8080/updates} \
		REACT_APP_WALLET_CONNECT_GETH_URI=$${REACT_APP_WALLET_CONNECT_GETH_URI:-ws://localhost:8545} \
		REACT_APP_API_URL=$${REACT_APP_API_URL:-http://localhost:8080} \
		REACT_APP_CHAIN_ID=31337 \
		REACT_APP_SENTRY_DSN=$${REACT_APP_SENTRY_DSN:-https://02225ae4a93c4b438998f8f56041566b@o1103433.ingest.sentry.io/6130103} \
			${NPX_REACTSCRIPTS} start

watch:
	@${MAKE} -j2 watch-css watch-js

clean-src:
	@rm -rf \
		${SRC_DIR}/${INDEX_CSS} \
		${SRC_DIR}/${INDEX_CSS}.map

clean-build:
	@rm -rf ${BUILD_DIR}/*

clean: clean-src clean-build clean-publish
	@rm -rf docker node_modules
