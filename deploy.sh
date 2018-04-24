#!/bin/bash
set -e
SHA=`git rev-parse --verify HEAD`
REPO="git@github.com:extendi/react-gate.git"
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}

# Adding deploy ssh key.
openssl aes-256-cbc -K $encrypted_9b89288d412e_key -iv $encrypted_9b89288d412e_iv -in keys.enc -out keys -d
chmod 600 ./keys
eval `ssh-agent -s`
ssh-add keys
# Build with webpack and push the library to the repo
yarn build
git add ./lib
git commit -m "Building release for commit ${SHA}"
git push $SSH_REPO travis-integration

