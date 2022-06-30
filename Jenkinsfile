#!/usr/bin/env groovy
pipeline {
    agent { node }

    environment {
        ECR_URI= '368772107083.dkr.ecr.us-east-2.amazonaws.com/kalibra'
        REPOSITORY_URI= 'https://github.com/Vardaan-16/Kalibra-admin'
        TAG_PREFIX= 'preprod'
        REGION= 'us-east-2'
        BACKEND_API_ENDPOINT= 'https://preprod.kalibra.app/api/'
        DEBUG_MODE= false
    }

    stages {
        stage("Prepare") {
            steps {
                 echo "Logging in to Docker Hub..."
                 sh "$DOCKERHUB_PASSWORD | docker login --username $DOCKERHUB_USERNAME --password-stdin"
                 echo "Logging in to Amazon ECR..."
                 sh "aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin $ECR_URI"
               
            }
        }

        stage("Build") {
            steps {
                sh "docker build -t $ECR_URI:latest"
                sh "docker tag $ECR_URI:${T
            }
        }

        stage("Post Build") {
            steps {
                sh "docker push $ECR_URI:latest"
               
            }
          }
       }           
}
