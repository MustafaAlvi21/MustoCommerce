const router = require("express").Router();
const subscriberModule = require('../models/subscribers');
const { ensureAuthenticated, previousPage} = require('../config/auth')


router.post('/subscribers', async (req, res) => {
    previousUrl = res.app.get('previousPage');
    console.log(previousUrl)
    url = typeof previousUrl !== 'undefined' ? previousUrl : '/';
    
    await new subscriberModule({
        email: req.body.email
    }).save().then((result) => {
               req.flash("success_msg", "You have subscribed successfully")
        return res.redirect(url)

    }).catch((err) => {
        console.log(err);
        if(err.name == "MongoError" && err.code == 11000){
            req.flash("error", "This email is already subscribed.")
            return res.redirect(url)
        }
        return res.send(err)
    });
});

module.exports = router;