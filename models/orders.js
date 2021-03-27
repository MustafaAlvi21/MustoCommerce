const mongoose = require ('mongoose');
const sha256 = require('sha256')

const orderSchema = new mongoose.Schema({
//     orderId : { type: String, default: sha256(JSON.stringify(Date.now())) },
    orderId: { type: String, required: true, default: `ODR-${Date.now()}` },
    user: { type: Object, additionalItems: true,
        userId: {
              type: String, required: true,
        },
        name: {
              type: String, required: true
        },
        email: {
              type: String, required: true
        },
        phone: {
              type: String, required: true
        },
        nic: {
              type: String, required: true
        },
        address: {
              type: String, required: true
        },
        postalCode: {
              type: String, required: true
        },
        cityAndState: {
              type: String, required: true
        },
        country: {
              type: String, required: true, default: "Pakistan"
        },
        scheduleDeliveryTime: {
              type: String,
        }
    },
    products: { type: Array},
    totalPrice: { type: String},
    paymentMethod: { type: Array},
    status: {type: String, required: true, default: "Pending", enum:['Cancel', 'Pending', 'Processing', 'Shipping', 'Delivered', 'Completed']},
    date: { type: Date, required: true, default: timeIn_am_pm()},
    timestamp: { type: String, required: true, default: Date.now()}
});

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

const orderDataModule = mongoose.model('orders', orderSchema);
module.exports =  orderDataModule;