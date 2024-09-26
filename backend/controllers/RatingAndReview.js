const RatingAndReview = require('../models/RatingAndReview')
const Product = require('../models/RatingAndReview')
const mongoose = require('mongoose')

// createRating
exports.createRating = async (req, res) => {

    try {
        // get user id
        const userId = req.user.id;

        // fetch data from req body
        const { rating, review, productId } = req.body;
        // check if user has purchased the product or not
        const productDetails = await Product.findOne({
            _id: productId,
            userPurchased: { $elemMatch: { $eq: userId } }
        });

        if (!productDetails) {
            return res.status(404).json({
                success: false,
                message: "User has not purchased the Product"
            })
        }
        // check if user is already reviewed the product
        const alreadyReviewed = await RatingAndReview.find(
            {
                user: userId,
                product: productId,
            }
        )
        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "User has already reviewed the product"
            })
        }
        // create ratingAndReview 
        const ratingANdreview = await RatingAndReview.create({
            rating, review, product: productId, user: userId,
        })
        // update the course with this ratingANdreview

        const updatedProductDetails = await Product.findByIdAndUpdate({ _id: productId }
            , {
                $push: {
                    ratingAndReviews: ratingANdreview._id,
                }
            },
            { new: true }

        )
        console.log(updatedProductDetails)
        // return the response

        return res.status(200).json({
            success: true,
            message: "Rating and reviews successfully ",
            ratingANdreview
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }

}

// getAverageRating
exports.getAverageRating = async (req,res) => {
    try {
        // get product Id
        const product_id = req.body.productId;

        // calculate avg rating
        const result = await RatingAndReview.aggregate(
            [
                {
                    $match : {
                        product : new mongoose.Types.ObjectId(productId),
                },
            },
            {
                $group : {
                    _id : null,
                    averageRating : {$avg : "$rating"},
                }
            }
            ]
        )

        // return rating

        if(result.length > 0){
            return res.status(200).json(
                {
                    success : true,
                    averageRating : result[0].averageRating
                }
            )
        }

        // if no rating/review exists

        return res.status(200).json({
            success: true,
            message : "Average Rating is 0 no ratings given till now"
        }) 







    } catch (error) {
        
    }
}

// getAllRatingAndReviews

exports.getAllRating = async (req,res) => {
    try {
        

        const allReviews = await RatingAndReview.find({}).sort({rating : "desc"})
        .populate(
            {
                path : "user",
                select : "username email thumbnail",
            }
        )
        .populate(
            {
                path : "product",
                select : "productName"
            }
        )
        .exec() ;

        return res.status(200).json(
            {
                success : true,
                message : "All reviews fetched successfully",
                data : allReviews,
            }
        )






    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}