var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

var deleteRecord = function(db, query, callback) {
    db.collection('walls').deleteOne(
      query,
      function(err, results) {
         console.log(results);
         callback();
      }
   );
};

router.get('/', function(req, res, next) {
    var url = req.app.get('mongodbaddress');
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        deleteRecord(db, {'_id': ObjectId(req.query.id)}, function() {
            db.close();
            res.redirect('/');
        });
    });
});

module.exports = router;