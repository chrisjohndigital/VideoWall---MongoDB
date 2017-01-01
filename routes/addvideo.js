var express = require('express');
var router = express.Router();

var busboy = require('busboy');
var fs = require('fs');
var path = require('path');
var inspect = require('util').inspect;

var sanitizeHtml = require('sanitize-html');

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

router.post('/', function(req, res) {
    var busboyhandler = new busboy({ headers: req.headers });
    var entry = new Object();
    busboyhandler.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        entry[fieldname] = sanitizeHtml(val);
    });
    busboyhandler.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var uploadsDirectory = (path.join(__dirname, '../public/uploads/'))
        var saveTo = path.join(uploadsDirectory, path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
    });
        
    busboyhandler.on('finish', function() {
    });
    req.pipe(busboyhandler);
    var url = req.app.get('mongodbaddress');
    videos = [];
    mongoclient.connect(url, function(err, db) {
        assert.equal(null, err);
        findVideos(db, {'_id': objectid(req.query.id)}, function() { 
            videos[videos.length] = entry;
            updateRecord(db, {'_id': objectid(req.query.id)}, videos, function() {
                db.close();
                res.redirect('/wall?id='+req.query.id);
            });
        });
    });
});

module.exports = router;