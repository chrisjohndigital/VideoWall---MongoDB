var express = require('express');
var router = express.Router();

var mongoclient = require('mongodb').MongoClient;
var assert = require('assert');

var sanitizeHtml = require('sanitize-html');

var insertDocument = function(db, req, callback) {
   db.collection('walls').insertOne( {
      'name' : sanitizeHtml(req.body.name),
      'position' : sanitizeHtml(req.body.position),
      'visible' : sanitizeHtml(req.body.visible),
      'videos': []
   }, function(err, result) {
        assert.equal(err, null);
        callback();
  });
};

router.post('/', function(req, res) {
    var url = req.app.get('mongodbaddress');
    mongoclient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, req, function() {
            db.close();
            res.redirect('/');
        });
    });
});

module.exports = router;