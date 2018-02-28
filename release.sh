#!/usr/bin/env bash

set -eux

cd android
sed -r -i 's/(.*)(versionCode )([0-9]+)(.*)/echo "\1\2$((\3+1))\4"/ge' app/build.gradle
sed -r -i 's/(.*)(versionName .)([0-9]+)\.([0-9]+)(.*)/echo "\1\2\3.$((\4+1))\5"/ge' app/build.gradle
sed -i 's/\(versionName \)\(.*\)/\1\"\2\"/g' app/build.gradle
./gradlew assembleRelease
git commit -am 'Bump'
