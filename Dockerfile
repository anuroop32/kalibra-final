# pull base image
FROM node:16.13.1

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Declare all process.env variables so they can be passed in during the build
ARG AWS_REGION
ENV AWS_REGION $AWS_REGION
ARG COGNITO_USER_POOL_ID
ENV COGNITO_USER_POOL_ID $COGNITO_USER_POOL_ID
ARG COGNITO_IDENTITY_POOL_ID
ENV COGNITO_IDENTITY_POOL_ID $COGNITO_IDENTITY_POOL_ID
ARG COGNITO_USER_POOL_WEB_CLIENT_ID
ENV COGNITO_USER_POOL_WEB_CLIENT_ID $COGNITO_USER_POOL_WEB_CLIENT_ID
ARG USER_FILES_S3_BUCKET
ENV USER_FILES_S3_BUCKET $USER_FILES_S3_BUCKET
ARG BACKEND_API_ENDPOINT
ENV BACKEND_API_ENDPOINT $BACKEND_API_ENDPOINT
ARG ONESIGNAL_APP_ID
ENV ONESIGNAL_APP_ID $ONESIGNAL_APP_ID
ARG SLACK_WEB_HOOK_URL
ENV SLACK_WEB_HOOK_URL $SLACK_WEB_HOOK_URL
ARG AMPLITUDE_API_KEY
ENV AMPLITUDE_API_KEY $AMPLITUDE_API_KEY
ARG DEBUG_MODE
ENV DEBUG_MODE $DEBUG_MODE
ARG TERRA_DEV_ID
ENV TERRA_DEV_ID $TERRA_DEV_ID
ARG TERRA_API_KEY
ENV TERRA_API_KEY $TERRA_API_KEY

# default to port 5000 for serve
ARG PORT=5000
ENV PORT $PORT
EXPOSE $PORT

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm install --global expo-cli@4.13.0
RUN npm install --global serve@13.0.2

WORKDIR /usr/kalibra3mobilefe/app
ENV PATH /usr/kalibra3mobilefe/app/.bin:$PATH
COPY ./package.json ./package-lock.json ./
# Ignore prepare script (husky install: git hooks)
RUN npm ci --ignore-scripts
COPY . .
RUN expo build:web

CMD serve web-build -p ${PORT}
