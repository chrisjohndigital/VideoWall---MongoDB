var express = require('express');
var router = express.Router();

var Busboy = require('busboy');
var fs = require('fs');
var path = require('path');
var inspect = require('util').inspect;

var sanitizeHtml = require('sanitize-html');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
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
        $set: { "videos": videos }
      }, function(err, results) {
        console.log(results);
        callback();
   });
};

router.post('/', function(req, res) {
    var busboy = new Busboy({ headers: req.headers });
    var entry = new Object();
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        entry[fieldname] = sanitizeHtml(val);
    });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var uploadsDirectory = (path.join(__dirname, '../public/uploads/'))
        var saveTo = path.join(uploadsDirectory, path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
    });
        
    busboy.on('finish', function() {
    });
    req.pipe(busboy);
    var url = req.app.get('mongodbaddress');
    videos = [];
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findVideos(db, {'_id': ObjectId(req.query.id)}, function() { 
            videos[videos.length] = entry;
            updateRecord(db, {'_id': ObjectId(req.query.id)}, videos, function() {
                db.close();
                res.redirect('/wall?id='+req.query.id);
            });
        });
    });
});

module.exports = router;