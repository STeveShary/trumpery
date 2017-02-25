#!/bin/bash
docker run \
    --interactive \
    --tty \
    --rm \
    --link mongo-trumpery:mongo \
    --workdir /opt/app \
    --env DEBUG=trumpery \
    --volume $(pwd):/opt/app \
    --name trumpery  \
    --publish 3000:3000 \
    node /opt/app/bin/www
