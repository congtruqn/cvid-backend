var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accesskey = process.env.CVID_SECRET


module.exports.checkToken = function (token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, accesskey, function (err, decoded) {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        })
    })
}

// var checkToken = function (token) {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, SECRET, function (err, decoded) {
//             if (err) {
//                 reject(err);
//             }
//             else {
//                 resolve(decoded);
//             }
//         })
//     })
// }



module.exports.checkAdmin = async function (req, res, next) {
    if (!req.headers.authorization || !(req.headers.authorization.split(" ")[0] === "Basic")) {
        res.status(401).json({
            auth: false, message: 'No token foundk.'
        });
    }
    else {
        try {
            let decode = await module.exports.checkToken(req.headers.authorization.split(" ")[1])
            if (decode.type == 1) {
                next();
            }
            else {
                res.status(401).json({ auth: false, message: 'You are not admin' });
            }

        } catch (err) {
            res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
        }
    }
}

