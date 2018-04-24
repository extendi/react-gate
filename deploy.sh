#!/bin/bash
set -e
SHA=`git rev-parse --verify HEAD`
# Adding deploy ssh key.
chmod 600 ./keys.pub
eval `ssh-agent -s`
ssh-add keys.pub
# Build with webpack and push the library to the repo
yarn build
git add .
git commit -m "Building release for commit ${CURRENT_SHA}"
git push

