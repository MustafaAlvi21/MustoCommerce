const mongoose = require('mongoose');

var userSchema  = new mongoose.Schema({
        fullname : { type: String, required: true} ,
        email : { type: String, required: true} ,
        encryptedPassword : { type: String, require: true} ,
        cnic : { type: String ,  max: 13, required: false} ,
        phone : { type: String, require: true} ,
        role: { type: String , require: true, default: "user", enum : ['user', 'admin'] },
        verified: { type: String, default: 'false', enum : ['true', 'false']},
        gender : { type: String, require: false} ,
        city : { type: String, require: false} ,
        postalCode : { type: String, require: false} ,
        address : { type: String, require: false} ,
        country: { type: String, required: true, default: "Pakistan"},
        resetPasswordExpiry:  {type: String, required: false},
        coverImage: {
          type: Buffer,
          
        },
        coverImageType: {
          type: String,
          
        },
});
      
      // whatsapp : { type: String, require: false} ,

  userSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  });

  
  var userDataModel = mongoose.model('users', userSchema);
  module.exports =  userDataModel;