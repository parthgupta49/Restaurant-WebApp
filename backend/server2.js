// const multer = require('multer');
// const upload = multer(); // config
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const stripe = require('stripe')
('sk_test_51Q1sSAI5XXw9fyNzHfTynwEnGWBbIzYlb2OiHm1ULAjtrUQ1gsaKtMhSxQ5F4SwdOAhWys8ywNgUsRMayarMMFi900rCt61JgR')

app.use(cookieParser())
app.use(express.json());
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp'
}))
app.use(session({
    secret : 'gawk_gawk_69420',
    resave : false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge : null
     }
}));

// const multipart = require('connect-multiparty')
// app.use(multipart())
const userRoutes = require('./routes/User')
const productRoutes = require('./routes/Products')
const paymentRoutes = require('./routes/Payment')
const orderRoutes = require('./routes/Orders')

const database = require('./config/database')


const cors = require('cors')

const {cloudinaryConnect} = require('./config/cloudinary')



const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');

database.connect()





app.use(
    cors({
        origin : "http://localhost:5173",
    })
)

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
// app.use(upload.any());
// app.use(multipart());

cloudinaryConnect();

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/product",productRoutes);
app.use("/api/v1/order",orderRoutes)


//new changes....
const Products = require("./models/Products");
const User = require("./models/User");
const Orders = require("./models/Orders");



async function baller_rajan(obj1){
    try {
        const { userId, allTheProductsIdWithQuantity } = obj1;

        // console.log(userId)
        // console.log(allTheProductsIdWithQuantity)
        // loop to iterate through this array and we'll get one object
        // which is storing the productId and quantity of that product

        const finalProductArrayToBePushedToOrder = [];

        for (let i = 0; i < allTheProductsIdWithQuantity.length; i++) {
            const element = allTheProductsIdWithQuantity[i];
            // console.log("one object of the array is : ",element)
            const productId = element.productId;
            // console.log("Product id is : ",productId)
            const product = await Products.findByIdAndUpdate(
                {_id : productId},
                { quantity: element.quantity }, // Set the quantity value
                { new: true } // To return the updated document
            );
            // console.log("Product : ",product)
            // product = product.toObject();
            // console.log(typeof product);
            // console.log(element.quantity)
            // product["quantity"] = element.quantity;

            // product.quantity = element.quantity;
            // Object.defineProperties(product,"quantity",{value : element.quantity,writable : true})
            // console.log("Product inside the array : ", product);

            finalProductArrayToBePushedToOrder.push(product);
        }   

        // console.log(
        //     "Check the first Product pushed in the finalProductsArray",
        //     finalProductArrayToBePushedToOrder[0]
        // );

        // user nikalo

        const orderPayLoad = {
            product: finalProductArrayToBePushedToOrder,
            userOrder: userId,
        };
        const order = await Orders.create(orderPayLoad);
        console.log(order._id);
        if (!order) {
            return {
                success: false,
                message: "Can't create the order",
            };
        }

        const user = await User.findByIdAndUpdate(
            { _id: userId },
            {
                $push: {
                    orders: order._id,
                },
            },
            { new: true }
        ).populate("orders");

        if (!user) {
            return {
                success: false,
                message: "User is not present",
            };
        }
        // push the order into user db | orders
        // user.orders.push(order._id);
        const orderId = order._id;
        return {
            success: true,
            message: "Order created successfully",
            orderId,
            // user,
        };

        // get the user and push this order to it
    } catch (error) {
        console.log("inside catch in createOrders function i.e baller_rajan");
        console.log(error.message);
        return {
            success: false,
            message: "Was not able to create the order issue in the try block",
            data: error.message,
        };
    }
};

app.use("/api/v1/orders/getOrdersForTheUser", async (req, res) => {
    try {
        const { userId } = req.body;

        // get the user
        const user = await User.findOne({_id : userId}).populate("orders");

        // some validation
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not present",
            });
        }

        // console.log(user);
        
        const userOrder = user.orders;
        console.log(userOrder)
        // userOrder.forEach((object)=>{
        //     console.log(object);
        // })

        return res.status(200).json(
            {
                success : true,
                message : "Products for a user fetched successfully",
                userOrder,
            }
        )




    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

