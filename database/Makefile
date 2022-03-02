
REPO := fluidity/database

REPO_TIMESCALE := ${REPO}-timescale
REPO_POSTGRES := ${REPO}-postgres

.PHONY: clean docker build timescale postgres test-data

BUILD_DIR := build

TIMESCALE_DIR := up-timescale
TIMESCALE_SRC := $(shell find ${TIMESCALE_DIR} -type f)
TIMESCALE_BUILD_DIR := ${BUILD_DIR}/timescale
TIMESCALE_BUILD_OUT := ${TIMESCALE_BUILD_DIR}/init.sql

POSTGRES_DIR := up-postgres
POSTGRES_SRC := $(shell find ${POSTGRES_DIR} -type f)
POSTGRES_BUILD_DIR := ${BUILD_DIR}/postgres
POSTGRES_BUILD_OUT := ${POSTGRES_BUILD_DIR}/init.sql

SHARED_SQL_DIR := up-sql-shared
SHARED_SQL_SRC := $(shell find ${SHARED_SQL_DIR} -type f)

TEST_DATA_DIR := test-data

DOCKER := docker
DOCKER_BUILD := ${DOCKER} build
DOCKER_RUN := ${DOCKER} run

PSQL := psql

build: timescale postgres

timescale: ${TIMESCALE_BUILD_OUT}

${TIMESCALE_BUILD_OUT}: ${TIMESCALE_SRC}
	@mkdir -p "${TIMESCALE_BUILD_DIR}"

	@sh inline-sqls.sh \
		"${SHARED_SQL_DIR}" \
		"${TIMESCALE_DIR}" \
		>"${TIMESCALE_BUILD_OUT}"

postgres: ${POSTGRES_BUILD_OUT}

${POSTGRES_BUILD_OUT}: ${POSTGRES_SRC}
	@mkdir -p "${POSTGRES_BUILD_DIR}"

	@sh inline-sqls.sh \
		"${SHARED_SQL_DIR}" \
		"${POSTGRES_DIR}" \
		>"${POSTGRES_BUILD_OUT}"

docker: docker-timescale docker-postgres

docker-timescale: Dockerfile.timescale ${TIMESCALE_SRC}
	@${DOCKER_BUILD} -t ${REPO_TIMESCALE}:latest -f Dockerfile.timescale .
	@touch docker-timescale

docker-postgres: Dockerfile.postgres ${POSTGRES_SRC}
	@${DOCKER_BUILD} -t ${REPO_POSTGRES}:latest -f Dockerfile.postgres .
	@touch docker-postgres

run-docker-timescale: docker-timescale
	@${DOCKER_RUN} \
		-e POSTGRES_USER=$${POSTGRES_USER:-fluidity} \
		-e POSTGRES_PASSWORD=$${POSTGRES_PASSWORD:-fluidity} \
		-p 5433:5432 \
		${REPO_TIMESCALE}:latest \
		-c log_statement=all

run-docker-postgres: docker-postgres
	@${DOCKER_RUN} \
		-e POSTGRES_USER=$${POSTGRES_USER:-fluidity} \
		-e POSTGRES_PASSWORD=$${POSTGRES_PASSWORD:-fluidity} \
		-p 5432:5432 \
		${REPO_POSTGRES}:latest \
		-c log_statement=all

test-data: docker-timescale docker-postgres
	@${PSQL} postgres://fluidity:fluidity@localhost:5433 \
		<${TEST_DATA_DIR}/current-timescale.sql

	@${PSQL} postgres://fluidity:fluidity@localhost \
		<${TEST_DATA_DIR}/current-postgres.sql

clean:
	@rm -rf \
		"${TIMESCALE_BUILD_OUT}" \
		"${POSTGRES_BUILD_OUT}" \
		docker-timescale \
		docker-postgres
