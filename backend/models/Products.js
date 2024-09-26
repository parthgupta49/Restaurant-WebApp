const mongoose = require('mongoose');
// const user = require('./User')
const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
        },
        productDescription: {
            type: String,
        },
        price: {
            type: Number,
        },
        thumbNail: {
            type: String,
        },
        tag: {
            type: [String],
        },
        category : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        }

        ,ratingAndReviews: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        },
        userPurchased : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
            // default : false,
        },
        quantity: {  // Add the quantity property
            type: Number,
            default: 0  // Default quantity value, you can change it as per your requirement
        }

    }
)

module.exports = mongoose.model("Product", productSchema)