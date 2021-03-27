const Mongoose = require ("mongoose");

const subscriberSchema = new Mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    }
});

const subscriberModel = Mongoose.model("subscribers", subscriberSchema);

module.exports = subscriberModel;