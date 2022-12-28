#!/bin/bash

yarn sequelize-cli db:migrate --config="./src/database/migrations/config/config.json" --migrations-path="./src/database/migrations/migrations" && yarn start:dev
