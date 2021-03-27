function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
    console.log(`      <<  ${ req.originalUrl}  >>    `)
   
    res.app.set('previousPage', req.originalUrl);

    req.flash('error_msg', 'Please sign in to view that resource');
    res.redirect('/sign-in');
}


function previousPage(req, res, next){  
  url = req.originalUrl
  return url
}


module.exports = { ensureAuthenticated, previousPage };