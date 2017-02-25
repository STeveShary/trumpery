#!/bin/bash
docker run \
    --interactive \
    --tty \
    --rm \
    --workdir /opt/app \
    --env DEBUG=trumpery \
    --volume $(pwd):/opt/app \
    --name trumpery  \
    node /opt/app/bin/www