app.use("/api/v1/orders/getOrderDetails", async (req, res) => {
    try {
        const { orderId } = req.body;

        const orderDetails = await Orders.find({ _id: orderId }).populate(
            "product"
        );

        // some validation
        if (!orderDetails) {
            return res.status(400).json({
                success: false,
                message: "Could not find the order",
            });
        }

        console.log(orderDetails);
        return res.status(200).json({
            success: true,
            message: "Order Details fetched successfully",
            orderDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// default route
app.get("/",(req,res)=>{
    return res.json({
        success : true,
        message : "Your server is up and running",
    })
})

app.post("/dashboard",function(req,res){
    console.log("inside dashboard");
    console.log("dashboard :accountType : "+req.body.accountType);
    if(req.body.accountType === 'Visitor')
    {
        res.json({
            redirectTo : "test-for-visitors.html"
        });
    }
    else if(req.body.accountType === 'Admin')
    {
        res.json({
            redirectTo : "test.html"
        });
    }
})

app.listen(PORT,()=>{
    console.log(`APP RUNNING AT ${PORT}`)
})

app.post("/add_to_cart",function(req,res){
    console.log("adding to cart");
    console.log("add_to_cart : productId : "+req.body.productId);

    let flag = 0;
    
    //if no cart in session,create a array for cart
    if(!req.session.cart)
    {
        console.log("creating session");
        req.session.cart = [];
    }

    //check if the product is aldready added to cart
    for(var i = 0;i < req.session.cart.length;i++)
    {
        //if so then switch the flag and indicate that it is aldready added
        if(req.session.cart[i]['productId'] == prod_name || req.session.cart[i]['prod_name'] === prod_name)
        {
            flag = 1;
        }
    }

    if(flag == 0)
    {
        req.session.cart.push({
            productId : req.body.productId,
            quantity : 1
        })
    }

    console.log(req.session.cart);
    res.end();
})

app.get('/cart_route',function(req,res){
    console.log("token_zzz : "+req.cookies.token);
    if(req.cookies.token)
    {
        console.log('yes');
    }
    else
    {
        console.log('no');
    }
    res.end();
})

app.post('/checkout',async function(req,res){
    let products_list = req.body.productsList;
    console.log(products_list);

    let __temp__line_items = [];
    products_list.forEach(function(element){
        __temp__line_items.push({
            price_data : {
                currency : 'inr',
                product_data : {
                    name : element.productName
                },
                unit_amount : element.price * 100
            },
            quantity : element.quantity
        })
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types : ['card'],
        mode : 'payment',
        success_url : 'http://localhost:4000/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url : 'http://127.0.0.1:5173/cart.html',
        line_items : __temp__line_items
    });

    console.log(session.url);
    res.json({
        url : session.url
    });
})

app.get('/success',async function(req,res){
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    //const customer = await stripe.customers.retrieve(session.customer);
    const paymentIntentId = session.payment_intent;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log("paymentIntent_____________________________________\n");
    console.log(paymentIntent);
    console.log("paymentIntent_____________________________________");

    //console.log(session);

    // res.sendFile('D:/Project/backend/project-learn/success.html');
    res.sendFile('D:\\Project-13-04-2024-main functinality is done\\Project\\frontend\\success.html');
})

app.post('/pre_payment_process',async function(req,res){
    console.log('hrer!');
    console.log("cart : "+req.body.cart);
    console.log("usr id : "+req.body.UserId);
    console.log(typeof req.body.cart);
    let var01 = req.body.cart;
    console.log(var01);
    for(var i = 0;i < var01.length;i++)
    {
        console.log(var01[i]);
    }
    let resultFromAfunction = await baller_rajan({
        userId : req.body.UserId,
        allTheProductsIdWithQuantity : req.body.cart
    })
    console.log("resultFromAfunction : ");
    console.log(resultFromAfunction);
    res.json(resultFromAfunction)
})