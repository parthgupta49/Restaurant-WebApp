const mongoose = require('mongoose');

const ratingAndReview = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User",
        },
        rating : {
            type : Number,
            required : true,
        },
        review : {
            type : String,
            required : true,
        },
        product : {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "Product",
            index : true,
        }


    }
)

module.exports = mongoose.model("RatingAndReview",ratingAndReview)