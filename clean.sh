#!/bin/bash
docker run \
    --interactive \
    --tty \
    --workdir /opt/app \
    --volume $(pwd):/opt/app \
    node rm -rf public/dist/* node_modules/
