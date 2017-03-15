# Child First Authority
**Student absenteeism and outreach tracking app**

<!--To be re-enabled when CI fully configured-->
<!--[![Build Status](https://travis-ci.org/child-first-authority-fcc-project/webapp.svg)](https://travis-ci.org/child-first-authority-fcc-project/webapp)-->

## Purpose

This application is intended to streamline the process of tracking and reporting student absenteeism for Child First Authority.

# Authentication and Authorization

Google OAuth is used for authentication for using the app. Authenticated users are by default a 'guest'. The admin and super users are able to promote/demote 
access of other users by assigning roles.

The roles are:

  - guest
  - teacher
  - manager
  - admin
  - super user

## Deployment

**Vagrant**

See [tools/vagrant](https://github.com/freeCodeCamp/child-first-authority/tree/master/tools/vagrant) for development environment setup instructions

**Heroku**

This app contains npm scripts for easy deployment to Heroku.

After logging in to Heroku with Heroku toolbelt, deploying is accomplished by:

    $ grunt buildcontrol:heroku
    
The env variables that need to be set:

- APP_SECRET = *SECRET*
- DOMAIN = *SOME HTTPS DOMAIN*
- GOOGLE_ID = *GOOGLE ID*
- GOOGLE_SECRET = *GOOGLE SECRET*
- NODE_ENV = production
- SUPER_USER_EMAIL = *EMAIL OF SUPER USER*

Google id and secret need to be obtained by creating an application on [Google Developers Console](https://console.developers.google.com/project). 

## Sample PDFs

See [tools/sample-pdfs](https://github.com/freeCodeCamp/child-first-authority/tree/master/tools/sample-pdfs) for example import documents.

## To-Do

This version is currently under development.

* Upgrade babel-loader, current version causes depreciation warning 
  * https://github.com/babel/babel-loader/pull/391
* When session validation fails, does user stay locked-out? 
