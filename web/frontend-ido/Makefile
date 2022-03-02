
REPO := frontend-ido

include config.mk

build: javascript html css images fonts logos manifest stub

javascript: ${DIST_JS}
html: ${DIST_HTML}
css: ${DIST_CSS}
images: ${DIST_IMAGES_ARTIFACT}
fonts: ${DIST_FONTS_ARTIFACT}
logos: ${DIST_LOGOS_ARTIFACT}
manifest: ${DIST_MANIFEST}
docker: ${DIST_DOCKER}
stub: ${STUB}

.PHONY: \
	run-docker \
	clean \
	npm-install \
	run-docker \
	build-stub \
	watch-css \
	watch-js \
	watch

${DIST_JS}: ${SRC_FILES} ${PUBLIC_FILES} ${STUB}
	${WEBPACK} --mode production --env REACT_APP_FULLPAGE_JS_KEY=B0BAC741-E4674A33-BAB74B70-851654B5

${DIST_HTML}: ${PUBLIC_HTML}
	@cp ${PUBLIC_HTML} ${DIST_HTML}

${DIST_CSS}: ${PUBLIC_CSS} ${PUBLIC_CSS_MAP}
	@cp ${PUBLIC_CSS} ${DIST_CSS}
	@cp ${PUBLIC_CSS_MAP} ${DIST_CSS_MAP}

${DIST_IMAGES_ARTIFACT}: ${PUBLIC_IMAGES_FILES}
	@mkdir -p ${DIST_IMAGES}
	@cp -r ${PUBLIC_IMAGES_FILES} ${DIST_IMAGES}
	@touch dist/images-built

${DIST_FONTS_ARTIFACT}: ${PUBLIC_FONTS_FILES}
	@mkdir -p ${DIST_FONTS}
	@cp -r ${PUBLIC_FONTS_FILES} ${DIST_FONTS}
	@touch dist/fonts-built

${DIST_LOGOS_ARTIFACT}: ${PUBLIC_LOGOS_FILES}
	@cp -r ${PUBLIC_LOGOS_FILES} ${DIST_DIR}
	@touch ${DIST_LOGOS_ARTIFACT}

${DIST_MANIFEST}: ${PUBLIC_MANIFEST}
	@cp -r ${PUBLIC_MANIFEST} ${DIST_MANIFEST}

${DIST_DOCKER}: Dockerfile ${PUBLIC_HTML} ${PUBLIC_CSS} ${SRC_FILES} ${PUBLIC_IMAGES_FILES} ${PUBLIC_MANIFEST}
	@${DOCKER_BUILD} -t fluidity/${REPO} .
	@mkdir -p dist
	@touch ${DIST_DOCKER}

${STUB}:
	@env FLU_WEB_URL=localhost:3000 \
	${BUILD_STUB}

run-docker: docker
	@${DOCKER_RUN} -p 3000:80 fluidity/${REPO}

npm-install: package.json package-lock.json
	@npm i

build-css:
	@${NPX_SASS} ${SASS_SRC} ${PUBLIC_DIR}/index.css

${PUBLIC_CSS}: build-css

watch-css:
	@${NPX_SASS} --watch ${SASS_SRC} ${PUBLIC_DIR}/index.css

watch-js: npm-install ${STUB}
	@env REACT_APP_FULLPAGE_JS_KEY=B0BAC741-E4674A33-BAB74B70-851654B5 \
	${NPX_REACTSCRIPTS} start

watch:
	@${MAKE} -j2 watch-css watch-js

clean:
	@rm -rf \
		${DIST_DIR}/logo* \
		${DIST_JS} \
		${DIST_HTML} \
		${DIST_CSS} \
		${DIST_IMAGES} \
		${DIST_FONTS} \
		${DIST_FONTS_ARTIFACT} \
		${DIST_IMAGES_ARTIFACT} \
		${DIST_LOGOS_ARTIFACT} \
		${DIST_MANIFEST} \
		${DIST_DOCKER}
