#/bin/sh

DOCKER_CONTAINER="mysshfs"

CONTAINER_RUNNING=`docker ps | grep $DOCKER_CONTAINER`
if [ -n "$CONTAINER_RUNNING" ]
then
  docker stop $DOCKER_CONTAINER
fi

