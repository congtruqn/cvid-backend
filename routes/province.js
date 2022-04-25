var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var per_page = 15;
var District = require('../models/province');

router.get('/list', function(req, res){
	District.getallDistrict(function(err, provinces){
        if(err) throw err;
        var data = [];
        provinces.forEach(function(province){
            var data_province = {
                _id: province._id,
                Id: province.Id,
                Name: province.Name,
                Districts: []
            };
            var districts = province.Districts.toObject();
            districts.forEach(function(district){
                delete district.GHNSupport
                delete district.TTCSupport
                delete district.VNPTSupport
                delete district.ViettelPostSupport
                delete district.ShipChungSupport
                delete district.GHNDistrictCode
                delete district.ViettelPostDistrictCode
                delete district.ShipChungDistrictCode
                data_province.Districts.push(district);
            });
            data.push(data_province);
        });

        res.json(data);
    });
});

module.exports = router;