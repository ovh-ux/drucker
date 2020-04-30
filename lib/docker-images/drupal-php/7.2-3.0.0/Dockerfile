FROM wodby/drupal-php:7.2-4.15.1
MAINTAINER OVH-UX <github@ovh.net>

ARG DOCKER_USER=1000
ARG DOCKER_USER_GROUP=1001


# Switch to root
# @see https://github.com/wodby/php/commit/d4c0b703310471b3555a360e343f6d7551162d37
USER root
RUN apk update && apk --no-cache add shadow

# Override permissions with user/group of the host
#RUN usermod -u $DOCKER_USER www-data
RUN groupmod -g $DOCKER_USER_GROUP www-data
## Change files with old uid/gid
RUN find /var/www/ -group 82 -exec chgrp -h $DOCKER_USER_GROUP {} \; && find /var/www/ -user 82 -exec chown -h $DOCKER_USER {} \;
## User www-data can su (for phproot)
RUN chmod u+s /sbin/su-exec

USER wodby
