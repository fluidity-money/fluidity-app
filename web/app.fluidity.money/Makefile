REPO := fluidity.money

include ../../web.mk

REMIX_BUILD := npm run prod

GRAPHQL_BUILD := npm run graphql

.PHONY: remix graphql

remix:
	${REMIX_BUILD}

graphql:
	${GRAPHQL_BUILD}

${FRONTEND_BUILD}: graphql remix
	@touch ${FRONTEND_BUILD}

docker-frontend:
	${DOCKER_BUILD} \
		${DOCKERFLAGS} \
		${DOCKER_BUILD_ARGS} \
		-t "${ORG_ROOT}/app.${REPO}-frontend" \
		-f Dockerfile.frontend \
		.

	@touch docker-frontend

run-docker: ${FILES} docker
	@${DOCKER} run ${DOCKERFLAGS} -i -p 80:80 ${REPO}

clean:
	rm -f docker-backend docker-frontend