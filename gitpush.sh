#!/bin/bash

export VERSION=`cat public/version.json | jq -r .version`
export V1=`echo $VERSION | cut -d. -f1`
export V2=`echo $VERSION | cut -d. -f2`
export V3=`echo $VERSION | cut -d. -f3`

V3=$((V3+1))
export VERSION=$V1.$V2.$V3
export NVERSION=`cat public/version.json | jq -r "{version: \\"$VERSION\\"}"`
echo $NVERSION > public/version.json

export BRANCH=`git rev-parse --abbrev-ref HEAD`
git add .
git commit
git push origin $BRANCH