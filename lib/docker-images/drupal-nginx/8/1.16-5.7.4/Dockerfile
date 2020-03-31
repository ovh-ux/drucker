FROM wodby/nginx:1.17-5.8.10
MAINTAINER OVH-UX <github@ovh.net>

ARG DOCKER_USER=1000
ARG DOCKER_USER_GROUP=1001

# Switch to root
# @see https://github.com/wodby/php/commit/d4c0b703310471b3555a360e343f6d7551162d37
USER root

RUN echo http://dl-cdn.alpinelinux.org/alpine/edge/community/ >> /etc/apk/repositories
RUN apk update && apk --no-cache add shadow

RUN set -ex && \
    addgroup -S -g 82 www-data && \
    adduser -S -u 82 -s /bin/bash -D -G www-data www-data

# Re-switch to www-data
# @see https://github.com/wodby/php/commit/d4c0b703310471b3555a360e343f6d7551162d37
USER wodby

