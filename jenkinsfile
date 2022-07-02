#!/usr/bin/env groovy
pipeline {
    agent { node { label 'swarm-ci' } }

    environment {
        ECR_URI: "368772107083.dkr.ecr.us-east-2.amazonaws.com/kalibra"
        REPOSITORY_URI: "https://github.com/Vardaan-16/Kalibra-admin"
        TAG_PREFIX: "preprod"
        REGION: "us-east-2"
        BACKEND_API_ENDPOINT: "https://preprod.kalibra.app/api/"
        DEBUG_MODE: false
        AWS_ECS_SERVICE = 'test'
        AWS_ECS_TASK_DEFINITION = 'office-test'
        AWS_ECS_COMPATIBILITY = 'FARGATE'
        AWS_ECS_NETWORK_MODE = 'awsvpc'
        AWS_ECS_CPU = '256'
        AWS_ECS_MEMORY = '512'
        AWS_ECS_CLUSTER = 'office-test'
        AWS_ECS_TASK_DEFINITION_PATH = './ecs/container-definition-update-image.json'
    }

    stages {
        stage("Prepare") {
            steps {
                 echo "Logging in to Docker Hub..."
                 sh "$DOCKERHUB_PASSWORD | docker login --username $DOCKERHUB_USERNAME --password-stdin"
                 echo "Logging in to Amazon ECR..."
                 sh "aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin $ECR_URI"
                 sh "COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)"
                 sh "IMAGE_TAG=${COMMIT_HASH:=latest}"
            }
        }

        stage("Build") {
            steps {
                sh "docker build --build-arg REGION --build-arg BACKEND_API_ENDPOINT --build-arg DEBUG_MODE -t $ECR_URI:${TAG_PREFIX}-latest ."
                sh "docker tag $ECR_URI:${TAG_PREFIX}-latest $ECR_URI:${TAG_PREFIX}-${IMAGE_TAG}"
                waitUntilServicesReady
            }
        }

        stage("Post Build") {
            steps {
                sh "docker push $ECR_URI:${TAG_PREFIX}-latest"
               
            }
          }
       }           
}
