const jwt = require('jsonwebtoken');
require('dotenv').config();

const user = require('../models/User');

// auth

exports.auth = async (req,res,next) => {
    try {
        // extract token
        console.log("extracting token")
        const token =req.cookies.token ||
        req.body.token;

        console.log("token : ",token)
        // if token is missing,then return response
        if(!token)
            return res.status(401).json(
        {
            success: false,
            message : "Token is missing",
        })

        // token verification
        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            console.log("Here is something useful for you",decode)
            req.user = decode;
        } catch (error) {
            return res.status(401).json(
                {
                    success : false,
                    message : "token is invalid",
                }
            )
        }
        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success : false,
            message : "something went wrong while validating the token dont'know ?"
        })
    }
}


exports.isVisitor = async(req,res,next) => {
    try {
        
        
        if(req.user.accountType!=='Visitor'){
            return res.status(401).json({
                success : false,
                message : "This is a protected route for visitors who are logged in "
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "User role can't be verified, please try again"
        })
    }
}
exports.isAdmin = async(req,res,next) => {
    try {
        console.log(req.user);
        
        if(req.user.accountType !== 'Admin'){
            return res.status(501).json({
                success : false,
                message : "This is a protected route for Admin"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "User role can't be verified, please try again"
        })
    }
}