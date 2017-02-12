#!/bin/bash
docker run \
    --interactive \
    --tty \
    --workdir /opt/app \
    --volume $(pwd):/opt/app \
    node rm -rf node_modules/
