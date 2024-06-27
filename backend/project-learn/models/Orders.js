// what all things comes under an order
// for which USER the order has been generated
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    userOrder : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    createdAt : {
            type : Date,
            default : Date.now,
        }
})


module.exports = mongoose.model("Orders",orderSchema)