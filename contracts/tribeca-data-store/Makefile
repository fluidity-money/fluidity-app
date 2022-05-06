
REPO := fluidity-tribeca-data-store

ANCHOR_BUILD := anchor build

ANCHOR_TEST := anchor test

OUT_BPF := target/deploy/tribeca_data_store.so

.PHONY: build clean test

all: build

build: ${OUT_BPF}

${OUT_BPF}: ${SRC_FILES}
	@${ANCHOR_BUILD}

docker: ${SRC_FILES} Dockerfile
	@${DOCKER_BUILD} --target base -t fluidity/${REPO} .
	@touch docker

test-anchor: ${SRC_FILES}
	@${ANCHOR_TEST}

test: test-anchor

clean:
	@rm -rf \
		target \
		docker \

