
include config.mk

include frontend-config.mk
include backend-config.mk

build: backend frontend

backend: ${REPO}

javascript: ${FRONTEND_DIST_JS}
html: ${FRONTEND_DIST_HTML}
misc: ${FRONTEND_DIST_MISC_ARTIFACT}

frontend: \
	javascript \
	html \
	misc

docker: frontend-docker backend-docker

frontend-docker: ${FRONTEND_DIST_DOCKER}

.PHONY: \
	clean \
	docker \
	backend \
	javascript \
	html \
	misc \
	frontend \
	run-frontend-docker \
	run-backend-docker \
	run

${REPO}: ${BACKEND_SRC_FILES}
	@cd ${BACKEND_SRC_DIR} && ${GO_BUILD} -o ../${REPO}

${FRONTEND_DIST_JS}: ${FRONTEND_SRC_FILES} ${FRONTEND_PUBLIC_FILES}
	@${WEBPACK} --mode production

${FRONTEND_DIST_HTML}: ${FRONTEND_PUBLIC_HTML}
	@cp ${FRONTEND_PUBLIC_HTML} ${FRONTEND_DIST_HTML}

${FRONTEND_DIST_MISC_ARTIFACT}: ${FRONTEND_PUBLIC_MISC_FILES}
	@find ${FRONTEND_PUBLIC_DIR} \
		-maxdepth 1 \
		! -name index.html \
		! -path ${FRONTEND_PUBLIC_DIR} \
		-exec cp -r {} ${FRONTEND_DIST_DIR} \;

	@touch ${FRONTEND_DIST_MISC_ARTIFACT}

${FRONTEND_DIST_DOCKER}: Dockerfile.frontend ${FRONTEND_SRC_FILES}
	@${DOCKER_BUILD} \
		--build-arg \
			REACT_APP_FLU_API_URI=$${REACT_APP_FLU_API_URI:-http://localhost} \
		-f Dockerfile.frontend -t fluidity/${REPO}-frontend .
	@touch ${FRONTEND_DIST_DOCKER}

${BACKEND_DOCKER_ARTIFACT}: Dockerfile.backend ${BACKEND_SRC_FILES}
	@${DOCKER_BUILD} -f Dockerfile.backend -t fluidity/${REPO}-backend .
	@touch ${BACKEND_DOCKER_ARTIFACT}

run-frontend-docker: ${FRONTEND_DIST_DOCKER}
	@${DOCKER_RUN} -p 3000:80 fluidity/${REPO}-frontend

run-backend-docker: ${BACKEND_DOCKER_ARTIFACT}
	@${DOCKER_RUN} -p 8080:80 fluidity/${REPO}-backend

run: ${FRONTEND_DIST_DOCKER} ${BACKEND_DOCKER_ARTIFACT}
	@${DOCKER_COMPOSE} up

clean:
	@rm -rf \
		${FRONTEND_DIST_DIR}/* \
		${REPO} \
		${BACKEND_DOCKER_ARTIFACT}
