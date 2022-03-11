
REPO := ethereum.fluidity.money

include ../../web.mk

${FRONTEND_BUILD_JS}: ${FRONTEND_SRC_TS} ${FRONTEND_TSCONFIG_JSON}
	@echo >${FRONTEND_SRC_TS_DIR}/stub.css
	@${NPX_REACTSCRIPTS} build

run-docker: ${FILES} docker
	@${DOCKER} run -i -p 3000:80 ${REPO}

watch-js:
	echo "@import "$${FLU_PUBLIC_URL:-http://localhost:3000}/index.css";" \
		>${SRC_DIR}/stub.css

	@env REACT_APP_WEBSOCKET=$${REACT_APP_WEBSOCKET:-ws://localhost:8080/updates} \
		REACT_APP_WALLET_CONNECT_GETH_URI=$${REACT_APP_WALLET_CONNECT_GETH_URI:-ws://localhost:8545} \
		REACT_APP_API_URL=$${REACT_APP_API_URL:-http://localhost:8080} \
		REACT_APP_CHAIN_ID=3 \
		REACT_APP_TOKEN_CONFIG_FILE=testing-tokens.json \
			${NPX_REACTSCRIPTS} start

watch-css:
	@${NPX_SASS} --watch ${FRONTEND_SRC_SASS} ${FRONTEND_PUBLIC_CSS}
