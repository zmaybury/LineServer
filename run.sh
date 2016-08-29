#!/usr/bin/env bash
mongod --dbpath=./mongodb/data &
npm run start -- $1