---
title: usage
layout: page
---

## Overview

These are the minimal steps to take if you set up and work with a project:

1. Create a new project (**once** per project)
2. Setup the environment (**once** per project)
3. Install Drupal and a drupal site (**once** per project)
4. Start/Stop the containers and use tools (regularly, as needed)

If you run into troubles check the [Troubleshooting](troubleshooting.md) section.

---

## Quick start

!!! note ""
    To setup a new project, see [Fresh install of Drupal](#fresh-install-of-drupal-new-project) section below.

To setup the environment in an existing project powered by Drucker, follow these commands:

```bash
$ cd <name of the project>
# Initialize the Drucker Git submodule
$ git submodule init
$ git submodule update
# Install all the dependencies
$ cd drucker
$ make install
# Run the stack
$ make start
```

The script will create your personal `drucker.config` file during installation (see [Config](#config) section).

!!! success ""
    Now you can open the website at `http://www.*PROJECT_NAME_PLAIN*.local` (or `http://*SUBNET*.101` if you could not change /etc/hosts).

!!! note ""
    Change the `/etc/hosts` if you are root, in order to use hostnames instead of IPs.

Here's the list of all domains/IPs:

| Name      | Hostname                               | IP                  |
| --------- | -------------------------------------- | ------------------- |
| PHP       | http://php.*PROJECT_NAME_PLAIN*.local  | http://*SUBNET*.100 |
| WWW       | http://www.*PROJECT_NAME_PLAIN*.local  | http://*SUBNET*.101 |
| DB        | http://db.*PROJECT_NAME_PLAIN*.local   | http://*SUBNET*.102 |
| MAIL      | http://mail.*PROJECT_NAME_PLAIN*.local | http://*SUBNET*.103 |
| PMA       | http://pma.*PROJECT_NAME_PLAIN*.local  | http://*SUBNET*.104 |

The default credentials for Drupal is:

- Login: `admin`
- Password: `admin`

#### Makefile

The `Makefile` contains all the shortcuts to use the environment:

- `make help` : See all the available commands
- `make init` : Initialize a new fresh install of Drupal with Composer
- `make install` : Install all the deps and prerequisites
- `make start` : Start the application stack
- `make stop` : Stop the application stack

---

## Loading the environment

Before any Drucker operation, you need to have variables loaded in your environment:

```bash
$ cd drucker
$ source load-env
```

This will setup aliases to use in your bash environment, in your current session.

Now, you can use some tools, like Drush or Composer, in a transparent way like if they are installed locally :).
See [Tools](tools.md) section for the full documentation of these tools.

!!! note ""
    **Tips**: You have 2 folders shortcuts aliases:

    - `home` : to go directly inside the project dir
    - `drucker` : to go directly inside the Drucker dir

---

## Directory structure

During setup, the directory structure will become something like this:

!!! quote ""
    * *Project*
        * **drucker**
            * **docker-runtime**
                * **console**
                * **drush**
                * **drush-backups**
                * **log**
                * **mysql**
                * **mysql-init**
                * **sql-backups**
            * **load-env**
            * **Makefile**
        * **drucker.config**
        * **www**
            * **config/sync**
            * **drush**
            * **scripts/composer**
            * **private**
            * **tmp**
            * **web**

* The name of ***Project*** can be chosen as you like.
* **drucker** contains build files and utilities for Docker
    * **docker-runtime** contains the runtime data (databases, configuration files and so on).
    * **load-env** has to be sourced in your bash, to access to the main tools (like Drush, ...)
    * **Makefile** contains all useful commands to manage the stack
    * All others directories are used in scripts, don't use them directly.
* **drucker.config** is the configuration file for Drucker. This file is personal and must be GIT ignored.
* **www** and subsequent directories will be created automatically during installation
    * **config/sync** is the folder to hold the Drupal configuration files (instead of sites/all/files/*some_config_dir*.
    * **drush** is the directory that contains commands, configuration and site aliases for Drush. See [this](https://packagist.org/search/?type=drupal-drush) for a directory of Drush commands installable via Composer.
    * **scripts/composer** is a directory for holding the scripts from drupal-composer project
    * **private** is a directory for holding the private files in Drupal, but outside the web root (`admin/config/media/file-system`, use `../private`, in D8: settings.php).
    * **tmp** is a directory for temporary files. It can be used as tmp-directory in Drupal (`admin/config/media/file-system`, use `../tmp`)
    * **web** is the webroot folder. Here all PHP-files and user created files will reside. See "Fresh install of Drupal".

---

## Config

The configuration of the Drucker is inside the `drucker.config` file, in the root folder.

With this variables, the names of all containers, networks and host/domainnames are built. They must be unique on the host machine.

This file is automatically generated when you install or run the stack (using [Makefile](#makefile)).

!!! warning ""
    This file is personal and must be GIT ignored!

It contains some config variables:

- `PROJECT_NAME` : The name of the project. Do not use whitespaces in the name! This will become the site name.
- `PROJECT_NAME_PLAIN` : Used to build the names of Images, Containers and Networks. You should supply a name that is unique within the your machine. It must consist of **lower case letters** and **numbers**, no hyphens, dots or underscores!
- `PUBLIC_WWW_PORT` : The website public port (80). Change it only if you share the same domain on the host (so, need to be unique).
- `PUBLIC_PMA_PORT` : The phpMyAdmin public port (80). Change it only if you share the same domain on the host (so, need to be unique).
- `SUBNET` : The private subnet of the network, the containers will run in. It must be unique within all your projects.
- `DRUPAL_VERSION` : The Drupal version (8)
- `PHP_VERSION` : The PHP version
- `PHP_XDEBUG_ENABLED` : Enable or not XDEBUG
- `NODE_VERSION` : The node.js version

See [Features/Multiple-Projects](features.md#multiple-projects) to know how to configure it for running multiple projects in parallel.

!!! note ""
    You can (re-)generate it using `make gen-config`.

---

## Fresh install of Drupal (new project)

The Drupal will be installed with Composer, using [drupal-composer](https://github.com/drupal-composer/drupal-project) project.

To create a new project using Drucker, follow these commands:

```bash
# Create an empty folder for your project
$ mkdir <name of the project>
$ cd <name of the project>
# Initialize an empty GIT project
$ git init
# Add Drucker in your project, as a Git submodule
$ git submodule add https://github.com/ovh-ux/drucker.git drucker
# Launch a fresh install of Drupal
$ cd drucker
$ make init
# Install all the dependencies
$ make install
# Run the stack
$ make start
```

When installing the given `composer.json` some tasks are taken care of:

* Drupal will be installed in the `web`-directory.
* Autoloader is implemented to use the generated composer autoloader in `vendor/autoload.php`, instead of the one provided by Drupal (`web/vendor/autoload.php`).
* Modules (packages of type `drupal-module`) will be placed in `web/modules/contrib/`
* Theme (packages of type `drupal-theme`) will be placed in `web/themes/contrib/`
* Profiles (packages of type `drupal-profile`) will be placed in `web/profiles/contrib/`
* Creates default writable versions of `settings.php` and `services.yml`.
* Creates `web/sites/default/files`-directory.

!!! warning ""
    All the contrib folders and settings files must be GIT ignored.

---

## Updating Drupal Core

Follow the steps to update your core files [here](https://github.com/drupal-composer/drupal-project#updating-drupal-core).

---

## Using in production

Drucker is a development environment only. DO NOT USE IT IN PRODUCTION.

---

## Containers used

The Drucker stack consist of the following containers:

| Container | Versions | Service name | Image |
| --------- | -------- | ------------ | ----- |
| Nginx               | 1.13               | nginx     | [wodby/drupal-nginx]   
| Apache              | 2.4                | apache    | [wodby/drupal-apache]  
| Drupal              | 8                  | php       | [wodby/drupal]         
| PHP                 | 7.1, 7.0           | php       | [wodby/drupal-php]     
| MariaDB             | 10.1               | mariadb   | [wodby/drupal-mariadb]        
| Mailhog             | latest             | mailhog   | [mailhog]              
| phpMyAdmin          | latest             | pma       | [phpmyadmin]               
| Node.js             | 8, 8-alpine        | node      | [node]    

Some of the containers are overrided, see `lib/docker-images`.

---
