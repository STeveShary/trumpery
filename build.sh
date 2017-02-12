#!/bin/bash
export RUN_COMMAND="docker run --interactive --tty --workdir /opt/app --volume $(pwd):/opt/app node"

${RUN_COMMAND} npm install
${RUN_COMMAND} node ./node_modules/.bin/gulp prepareJs