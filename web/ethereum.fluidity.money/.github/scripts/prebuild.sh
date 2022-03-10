#!/bin/bash
# Sanity check
function sanitize() {
  if [ -z "${1}" ]; then
    >&2 echo "Unable to find the ${2}. Did you set with.${2}?"
    exit 1
  fi
}

sanitize "${1}" "account_id"
sanitize "${2}" "access_key_id"
sanitize "${3}" "secret_access_key"
sanitize "${4}" "region"
sanitize "${5}" "ecr_image" 

# Parameters
ACCOUNT_ID=$1
ACCESS_KEY_ID=$2
SECRET_ACCESS_KEY=$3
REGION=$4
ECR_IMAGE=$5

# Configure AWS
ACCOUNT_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
ECR_REPO_URL="${ACCOUNT_URL}/$ECR_IMAGE"

export AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=$REGION

# ECR Login
aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ACCOUNT_URL
docker pull $ECR_REPO_URL
# Pull out the image ID 
LOCAL_IMAGE_ID=$(docker images -f=reference="${ECR_REPO_URL}" | tail -n 1 | awk '{print $3}')
# Tag the image it's just called $ECR_IMAGE allowing containers to build atop this without requiring a huge ecr url 
docker image tag $LOCAL_IMAGE_ID $ECR_IMAGE