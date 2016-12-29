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

router.get('/', function(req, res, next) {
    var url = req.app.get('mongodbaddress');
    videos = [];
    if (req.query.id!=undefined) {
        mongoclient.connect(url, function(err, db) {
            assert.equal(null, err);
            findVideos(db, {'_id': objectid(req.query.id)}, function() {
                db.close();
                res.render('wall', { videos: videos, id: req.query.id, name: req.query.name });
            });
        });
    }
});

module.exports = router;