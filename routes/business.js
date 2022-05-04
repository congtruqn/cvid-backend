var express = require('express');
var router = express.Router();
var cors = require('cors')
var User = require('../models/register');

router.post('/register', function(req, res){

    var name = req.body.name;
    var address = req.body.address;
    var username = req.body.username;
    var password = req.body.password;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
    } else {
        
        var newBusiness = new User({
            name: name,
            address: address,
            username: username,
            password: password,
            type: 3,
            status: 0
        });
        User.createUser(newBusiness, function(err, companys) {
            if (err) throw err;
            res.send('ok');
        });
    
        
    }
});

module.exports = router;