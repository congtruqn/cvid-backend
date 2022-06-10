var express = require('express');
var router = express.Router();
var Province = require('../models/province');

router.get('/list', function(req, res){
    Province.getallProvince(function(err, provinces){
        if(err) throw err;
        res.json(provinces);
    });
});

module.exports = router;