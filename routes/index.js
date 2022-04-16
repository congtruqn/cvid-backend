var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors')
/* GET home page. */
router.get('/', function(req, res, next) {
  let url = process.env.MONGO_DSN
  res.json({
    data:url
  });
});
module.exports = router;