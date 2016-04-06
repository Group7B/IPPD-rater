'use strict';

var passport = require('passport'),
  User = require('mongoose').model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  SamlStrategy = require('passport-saml').Strategy;

module.exports = function (app, db){
  passport.use(new SamlStrategy(
    {
      path: config.passport.saml.path,
      entryPoint: config.passport.saml.entryPoint,
      issuer: config.passport.saml.issuer

    },
  function(profile, done){
    return done(null, 
      {
        id: profile.uid,
        email: profile.email,
        displayName: profile.cn,
        firstName: profile.givenName,
        lastName: profile.sn
      });
  })
    );


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(user,done){
    done(null, user);
  });
};