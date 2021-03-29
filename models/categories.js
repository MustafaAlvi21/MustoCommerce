const Mongoose = require('mongoose')

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
  
const categorySchema = new Mongoose.Schema({
    categoryId : {type: String, require: true,},
    name : {type: String, required: true,  },
    subName : {type: String, required: true, lowercase: true,  },
    status : {type: String, required: true, default: "active", enum : ["active", "in-active", "removed"]},
    cover1Image: { type: Buffer, required: true},
    cover1ImageType: { type: String, required: true},
    date : {type: Date, require: true, default: timeIn_am_pm()}  
})



categorySchema.virtual('cover1ImagePath').get(function() {
    if (this.cover1Image != null && this.cover1ImageType != null) {
      return `data:${this.cover1ImageType};charset=utf-8;base64,${this.cover1Image.toString('base64')}`
    }
  });

var categoryDataModule = Mongoose.model('category', categorySchema);
module.exports =  categoryDataModule;