##IPPD Rater

The site can be accessed when connected to the UF ampus network, or by connecting to the VPN. 
<a href="http://rate.ippd.ufl.edu/"> rate.ippd.ufl.edu</a>

### Modules and APIs
Multiparty
Angular File Upload
passport-saml


### About
This project is intended for use by IPPD to rate projects during the end-of-year showcase.

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

then open a browser and go to "localhost/3000" (or if you're still using IE or Edge, then "http://localhost/3000") and you should see the webpage.
