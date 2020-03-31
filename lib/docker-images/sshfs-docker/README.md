# OVH - SSHFS

This is a docker container image that runs openssh, expose a port and allows to mount a volume from your sdev-docker using sftp or sshfs.

## Prerecquisites

You need to have `ssh` and `sshfs` installed on your desk.

```bash
ovh-root install sshfs
```

## Quick start

First, you need to get/build the image:

```bash
# on your sdev-docker:
cd workspace
git clone ssh://git@stash.ovh.net:7999/uxtools/sshfs-docker.git
cd sshfs-docker
docker build -t ovh/sshfs .
```
(@FIXME: get the image from registry.ovh.com)

Then, to be able to connect, you need to add your id_rsa.pub of your desk, into the authorized_keys file of your sdev-docker:
```bash
# on your desk:
cat ~/.ssh/id_rsa.pub
[copy the key]

# on your sdev-docker:
vi ~/.ssh/authorized_keys
[paste the key in a new line]
```

Add these aliases on your *sdev-docker*:
```bash
# on your sdev-docker:
vi ~/.bashrc
## append these lines at the bottom of the file (put the cursor at the bottom of the file -> push "i" -> right-click -> paste -> push escape -> enter ":wq" and push enter)
alias sshfs_up='docker run --name sshfs -d -p XXX22:22 -v $HOME/.ssh/authorized_keys:/etc/authorized_keys/`whoami` -v $HOME/path/to/your/projects:/home/`whoami`/sshfs -e SSH_USERS="`whoami`:`id -u`:`id -g`" ovh/sshfs'
alias sshfs_down='docker rm -f sshfs'
```
And edit these values:
- Change the sshfs port "XXX22" (for example "19522") to your personal sdev-docker port.
- Change your _working_ directory (here "$HOME/path/to/your/projects").
- [optional] if you want to use a specific authorized_keys file, change "$HOME/.ssh/authorized_keys".

Add these aliases on your *desk*:
```bash
# on your desk:
vi ~/.bashrc
## append these lines at the bottom of the file (put the cursor at the bottom of the file -> push "i" -> right-click -> paste -> push escape -> enter ":wq" and push enter)
alias sshfs_sdevdocker_mount='sshfs -oPort=XXX22 -o reconnect,ServerAliveInterval=15,ServerAliveCountMax=3 `whoami`@gw2sdev-docker.ovh.net:/home/`whoami`/sshfs $HOME/where/you/want/to/mount/'
alias sshfs_sdevdocker_umount='fusermount -u $HOME/where/you/want/to/mount/'
alias sshfs_sdevdocker_clear='ssh-keygen -f "$HOME/.ssh/known_hosts" -R [gw2sdev-docker.ovh.net]:XXX22'
```
And edit these values:
- Change the sshfs port "XXX22" (for example "19522") to your personal sdev-docker port.
- Change your _mount_ directory (here "$HOME/where/you/want/to/mount/"). Note: don't forget to "mkdir" it ;).

Don't forget to "source" the .bashrc after the modification:
```bash
# on your desk:
source ~/.bashrc
# on your sdev-docker:
source ~/.bashrc
```

Notes:
- If you have an error when mounting on your desk, run `sshfs_sdevdocker_clear`.
- We recommend to mount ONE folder that contains all of your projects, instead of mounting a lot of sshfs.
- You can use a specific authorized_keys file, if you want (see above).

---

### Alternative method

You can use a different method:

- Clone or copy this repo content to your sdev-docker.
- Edit the published port, the public/authorized_keys to load, the volume and mount point in *start.sh* as you see fit.
- Run with `./start.sh`
- Stop with `./stop.sh`

By default, this script will share your $HOME/projects folder on /home/$USER/projects, using your $HOME/.ssh/authorized_keys a public keys and recreating your username, and uid/gid so that your user retain file ownership.

Note: if you kill the container instead of stopping it, you might have to manually remove the entry from your ssh *known_hosts* file as a new set of server keys is generated each time the container is created.
To avoid this, *use the stop.sh* instead of docker rm.

---

## (Windows only) Setup a SFTP client

Once you have the sshfs container running on a published port, you should be able to configure a SFTP client to connect to your docker, using the following info:

- hostname: gw2sdev-docker.ovh.net
- port: [the published port you configured when starting the sshfs container + 22] (ex : "195" + 22)
- protocol : select "SFTP"
- logon Type: select "Key file"
- username: [your sdev-docker username]
- authentication (Key file): the ssh private key + passphrase that you provided the corresponding ssh public with. (you may need putty's pageant or some other ssh agent depending on the client you use.)
Key file for Filezilla: (you have to use your ssh private key. This one will be converted by filezilla.) 
    * Clic on "Browse", 
    * find your keys directory, 
    * select "All files" to see the ssh keys 
    * select your private key (id_rsa)
    * "Open"
    * Select "Yes" to convert the key file (into .ppk)
    * enter the password of your private key and valid
    * choose a name for your ppk key and save
    
    

On windows 10, it has been tested successfully using:
- filezilla
- dokany 1.03 x64 + win-sshfs 1.6.1.13-devel.

---

## Advanced usage

### How to (re)build

```bash
docker build -t ovh/sshfs .
```

### How to use as a specific user

You need to:
- declare the user (or users, comma-separated) as the environment variable SSH_USERS. See *Environment options*.
- mount each user public key in /etc/authorized_keys/{username}

Example:

```bash 
docker run --name sshfs -d -p 44022:22 -v ~/.ssh/id_rsa.pub:/etc/authorized_keys/$(whoami) -v ~:/home/$(whoami)/ -e SSH_USERS="$(whoami):$(id -u):$(id -g)" ovh/sshfs
```

### How to use as root

Mount your .ssh credentials (RSA public keys) at /root/.ssh, as in this example:

```bash
docker run -d -p 44022:22 -v /secrets/id_rsa.pub:/root/.ssh/authorized_keys -v /mnt/data/:/data/ ovh/sshfs
```

### Environment options

- `SSH_USERS` list of user accounts and uids/gids to create. eg `SSH_USERS=www:48:48,admin:1000:1000`
- `MOTD` change the login message

---

## Troubleshooting

Before trying to clone the repo, don't forget to add you ssh key on Stash (see FAQ).

### What to do if my sshfs doesn't work ?

Before calling any help, try to : 

- connect to your sshfs docker using ssh command : 
```bash
ssh -oPort=19522 `whoami`@gw2sdev-docker.ovh.net  (change the -oPort=19522 to the configured gate)
```
If the ssh test responds something like 'this is for sshfs only' then you have access, on the other hand, if you still don't have access, at least you will have logs and error message (not the good key in known_hosts for instance).
- Check if your sshfs docker shares the right folder.
The correct folder is maybe not set correctly. to check this : 
  - connect to your sdev-docker.
  - type in : docker ps
  - find the ID of your sshfs docker image
  - type in docker exec -it `the ssjfs image ID` /bin/bash
  - you'll be logged in the sshfs docker image
  - ls /home/`whoami`...
  - If this folder is empty, chances are that your setup fo the docker sshfs image are wrong. Redo the config while focusing on the folders paths you want to sshfs

---

Credits are due to [Andrew Cutler](https://github.com/macropin/docker-sshd/blob/master/Dockerfile)

