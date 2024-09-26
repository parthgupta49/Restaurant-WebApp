const Product = require('../models/Products')
const Category = require('../models/Category')

const User = require('../models/User')
const {uploadImageToCloudinary} = require("../utils/imageUploader")



// createProduct Handler function
exports.createProduct = async (req,res) => {
    try {   
        console.log("trying to receive the product information")
        // console.log(req.body)
        // console.log(req.formData)
        // const logId = req.user.id;
        // fetch data 
        const {productName,productDescription,price,category} = req.body;

        // get image
        console.log("name : ",productName)
        console.log("desc : ",productDescription)
        console.log("price : ",price)
        console.log("category : ",category)
        // const {isJoker} = req.body;
        console.log(req.files)
        const thumbNail = req.files.thumbnail;

        // console.log(thumbNail)


        // validation
        if( !productName || !productDescription || !price || !category){
            return res.status(400).json({
                success : false,
                message : "Please fill all the fields"
            })
        }

        // check given category is valid or not
        console.log("trying to check if this category exists or not")
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(400).json({
                success : false,
                message : "category Details not found"
            })
        }

        // upload image to cloudniary
        console.log("trying to upload on cloudinary")
        const thumbnailImage = await uploadImageToCloudinary(thumbNail,"Codehelp");
        console.log(thumbnailImage)

        // create an entry for new product

        const newProduct = await Product.create({
            productName,
            productDescription,
            price,
            thumbNail : thumbnailImage.secure_url,
            category : categoryDetails._id
        });


        console.log(newProduct._id)
        // add the new product to the schema of the particular category
        const newProductAdded = await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    product: newProduct._id,
                },
            },
            { new : true }
        );
        console.log(newProductAdded)

        // update the category
        
        // const userLoggedIn = await User.findById(logId);

        // return the response
        return res.status(200).json(
            {
                success : true,
                message : "Product Created Successfully",
                newProduct,
                // logId,
                // userLoggedIn
            }
        )














    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Failed to create the product",
            error   : error.message
        })
    }
}
exports.showAllProducts = async (req,res) => {
    try {

        const allCourses = await Product.find({},
            {
                productName : true,
                price : true,
                thumbNail : true,
                productDescription : true,
                ratingAndReviews : true,
            }

            
            )
            
            


            return res.status(200).json({
                success : true,
                message : "Data for all courses fetched successfully",
                data : allCourses
            })
    } catch (error) {
            console.log(error);
            return res.status(500).json({
                success : false,
                message : "Can't fetch course data",
                error : error.message,
            })
    }
}

// getAllproducts Handler function

exports.getProductDetails = async (req,res) => {

    try {
        // get id
        const {productId} = req.body;

        const productDetails =await Product.find(
            {_id : productId}
            
        )
        .populate("ratingAndReviews")
        .exec()

    // validation

    if(!productDetails){
        return res.status(400).json(
            {
                success : false,
                message : 'Could not find the product with the product Id ' + productId
            }
        )
    }
    console.log(productDetails)
    return res.status(200).json(
        {
            success : true,
            message : "Product Details fetched successfully",
            data : productDetails,
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