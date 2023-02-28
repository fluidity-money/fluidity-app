TESTS := spooler utility-mining
TARGETS := $(addprefix test-, $(TESTS))

DOCKER_COMPOSE := docker compose

AWS_ACCOUNT_ID := $(shell aws ssm get-parameter --name '/fluidity/aws/accountId' --with-decryption --query 'Parameter.Value' --output text)
ECR_LOGIN := aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.ap-southeast-2.amazonaws.com

.PHONY: \
	tests-all \
	docker-pull \
	$(TARGETS)

tests-all: $(TARGETS)

docker-pull:
	@${ECR_LOGIN}
	docker pull $(AWS_ACCOUNT_ID).dkr.ecr.ap-southeast-2.amazonaws.com/build-container
	docker tag $(AWS_ACCOUNT_ID).dkr.ecr.ap-southeast-2.amazonaws.com/build-container fluidity/build-container
	docker pull $(AWS_ACCOUNT_ID).dkr.ecr.ap-southeast-2.amazonaws.com/runtime-container
	docker tag $(AWS_ACCOUNT_ID).dkr.ecr.ap-southeast-2.amazonaws.com/runtime-container fluidity/runtime-container

$(TARGETS): docker-pull
	${DOCKER_COMPOSE} up --build $@
	${DOCKER_COMPOSE} down --volumes --timeout 1
