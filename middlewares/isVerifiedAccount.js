
module.exports = {
      isVerified: function(req, res, next) {

        const userDataModel = require ('../models/users')

        const email = req.body.email;
        userDataModel.findOne({email: email, verified: 'false', }).exec(function(err, data){
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
            // const url = 'https://moo-commerce.herokuapp.com/verify'
            const url = 'http://localhost:4000/verify'

            // send mail with defined transport object
            let info = await transporter.sendMail({
              from: '"Moo commerce 👻" <foo@example.com>', // sender address
              to: req.body.email, // list of receivers
              subject: "Moo commerce account verification", // Subject line
              // text: "Hello world 123?", // plain text body
              // html: "<h3>Account Verification link: </h3> "+ `${url}`+"/"+`${userId}`, // html body
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
                  <div class=""><img src="https://drive.google.com/thumbnail?id=1nmnTp_Yb7-LWrv5t-ggfhrb4-744f6vY" style="max-width: 400px;"></div>
              </header>
              <!-- Password Reset heading -->
              <div class="pb-10">
                  <h1 class="heading-pr">Verify Your Account</h1>
                  <p class="para">Seems like you newly created account for Moo commerce. If this is true, click below to verify account.</p>
              </div>
              <!-- button -->
              <div class="btnBox">
                  <a href="${url}/${userId}" class="btn" target="_blank" style="color: white">Verify Account</a>
              </div>
      
              <!-- ignore masg -->
              <p class="pt-10 para">If you did not newly created your account and your account is verified then you can safely ignore this email.</p>
      
              <!-- link -->
              <div class="text-center" >
                  <h4 class="dib">Link:</h4>
                  <p style="display: inline;"><a href="${url}/${userId}">&nbsp; ${url}/${userId}</a></p>
              </div>
          </div>
      </body>
      </html>
              `
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

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
          }
            main().catch(console.error);
            return res.render('signin', { title: 'Moo commerce - Sign In', error: 'Verify your email, we have send you verification email.', loginUser: undefined, })
          }
        next();
        })
      }
}
    