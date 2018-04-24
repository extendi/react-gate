#!/bin/bash
set -e
SHA=`git rev-parse --verify HEAD`
# Adding deploy ssh key.
openssl aes-256-cbc -K $encrypted_4b8c039429e2_key -iv $encrypted_4b8c039429e2_iv -in keys.pub.enc -out keys.pub -d
chmod 600 ./keys.pub
eval `ssh-agent -s`
ssh-add keys.pub
# Build with webpack and push the library to the repo
yarn build
git add ./lib
git commit -m "Building release for commit ${SHA}"
git push

