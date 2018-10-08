const cookieConf = require("./cookieConf");
const checkUser = require('./checkUser.js');

module.exports = function (admin) {
    return function (req, res, next) {
        var idToken = req.body.idToken || req.cookies.uid;
        if(idToken == null){
            res.status(401).send('UNAUTHORIZED REQUEST!');
            return;
        }
        admin.auth().verifyIdToken(idToken)
            .then((decodedIdToken) => {
                isVerified = checkUser.isVerifiedEmail(decodedIdToken);
                isExpired = checkUser.isExpiredAuth(decodedIdToken.auth_time);
                return Promise.all([isVerified, isExpired]);
            })
            .then(() => {
                return admin.auth().createSessionCookie(idToken, {
                    expiresIn: cookieConf.options.maxAge
                });
            }).then(sessionCookie => {
                res.setHeader('Content-Type', 'application/json');
                res.cookie('session', sessionCookie, cookieConf.options);
                next();
            }).catch(error => {
                if (error.code === 100) {
                    res.status(200).send(error);
                } else {
                    res.status(401).send('UNAUTHORIZED REQUEST!');
                }
            });
    };
}
