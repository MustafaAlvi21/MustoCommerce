const Mongoose = require('mongoose');
const sha256 = require('sha256');

function timeIn_am_pm() { 
  let options = {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  },
  formatter = new Intl.DateTimeFormat([], options);
  console.log(formatter.format(new Date()));
  return (formatter.format(new Date()))
} 

const productSchema = new Mongoose.Schema({
  productId : {type: String, required: true},
  name : {type: String, required: true},
  status : {type: String, required: true, enum : ["active", "in-active", "removed"]},
  price : {type: Number, required: true},
  subPrice : {type: Number, require: false},
  categoryId : {type: String, require: true},
  storeId : {type: String, require: true},
  brand : {type: String, require: false},
  productColors : {type: Array, require: false},
  productSizes : {type: Array, require: false},
  specs : {type: String, require: true},
  promo : {type: String, require: false},
  date : {type: Date, require: true, default: timeIn_am_pm()},
  timeStamp : {type: String, require: true, default: Date.now()},
  cover1Image: { type: Buffer, required: true},
  cover1ImageType: { type: String, required: true},
  cover2Image: { type: Buffer },
  cover2ImageType: { type: String },
  cover3Image: { type: Buffer },
  cover3ImageType: { type: String },
  cover4Image: { type: Buffer },
  cover4ImageType: { type: String },
  featureProduct: {type: String, required: false, enum : ["true", "false"]},
  comment: {
          type: Array,
          additionalItems: true,
          authorId: {
                type: String
          },
          authorName: {
                type: String
          },
          comment:{
                type: String
              },
          date:{
                type: String
              },

          reply:{
                type: Array,
                additionalItems: true,
                authorId: {
                    type: String
                  },
                authorName: {
                    type: String
                  },
                  comment: {
                    type: String
                  },
                  date: {
                    type: String
                  },
          }
  },
  reviews: { type: Array }
});


  productSchema.virtual('cover1ImagePath').get(function() {
    if (this.cover1Image != null && this.cover1ImageType != null) {
      return `data:${this.cover1ImageType};charset=utf-8;base64,${this.cover1Image.toString('base64')}`
    }
  });

  productSchema.virtual('cover2ImagePath').get(function() {
    if (this.cover2Image != null && this.cover2ImageType != null) {
      return `data:${this.cover2ImageType};charset=utf-8;base64,${this.cover2Image.toString('base64')}`
    }
  });

  productSchema.virtual('cover3ImagePath').get(function() {
    if (this.cover3Image != null && this.cover3ImageType != null) {
      return `data:${this.cover3ImageType};charset=utf-8;base64,${this.cover3Image.toString('base64')}`
    }
  });

  productSchema.virtual('cover4ImagePath').get(function() {
    if (this.cover4Image != null && this.cover4ImageType != null) {
      return `data:${this.cover4ImageType};charset=utf-8;base64,${this.cover4Image.toString('base64')}`
    }
  })

var productDataModule = Mongoose.model('products', productSchema);
module.exports =  productDataModule;


// reviews: {
//   type: Array,
  // additionalItems: true,
  // authorId: {
  //       type: String
  // },
  // authorName: {
  //       type: String
  // },
  // review: {
  //       type: String
  // },
  // rating: {
  //       type: String
  // },
  // timeStamp: {
  //       type: String
  // },
// }