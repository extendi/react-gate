#!/bin/sh
set -e
if [ $TRAVIS_TAG =~ ^pages-release-.*$ ]; then
    mkdir -p ~/.gitbook/versions/$GITBOOK_VERSION/node_modules
    cp -a node_modules/highlight.js/. ~/.gitbook/versions/$GITBOOK_VERSION/node_modules/highlight.js/
    yarn build:doc
    echo "Gitbook has built the doc site for github pages"
else
    echo "No need to build gitbook stuff."
fi