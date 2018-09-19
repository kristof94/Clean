const cookieConf = require("./cookieConf");

module.exports = function (admin) {
    return function (req, res, next) {
        var uid = req.body.uid;
        var idToken = req.body.idToken;
        const expiresIn = cookieConf.expiresIn;
        admin.auth().createCustomToken(uid).then(function (customToken) {
                admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
                    // Only process if the user just signed in in the last 5 minutes.
                    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
                        return admin.auth().createSessionCookie(req.body.idToken, {
                            expiresIn
                        }).then((sessionCookie) => {
                            // Set cookie policy for session cookie.
                            const options = {
                                maxAge: expiresIn,
                                httpOnly: true /*, secure: true*/
                            };
                            res.setHeader('Content-Type', 'application/json');
                            res.cookie('session', sessionCookie, options);
                            res.status(200).send({
                                success: true
                            });
                            next();
                        }, error => {
                            console.log(error);
                            res.status(401).send('UNAUTHORIZED REQUEST!');
                        });
                    }
                    // A user that was not recently signed in is trying to set a session cookie.
                    // To guard against ID token theft, require re-authentication.
                    res.status(401).send('Recent sign in required!');
                }).catch(function (error) {
                    res.status(401).send('UNAUTHORIZED REQUEST!');
                });
            })
            .catch(function (error) {
                res.status(401).send('UNAUTHORIZED REQUEST!');
            });
    };
}