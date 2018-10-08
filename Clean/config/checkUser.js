exports.isVerifiedEmail = function(decodedIdToken) {
    return new Promise((resolve, reject) => {
        if (decodedIdToken.emailVerified || decodedIdToken.email_verified) {
            resolve(decodedIdToken);
            return;
        }
        var error = { message: "Email isn't verified, ",uid:decodedIdToken.uid, code: 100 };
        reject(error);
    });
}

exports.isExpiredAuth = function (auth_time) {
    return new Promise((resolve, reject) => {
        if (new Date().getTime() / 1000 - auth_time < 5 * 60) {
            resolve();
            return;
        }
        reject();
    });
}