const express = require ('express');
const router =  express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const userDataModel = require ('../models/users')
const { isVerified } = require('../middlewares/isVerifiedAccount')
const { ensureAuthenticated, previousPage} = require('../config/auth')
const { u_loginPage } = require('../config/U_stopLogin')



/*  ---------------------------------------------  */
/*                Global login                     */
/*  ---------------------------------------------  */

router.get('/sign-in', u_loginPage,  (req, res)=>{
    if (!req.user){
    //   console.log();
        return res.render('signin', {
          title: 'Sign In',
          loginUser: undefined 
        })
    }
});
    
    
router.post('/sign-in', u_loginPage, isVerified, (req, res, next) => {
    previousUrl = res.app.get('previousPage');
    // console.log(previousUrl)
    url = typeof previousUrl !== 'undefined' ? previousUrl : '/'
    passport.authenticate('local', {
      successRedirect: url,
      failureRedirect: '/sign-in',
      failureFlash: true,
    })(req, res, next)
    // console.log(req.user)
})
  
  
/*  ---------------------------------------------  */
/*              Email  Verification                */
/*  ---------------------------------------------  */
router.get('/verify/:id', u_loginPage, function(req, res){
    let id = req.params.id;
    userDataModel.find({_id : id}).then((result) => {
        console.log("result[0].resetPasswordExpiry")
        console.log(result[0].resetPasswordExpiry)
        if(result[0].resetPasswordExpiry > Date.now()){
            userDataModel.findByIdAndUpdate( id, {verified: 'true', resetPasswordExpiry: '0.00000001' }, function(err, data){
              return res.render('verify', {
                  title: 'Moo commerce - Verify',
                  msg: 'Account verified!!!',
                  loginUser: undefined, 
              })
            })  
        } else {
            return res.render('verify', {
                title: 'Moo commerce - Verify',
                msg: 'Link expired!!!',
                loginUser: undefined, 
            })      
        }
    }).catch((err) => {
        console.log(err);
        return res.send(err)        
    });
});


/*  ---------------------------------------------  */
/*                Forget password                  */
/*  ---------------------------------------------  */
router.get('/forget-password', u_loginPage, function(req, res){
    return res.render('forgetPassword', {
        title: '4storez - Forget Password',
        msg: '',
        loginUser: undefined,
    })
});
  
