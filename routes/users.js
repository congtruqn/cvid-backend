var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/register');
const jwt = require('jsonwebtoken');
const UserVerification = require('../models/UserVerification')
var bcrypt = require('bcryptjs');
const accesskey = process.env.CVID_SECRET
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, users){
   	if(err) throw err;
   	if(!users){
   		return done(null, false, {message: 'Unknown User'});
   	}
   	User.comparePassword(password, users.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, users);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
}));
passport.serializeUser(function(users, done) {
  done(null, users.id);
});
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, users) {
    done(err, users);
  });
});
router.post('/login', function(req, res, next) {
	User.getUserByUsername(req.body.username, function(err, users) {
		if(users){
			passport.authenticate('local', function(err, user, info) {
				if (err ||!user) { return res.status(401).json({"code": 401,"massage":"Sai mật khẩu"}) }
				if (user.status == 0) { return res.status(401).json({"code": 401,"massage":"Tài khoản của bạn chưa được xác thực"}) }
				
				var tokenss = jwt.sign({id:user._id,username:req.body.username,status:user.status,type:user.type},accesskey,{
					algorithm: 'HS256',
					expiresIn: 7760000
				});
				user.password = '';
				res.status(200).json({
					"token":tokenss,userinfo:user
				})
				
			})(req, res, next);
				
		}
		else{
			res.status(404).json({
				"code": 404,
				"massage":"Tài khoản không tồn tại"
			})
		}
	});
});
router.get("/verify/:userId/:uniqueString",(req,res)=>{
	let { userId, uniqueString } = req.params;
	UserVerification
		.find({userId})
		.then((result) =>{
			console.log(result)
			if(result.length>0){
				var  hashedUniqueString = result[0].uniqueString;
				console.log(hashedUniqueString)
				bcrypt
					.compare(uniqueString,hashedUniqueString)
					.then(result=>{
						if(result){
							User
								.findOneAndUpdate({_id: userId},{status:1})
								.then(()=>{
									UserVerification
										.deleteOne({userId})
										.catch((error)=>{
											console.log(error)
										})
								})
								.catch(error=>{
									console.log(error)
								})
							res.send("Verify successful")
						}
						else{
							res.send("Verify fail!!!")
						}
					})
					.catch(error=>{
						console.log(error)
					})
			}
			else{
				let message
			}
		})
		.catch((error)=>{
			console.log(error)
		})
})


module.exports = router;
