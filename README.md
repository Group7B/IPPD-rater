##IPPD Rater

The site can be accessed when connected to the UF ampus network, or by connecting to the VPN. 
<a href="http://rate.ippd.ufl.edu/"> rate.ippd.ufl.edu</a>

### Modules and APIs
Multiparty
Angular File Upload
passport-saml


### About
This project is intended for use by IPPD to rate projects during the end-of-year showcase.

### Features
Login with your email, Facebook, or Twitter

<a href="http://imgur.com/rfHiRGD"><img src="http://i.imgur.com/rfHiRGD.png" title="source: imgur.com" width="50%" height="50%"/></a>

View a list of projects that you have not ranked

<a href="http://imgur.com/XXOmlJ6"><img src="http://i.imgur.com/XXOmlJ6.png" title="source: imgur.com" width="50%" height="50%" /></a>

Rate project qccording to 3 exciting criteria

<a href="http://imgur.com/afpenCd"><img src="http://i.imgur.com/afpenCd.png" title="source: imgur.com" width="50%" height="50%"/></a>

Easily revisit projects you have rated

<a href="http://imgur.com/V7rDL8y"><img src="http://i.imgur.com/V7rDL8y.png" title="source: imgur.com" width="50%" height="50%"/></a>

Judges can rank their top 3 projects for each category

<a href="http://imgur.com/3tB7GWd"><img src="http://i.imgur.com/3tB7GWd.png" title="source: imgur.com" width="50%" height="50%"/></a>

Admins can change the website's theme with ease

<a href="http://imgur.com/PjxjLZq"><img src="http://i.imgur.com/PjxjLZq.png" title="source: imgur.com" width="50%" height="50%"/></a>

Admins can easily delete, add, and manage projects and users

<a href="http://imgur.com/JukPyxo"><img src="http://i.imgur.com/JukPyxo.png" title="source: imgur.com" width="50%" height="50%"/></a>

### Setup
In order to setup this repository clone the project then run

```bash
$ npm install
```

A local.js file is required. This file is NOT included in this public repository for privacy reasons. You can contact Amanda to request the file we used for testing.  Once you get it, copy it into config/env.

Alternatively you can create your own following this formart:
```javascript
'use strict';

// This is the local.js file that you will be adding to config/env

module.exports = {  
  db: {
    uri: <Mongo URI>,
    options: {
      user: <Username>,
      pass: <Password>
    }
  },
  sessionSecret: process.env.SESSION_SECRET || 'secretphrase',
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  passport: {
    strategy : 'saml',
    saml : {
      path : <Redirect path after login>,
      entryPoint : <Your IDP entry point>,
      issuer : 'passport-saml'
    }
  }
};
```

Once the local.js file has been created run

```bash
$ grunt
```

Next, open a browser and go to "localhost/3000" (or if you're still using IE or Edge, then "http://localhost/3000") and you should see the webpage.
