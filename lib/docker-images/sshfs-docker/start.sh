#/bin/sh

#
# TODO - EDIT TO YOUR NEEDS
#
PORT=44022
VOLUME=$HOME/projects
MOUNT=/home/$USER/projects
AUTHORIZED_KEYS=$HOME/.ssh/authorized_keys

#
# Mount and share as this user.
#
USERNAME=`whoami`
USERID=`id -u`
GROUPID=`id -g`

#
# Docker params
#
DOCKER_IMAGE="ovh/sshfs"
DOCKER_CONTAINER="mysshfs"  # needs to match DOCKER_CONTAINER name in stop.sh

# Build docker image if required
IMAGE_EXISTS=`docker images | grep $DOCKER_IMAGE`
if [ -z "$IMAGE_EXISTS" ]
then
  docker build -t $DOCKER_IMAGE .
fi

# Create or restart docker container.
CONTAINER_EXISTS=`docker ps -a | grep $DOCKER_CONTAINER`
if [ -z "$CONTAINER_EXISTS" ]
then
  docker run --name $DOCKER_CONTAINER -d -p $PORT:22 -v $AUTHORIZED_KEYS:/etc/authorized_keys/$USERNAME -v $VOLUME:$MOUNT -e SSH_USERS="$USERNAME:$USERID:$GROUPID" $DOCKER_IMAGE
else
  docker start $DOCKER_CONTAINER
fi

