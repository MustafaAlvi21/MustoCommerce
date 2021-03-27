Mongoose = require('mongoose')

const categorySchema = new Mongoose.Schema({
    categoryId : {type: String, require: true,},
    name : {type: String, required: true,  },
    subName : {type: String, required: true, lowercase: true,  },
    status : {type: String, required: true, default: "active", enum : ["active", "in-active", "removed"]}
})

var categoryDataModule = Mongoose.model('category', categorySchema);
module.exports =  categoryDataModule;