module.exports = function (admin) {
  return function (req, res, next) {
    const sessionCookie = req.cookies.session || '';
    admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */ ).then((decodedClaims) => {
      req.decodedClaims = decodedClaims;
      next();
    }).catch(error => {
      console.log(error);
      res.redirect('/');
    });
  };
}