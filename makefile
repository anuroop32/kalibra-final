
run:
	php artisanserve

schedule: 
	php artisan schedule:work

horizon:
	php artisan horizon

test:
	XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-html reports/

AWS_CLI ?= aws
IMAGE ?= digiret-api
CONFIG_BUCKET ?= ti-apps-env
CONFIG_PROFILE ?= tol-arch
ENV ?= stage
BUILD_NUMBER ?= 0

ifeq ($(ENV), stage)
AWS_PROFILE ?= toldev
AWS_REGION ?= us-east-1
REGISTRY_PROFILE ?= tol
REGISTRY_REGION ?= us-east-1
REGISTRY ?= 958516987696.dkr.ecr.$(REGISTRY_REGION).amazonaws.com
CLUSTER=digiret-api-fargate-cluster-stage
SERVICE=digiret-api-fargate-service-stage
QUEUE_SERVICE=digiret-api-queue-ecs-service-stage
SCHEDULER_SERVICE=digiret-api-scheduler-ecs-service-stage
TAG ?= stage
endif

ifeq ($(ENV), prod)
AWS_PROFILE ?= tol
AWS_REGION ?= us-east-1
REGISTRY_PROFILE ?= tol
REGISTRY_REGION ?= us-east-1
REGISTRY ?= 958516987696.dkr.ecr.$(REGISTRY_REGION).amazonaws.com
TAG ?= prod
CLUSTER=digiret-api-fargate-cluster-prod
SERVICE=digiret-api-fargate-service-prod
QUEUE_SERVICE=digiret-api-queue-ecs-service-prod
SCHEDULER_SERVICE=digiret-api-scheduler-ecs-service-prod
endif

build:
    @echo "Building image..."
    docker build . -t "$(IMAGE)_$(BUILD_NUMBER):$(TAG)" --ssh default

deploy: download-env build tag docker_login push update-services

docker_login: 
    @echo "Logging into AWS ECR registry..."
    @if [ "$(shell $(AWS_CLI) --version \
        aws --version \
        | awk -F'/' '{print $$2}' \
        | awk -F'.' '{print $$1}')" = "2" ]; then \
        $(aws_cli) ecr get-login-password \
            --profile $(REGISTRY_PROFILE) \
            --region $(REGISTRY_REGION) \
            | docker login \
            --username AWS \
            --password-stdin $(REGISTRY); \
    else \
        $(AWS_CLI) ecr get-login \
            --no-include-email \
            --profile $(REGISTRY_PROFILE) \
            --region $(AWS_REGION) \
            | sh - ; \
    fi

tag:
    @echo "Tagging..."
    docker tag "$(IMAGE)_$(BUILD_NUMBER):$(TAG)" "$(REGISTRY)/$(IMAGE):$(TAG)"

push:
    @echo "Pushing..."
    docker push "$(REGISTRY)/$(IMAGE):$(TAG)"

download-env:
    aws s3 --profile $(CONFIG_PROFILE) cp s3://$(CONFIG_BUCKET)/$(IMAGE)/.env.$(ENV) .env


upload-env:
    aws s3 --profile $(CONFIG_PROFILE) cp .env s3://$(CONFIG_BUCKET)/$(IMAGE)/.env.$(ENV)

ci:
    docker build -t $(IMAGE)_$(BUILD_NUMBER) .
    docker run --env APP_ENV="$(BUILD_NUMBER)" --rm $(IMAGE)_$(BUILD_NUMBER) sh -c "echo TEST TO RUN"
    docker image rm $(IMAGE)_$(BUILD_NUMBER)


update-services: update-service update-queue-service update-scheduler-service

update-service:
    @echo "Updating service for $(CLUSTER) -- $(SERVICE)"
    aws ecs update-service --profile $(AWS_PROFILE) --region $(AWS_REGION) --cluster $(CLUSTER) --service $(SERVICE) --force-new-deployment

update-queue-service:
    @echo "Updating service for $(CLUSTER) -- $(QUEUE_SERVICE)"
    aws ecs update-service --profile $(AWS_PROFILE) --region $(AWS_REGION) --cluster $(CLUSTER) --service $(QUEUE_SERVICE) --force-new-deployment

update-scheduler-service:
    @echo "Updating service for $(CLUSTER) -- $(SCHEDULER_SERVICE)"
    aws ecs update-service --profile $(AWS_PROFILE) --region $(AWS_REGION) --cluster $(CLUSTER) --service $(SCHEDULER_SERVICE) --force-new-deployment
