var express = require('express');
var router = express.Router();

var mongoclient = require('mongodb').MongoClient;
var assert = require('assert');
var walls = [];

var findWalls = function(db, callback) {
   var cursor = db.collection('walls').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
          console.dir(doc);
          walls[walls.length] = {name: doc.name, position: doc.position, visible: doc.visible, id: doc._id}
      } else {
         callback();
      }
   });
};

router.get('/', function(req, res, next) {
    var url = req.app.get('mongodbaddress');
    walls = [];
    mongoclient.connect(url, function(err, db) {
        assert.equal(null, err);
        findWalls(db, function() {
            db.close();
            res.render('index', { walls: walls });
        });
    });
});

module.exports = router;