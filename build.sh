#!/usr/bin/env bash
npm install
if [ ! -d "mongodb" ]; then
tar -zxvf mongodb-osx-x86_64-3.2.9.tgz
mkdir -p mongodb
cp -R -n mongodb-osx-x86_64-3.2.9/ mongodb
rm mongodb-osx-x86_64-3.2.9.tgz
rm -R mongodb-osx-x86_64-3.2.9/
fi

if [ ! -d "mongodb/data" ]; then
mkdir -p mongodb/data/db
fi
