const User = require('../models/User');
const Orders = require('../models/Orders');
const Products = require('../models/Products')

// create an order
exports.createOrder = async (req,res) => {
    try {
        const {userId,allTheProductsIdWithQuantity} = req.body;
        

        // loop to iterate through this array and we'll get one object
        // which is storing the productId and quantity of that product

        const finalProductArrayToBePushedToOrder = [];

        for (let i = 0; i < allTheProductsIdWithQuantity.length; i++) {
            const element = allTheProductsIdWithQuantity[i];

            const productId = element.productId;
            const product = await Products.findById(productId);

            product.quantity = element.quantity;

            finalProductArrayToBePushedToOrder.push(product._id);
        }

        console.log(finalProductArrayToBePushedToOrder);

        // user nikalo

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json(
                {
                    success : false,
                    message : "User is not present"
                }
            )
        }

        const orderPayLoad = {product:finalProductArrayToBePushedToOrder,userOrder : user};
        const order = await Orders.create(orderPayLoad);
        res.status(200).json({
            success : true,
            message : "Order created successfully",
            order,
            user,
        })



        // get the user and push this order to it


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message : "Was not able to create the order",
            data: error.message,
        });
    }
}

// get all the orders, only for the admin
exports.getAllOrders = async (req,res) => {

    try {
        const allOrders = await Orders.find({});

        if(!allOrders){
            return res.status(400).json({
                success : false,
                message : "No Orders exists"
            })
        }

        return res.status(200).json({
            success : true,
            message : "ALl the Orders fetched successfully",
            allOrders
        })
    } catch (error) {
        console.error(error);
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Failed to fetch the orders"
        })
    }
}

// get the details for a single order
exports.getAnOrder = async(req,res) => {
    try {
        const {orderId} = req.body;

        const orderDetails = await Orders.find(
            {_id : orderId}
        )

        // some validation
        if(!orderDetails){
            return res.status(400).json({
                success : false,
                message : "Could not find the order"
            })
        }

        console.log(orderDetails)
        return res.status(200).json(
            {
                success : true,
                message : "Order Details fetched successfully"
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

