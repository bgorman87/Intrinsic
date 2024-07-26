#!/bin/sh

envsubst '${BACKEND_HOST} ${BACKEND_PORT} ${SERVER_NAME}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
