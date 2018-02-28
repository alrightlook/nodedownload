var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');

var walk = function(dir, done) {
  var result = [];
  fs.readdir(dir, function(err, list) {
  if (err) return done(err);
  var pending = list.length;
  if(!pending) return done(null, result);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    fs.stat(file, function(err, stat) {
      if(stat && stat.isDirectory()) {
        walk(file, function(err, res) {
          result = result.concat(res);
          if (!--pending) done(null, result);
        });
      }
      else {
        result.push(file);
        if(!--pending) done(null, result);
      }
    });
  });
  });
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getfile', function(req, res, next) {
  res.download(req.query.url);
});

router.get('/walk', function(req, res, next) {
  walk(req.query.url, function(err, result)
  {
    if(err) res.statu(404).send("error!!!");
//    res.status(200).send(result);
  res.render('walk', {title: 'NoTitle',items: result});
  });
});

router.post('/sacheckout', function(req, res, next) {
  res.status(200).send({sign : 'jerrysa', msg : '' });
});
module.exports = router;
