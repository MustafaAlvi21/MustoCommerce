const mongoose = require('mongoose');
const sha256 = require('sha256')

const storeSchema = new mongoose.Schema({
    storeId : {type: String, required: false, default: sha256(JSON.stringify(Date.now())) },
    storeName: {type: String, required: false},
    owner: {type: String, required: false},
    contact: {type: Array, required: false, additionalItems: false,
        name: { type: String, required: false },
        phone:{ type: String, required: false }
    },
    address1: {type: String, required: false},
    city: {type: String, required: false},
    country: {type: String, required: false, default: "Pakistan"},
    noOfProducts: {type: String, required: false},
    date: {type: Date, required: false, default: timeIn_am_pm()},
    timeStamp :{type: String, required: false, default: Date.now()}
})

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

const storeDataModule = mongoose.model('stores', storeSchema);
module.exports =  storeDataModule;