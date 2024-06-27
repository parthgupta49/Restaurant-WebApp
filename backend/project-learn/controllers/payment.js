const  mongoose  = require('mongoose')
const instance = require('../config/razorpay')

const Product = require('../models/Products')

const User = require('../models/User')

const mail = require('../utils/mailSender')
const mailSender = require('../utils/mailSender')










exports.capturePayment = async (req,res) => {

    // get productId and UserID
    const {product_id} = req.body;
    const userId = req.user.id;

    if (!product_id) {
        return res.json({
            success : false,
            message : "Please provide the valid course ID"
        })
    }

    let product;
    try {
        product = await Product.findById(product_id)
        if(!product){
            return res.json({
                success: false,
                message : "Could not found the product"
            })
        }
        // user already paid for the same product

        
        const uid = new mongoose.Types.ObjectId(userId);
        if(product.userPurchased.includes(uid)){
            return res.status(200).json({
                success : false,
                message : "Product is already purchased",
            })
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }

    

    // validation
    // valid productId
    

    // order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount : amount * 100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes : {
            productId : product_id,
            userId,
        }
    }

    try {
        // initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse)

        // return response
        return res.status(200).json(
            {
                success : true,
                productName : product.productName,
                productDescription : product.productDescription,
                thumbnail : product.thumbNail,
                orderId : paymentResponse.id,
                currency : paymentResponse.currency,
                amount : paymentResponse.amount,
            }
        )
    } catch (error) {
        console.log(error)
        res.json({
            success : false,
            message : "Could not initiate the order"
        })
    }

    // return response







}


// verify Signature of Razorpay and Server

exports.verifySignature = async (req,res) => {
    const webHookSecret = "12345678";

    const signature = req.headers("x-razorpay-signature");

    const shasum = crypto.createHmac("sha256",webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if( signature === digest){
        console.log('Payment is authorised')
        const {productId,userId} = req.body.payload.entity.notes;

        try {
            // fulfill the action

            // find the product and store the user in it
            const purchasedProduct = await Product.findOneAndUpdate(
                {_id : productId},
                {$push : {userPurchased : userId}},
                {new : true},
            )

            if(!purchasedProduct){
                return res.status(500).json({
                    success : false,
                    message : "Product Not found"
                })
            }

            console.log(purchasedProduct)

            // find the user and add the product in their list of purchased products
            const purchasedUser = await User.findOneAndUpdate(
                {_id : userId},
                {$push : {products : productId}},
                {new : true},
            )
            console.log(purchasedUser)



            // confirmation mail
            const emailResponse = await mailSender(
                purchasedUser.email,
                "Confirmation for purchase",
                "you have purchased the products successfully"
            )

            console.log(emailResponse)

            return res.status(200).json({
                success : true,
                message : "Signature verified and product added",
            })



        } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success : false,
                    message : error.message,
                })
        }

    }

    else {
        return res.status(400).json({
            success : false,
            message : "Invalid request"
        })
    }



}