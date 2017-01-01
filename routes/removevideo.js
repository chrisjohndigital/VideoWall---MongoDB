var express = require('express');
var router = express.Router();

var mongoclient = require('mongodb').MongoClient;
var objectid = require('mongodb').ObjectID;
var assert = require('assert');
var videos = [];

var findVideos = function(db, query, callback) {
   var cursor = db.collection('walls').find( query );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc.videos);
          videos = doc.videos;
      } else {
         callback();
      }
   });
};

var updateRecord = function(db, query, videos, callback) {
    db.collection('walls').updateOne(
      query,
      {
        $set: { 'videos': videos }
      }, function(err, results) {
        console.log(results);
        callback();
   });
};

router.get('/', function(req, res) {
    var url = req.app.get('mongodbaddress');
    videos = [];
    mongoclient.connect(url, function(err, db) {
        assert.equal(null, err);
        findVideos(db, {'_id': objectid(req.query.id)}, function() {
            delete videos[req.query.index]
            updateRecord(db, {'_id': objectid(req.query.id)}, videos, function() {
                db.close();
                res.redirect('/wall?id='+req.query.id);
            });
        });
    });
});

module.exports = router;