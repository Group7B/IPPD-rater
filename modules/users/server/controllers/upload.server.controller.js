'use strict';

var multiparty = require('multiparty'),
  fs = require('fs');

exports.postImage = function (req, res) {
  var form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    var file = files.file[0];
    var contentType = file.headers['content-type'];
    var destPath = 'modules/core/client/img/brand/IPPD_logo.png';
    
    // Server side file type checker.
    if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
      fs.unlink(file.path);
      return res.status(400).send('Unsupported file type.');
    }

    fs.rename(file.path, destPath, function (err) {
      if (err) {
        return res.status(400).send('Image is not saved:');
      }
      return res.json(destPath);
    });
  });
};

exports.postProjectLogo = function (req, res) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    var file = files.file[0];
    console.info(file);
    var contentType = file.headers['content-type'];
    
    var fileName = file.originalFilename;
    var destPath = 'modules/projects/client/img/logos/' + fileName;
    
    // Server side file type checker.
    if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
      fs.unlink(file.path);
      return res.status(400).send('Unsupported file type.');
    }

    fs.rename(file.path, destPath, function (err) {
      if (err) {
        return res.status(400).send('Image is not saved:');
      }
      return res.json(destPath);
    });
  });
};