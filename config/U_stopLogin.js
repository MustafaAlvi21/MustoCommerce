module.exports = {
//  stop members to access page after login
  u_loginPage: function(req, res, next) {
    // console.log('check  ' + req.user)
    if (req.user){
      if (req.user.role == 'user') {
          return res.redirect('/');
      }}
    return next();
  }
}