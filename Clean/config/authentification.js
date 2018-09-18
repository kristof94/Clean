module.exports = function (admin) {
  return function (req, res, next) {
    console.log(req);
    return next();
  };
}
/*  
 */