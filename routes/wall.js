var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var videos = [];

router.get('/', function(req, res, next) {
    var url = req.app.get('mongodbaddress');
    videos = [];
    if (req.query.id!=undefined) {
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            findVideos(db, {'_id': ObjectId(req.query.id)}, function() {
                db.close();
                res.render('wall', { videos: videos, id: req.query.id, name: req.query.name });
            });
        });
    }
});

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

module.exports = router;