#!/bin/sh
set -e
mkdir -p ~/.gitbook/versions/$GITBOOK_VERSION/node_modules
cp -a node_modules/highlight.js/. ~/.gitbook/versions/$GITBOOK_VERSION/node_modules/highlight.js/
yarn build:doc
yarn build
cd integration-example
yarn install
PUBLIC_URL=https://extendi.github.io/react-gate/ yarn build
cd ..
mv site/_book site/docs
mv site/docs integration-example/build/docs
echo "Gitbook has built the doc site for github pages"