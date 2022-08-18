
REPO := fluidity.money

include config.mk

.PHONY: \
	html \
	css \
	js \
	watch-html \
	watch-css \
	watch-frontend \
	watch-backend \
	watch \
	clean \
	frontend \
	backend \
	docker \
	run-docker-frontend \
	run-docker-backend

all: frontend backend

frontend: html css

backend: ${REPO}.out

${REPO}.out: ${SRC_GO}
	@cd ${SRC_GO_DIR} && ${GO_BUILD} -o ../${REPO}.out

html: ${OUT_HTML}

${OUT_HTML}: ${SRC_SCRBL}
	@${RACKET} ${SRC_SCRBL_MAIN} >${OUT_HTML} || \
		sh -c 'rm ${OUT_HTML} && exit 1'

css: ${OUT_CSS}

${OUT_CSS}: ${SRC_SASS}
	@${SASS} ${SRC_SASS_INDEX} >${OUT_CSS} || \
		sh -c 'rm ${OUT_CSS} && exit 1'

watch-html:
	@ls -1 ${SRC_SCRBL} | entr -n ${MAKE} html

watch-css:
	@ls -1 ${SRC_SASS} | entr -n ${MAKE} css

watch-frontend:
	@${MAKE} -j2 watch-html watch-css

watch-backend:
	@ls -1 ${SRC_GO} | entr -n ${MAKE} backend

watch:
	@${MAKE} -j2 watch-frontend watch-backend

docker-frontend: ${SRC_SCRBL} ${SRC_SASS} ${SRC_JS} ${SRC_GO}
	@${DOCKER_BUILD} \
		--build-arg FLU_LANDING_API_URL=$${FLU_LANDING_API_URL-:http://localhost:8080} \
		-f Dockerfile.frontend \
		-t fluidity/${REPO}-frontend .

	@touch docker-frontend

docker-backend: ${SRC_GO}
	${DOCKER_BUILD} \
	${DOCKERFLAGS} \
	-f Dockerfile.backend -t fluidity/${REPO}-backend .
	@touch docker-backend

run-docker-frontend: docker-frontend
	@${DOCKER_RUN} -p 8080:80 fluidity/${REPO}-frontend

run-docker-backend: docker-backend
	@${DOCKER_RUN} fluidity/${REPO}-backend

docker: docker-frontend docker-backend

clean:
	@rm -f \
		${OUT_CSS} \
		${OUT_HTML} \
		docker-frontend \
		docker-backend \
		${REPO}
