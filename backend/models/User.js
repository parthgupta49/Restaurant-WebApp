const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        phone : {
            type : Number,
            required : true,
        },
        username : {
            type : String,
            trim : true,
            required : true,
        },
        email : {
            type : String,
            required : true,
            trim : true
        },
        password : {
            type : String,
            required : true,
        },
        accountType : {
            type  : String,
            enum : ["Admin","Visitor"]
        },
        address : {
            type : String,
        },
        orders: [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Orders"
        }],
        image : {
            type : String,
            required : true,
        }
    }
)

module.exports = mongoose.model("User",userSchema)