router.post('/forget-password', u_loginPage, function(req, res){
    const email = req.body.email;
    userDataModel.findOne({email: email }).exec(function(err, data){
    if (err) throw err;
      if (data){
      const nodemailer = require("nodemailer");
      async function main() {
      let testAccount = await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'catchnoreply1@gmail.com', // generated ethereal user
          pass: 'nadmfxnnbrwzsnkt', //  generated ethereal password
        },   
      });
      const userId = data._id;

      const url = 'https://mustocommerce.herokuapp.com/new-password'
      // const url = 'http://localhost:4000/new-password'

      let info = await transporter.sendMail({
        from: '"4storez 👻" ', // sender address
        to: req.body.email, // list of receivers
        subject: "Forget password link", // Subject line
        // text: "Through below link you can reset your password", // plain text body
        // html: "<h3>Reset password link: </h3> "+ `${url}`+"/"+`${userId}`, // html body
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
   <style>
       body{
        background-color: #f4f4f4
       }
       .emailContainer{
        max-width: 600px;margin: auto; background-color: #fff;padding: 10px;
       }
       .btnBox{
        text-align: center;padding: 1rem 0;
       }
       .btn{
           margin: 1rem 0; 
           color: #fff; 
           border-radius: 10px;
           border: none;
           padding: 1rem 1.5rem;
           background-color: #ff6a00;
           font-weight: 700;
           text-align: center;
           text-decoration: none;
           vertical-align: middle;
       }
       .pb-10{
        padding-bottom: 10px
       }
       .pt-10{
        padding-top: 10px;
       }
       .logoheader{
        text-align: center;padding-top: 1rem;
       }
       .heading-pr{
        font-weight: 550;margin-bottom: 40px;color: #a3a6ab; text-align: center;
       
       }
       .para{
        font-size: 20px;text-align: justify; text-align: center;
       }
       .dib{
        display: inline-block;
       }
       .text-center{
        text-align: center;
       }
   </style>
</head>
<body>
    <div class="emailContainer">
        <!-- logo -->
        <header class="logoheader">
            <div class=""><img src="https://lh3.googleusercontent.com/fife/ABSRlIolpmscwMTkL2up3WLmPbIM-Jdp41G4y9H2SL9S7XlCFJyAeZTY1jhzkV-8Oi33lhTqlTIO6s9xv-wjUgS6_Or3KUMFPDoR8F3U3RpXsS3jonTA4x71hnQiVbT7iN6PoMeftGbEsjEUePOF8qOQaxe5CiaJg2zi9tWp-G7SNTXuWQAPx7li6XAPQOCLIGkUXgMHYdCKtP3t83KCCj5SmpgaG0xSQyyXQjTAeIMQ35lG4N2VNK6xQ1h4OcgpYLLsXYqUiODwoDuQPw09wz8ma5m87rHCwGvRocxpEL_utAEOsemnxBNpo-Ed1e8EP2yUh_4fkN77kFxWqKoU625OROl6C2y3mhDyyFLzteNcYP4LZxyDtgyNNkSHVZisV_S9PFsXu-8xCjreXZ8EK4_vu3sWPzdZS_Lt3tLDotsU4CPCODgl1NQu_JQ-MjrFiEb4loe1tZq8rpM7L84f8BdpwAyxqvMbCrsrW8rc9KfQhAXWS3xZlxEYjtAPeDMVAj6wdpt4Q2HKFUIT2G7jenmoUvAhJ_9p2H9DXaUS9pmuGX0xRAP2sS7C9MdAON7Sf2XJ4pg3wxUvl0B0Hr0k6Z18LyFMf9AZyeo_AYYdGpmVnO1NCicNecBo4ZBH6nzgKW95ZPH2CkEjVr4jkrWAjilvUZ7xf1E8zGZbMOlEgeJyoq1zR6_fR_a38KGOMBMGyleypzR4PjRtJ2hqN7m0NyRufF2pbjM=s220-ft" style="max-width: 400px;"></div>
        </header>
        <!-- Password Reset heading -->
        <div class="pb-10">
            <h1 class="heading-pr">Password Reset</h1>
            <p class="para">Seems like you forget your password for 4storez. If this is true, click below to reset your password.</p>
        </div>
        <!-- button -->
        <div class="btnBox">
            <a href="${url}/${userId}" class="btn" target="_blank" style="color: white">Reset My Password</a>
        </div>

        <!-- ignore masg -->
        <p class="pt-10 para">If you did not forget your password you can safely ignore this email.</p>

        <!-- link -->
        <div class="text-center" >
            <h4 class="dib">Link:</h4>
            <p style="display: inline;"><a href="${url}/${userId}">${url}/${userId}</a></p>
        </div>
    </div>
</body>
</html>
        `
        
      });  
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    
      let d = new Date();
      d = d.getTime();
      new_d = d + 600000
          
      userDataModel.findOneAndUpdate({email: email}, {
        resetPasswordExpiry: new_d
      }).exec((err, data) => {
        if (err) throw error; 
        if (data){
          console.log('resetPasswordExpiry')
          console.log(data)
        }
      })
      main().catch(console.error);
      // ====================================
      
      return res.render('forgetPassword', { title: 'Moo commerce - Forget Password', success_msg:'Reset password link is emailed...', loginUser: undefined, })
      } else {
        return res.render('forgetPassword', { title: 'Moo commerce - Forget Password', error:'Invalid email', loginUser: undefined, })          
      }
    })
  })
   

/*  ---------------------------------------------  */
/*                  New Password                   */
/*  ---------------------------------------------  */
router.get('/new-password/:id', u_loginPage, function(req, res){
    const id = req.params.id;
    // console.log('id: ' + id)
    let d = new Date();
    time = d.getTime();

    userDataModel.findOne({_id: id}).then(data => {
      if(data){  // data found hone pay check hoga k link expiry hogai hay ya nahi is behalf pay page render hoga
        console.log(data.resetPasswordExpiry)
        if(typeof data.resetPasswordExpiry != undefined && data.resetPasswordExpiry != null && parseInt(data.resetPasswordExpiry) > time){
          console.log('access 1')
          res.render('new_password', {title : 'Moo commerce - New Password', id: id, msg152: "working", loginUser: undefined, })
        } else {
          res.render('new_password', {title : 'Moo commerce - New Password', id: id, msg152: "expired", msg: "Link is expired!!!", loginUser: undefined, })
        }
      }
    }).catch(err => {
      res.render('new_password', {title : 'Moo commerce - New Password', id: id, loginUser: undefined, })
    })
})
     
router.post('/new-password/:id', u_loginPage, function(req, res){
    console.log('yse')
    let id = req.params.id;
    let enteredPassword = req.body.password;
    console.log('id = > ' + id)
    console.log('password = > ' + req.body.password)

//            H a s h   P a s s w o r d 
   bcrypt.genSalt(10, (err, salt) => 
   bcrypt.hash(enteredPassword, salt, (err, hash) => {
//            S e t   p a s s w o r d   t o   h a s h e d               
  //  user.encryptedPassword = hash; 
    userDataModel.findByIdAndUpdate( id, {encryptedPassword: hash, resetPasswordExpiry: '0.00000001'}, function(err, data){
        if (err) throw err;
        if (data){
            return res.render('signin', {
                title: 'Moo commerce - New Password',
                loginUser: undefined,
                success_msg: "Password updated"
            })
        } 
    }) 
  }) )
});



/*  ---------------------------------------------  */
/*                User Register                    */
/*  ---------------------------------------------  */

router.get('/sign-up', u_loginPage, (req, res)=>{
    if(!req.user){
        return res.render('signup', {
            title: 'Sign Up',
            msg:'',
            loginUser: undefined,
        })
    } else {
        return res.redirect("/")
    }
});

router.post('/sign-up', u_loginPage, (req, res)=>{
    const fullname = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password= req.body.password;
    const re_password= req.body.re_password;
    
    let errors = [];

    if ( !fullname || !email || !password || !phone){
        errors.push({ msg: 'Please fill in all fields'});
    }
      
    if ( password.length < 6 ){
      errors.push({ msg: 'Password should be atleast 6 characters'});
    }

    if ( password !== re_password){
      errors.push({ msg: 'Password must be match with Confirmation Password'});
    }

    if(errors.length > 0) {
      res.render('home', { errors, fullname, email, password,loginUser: undefined })
    } else {
        userDataModel.findOne({email : req.body.email}).then( data => {
            if (data) {

            //   U s e r   o r   E m a i l   i s   e x i s t 
            errors.push({ msg : 'Email is already registered'});
            // req.flash('errors', "errors.msg")
            // return res.redirect("./sign-up");
            
            return res.render("signup", { errors, fullname, phone, loginUser: undefined })
            
            } else {
                const user = new userDataModel({
                    fullname : fullname,
                    email : email,
                    phone : phone,
                    encryptedPassword : password,
                    role : 'user',
                });

                //            H a s h   P a s s w o r d               
                bcrypt.genSalt(10, (err, salt) =>  
                  bcrypt.hash(user.encryptedPassword, salt, (err, hash) => {
                    if (err) throw err;
                    //            S e t   p a s s w o r d   t o   h a s h e d               
                    user.encryptedPassword = hash;
                    //            S a v e   u s e r   o r   c r e a t e   u s e r  
                    user.save().then( user => {
                        console.log('user -- ' + user)
                        req.flash('success_msg', "Registered successfully")
                        // return res.render("signup", { success_msg })
            
                        // req.flash('success_msg', 'Registered successfully.')
                        return res.redirect("/sign-in");
                      })               
                      .catch( (err) => {
                        console.log(err) 
                        req.flash('errors', "errors")
                        return res.redirect("/sign-up");
                      });
                    }) 
                )
            }
        })
    }
})    //  End of post router

    
/*  ---------------------------------------------  */
/*                     Logout                      */
/*  ---------------------------------------------  */
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/')
})

    
    

module.exports = router
