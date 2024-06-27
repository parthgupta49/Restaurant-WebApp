const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator = require('otp-generator');
let bcrpyt = require('bcrypt')
const jwt = require('jsonwebtoken');


require('dotenv').config()
// sendOTP

// exports.sendOTP = async (req, res) => {

//     try {
//         // fetch email from request body
//         const { email } = req.body;

//         //  if user exists return a response
//         const checkUser = await User.findOne({ email });
//         if (checkUser) {
//             res.status(401).json({
//                 success: false,
//                 message: "User already exists",
//             })
//         }

//         // generate the otp
//         var otp = otpGenerator.generate(6, {
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//             specialChars: false
//         })
//         console.log("Otp generated : ", otp);

//         // check unique otp or not
//         let result = await OTP.findOne({ otp });

//         while (result) {
//             otp = otpGenerator.generate(6, {
//                 upperCaseAlphabets: false,
//                 lowerCaseAlphabets: false,
//                 specialChars: false
//             })
//             result = await OTP.findOne({ otp });
//         }

//         const otpPayload = { email, otp };

//         // create an entry in db for the otp
//         const otpBody = await OTP.create(otpPayload);
//         console.log(otpBody);

//         // return response successful
//         res.status(200).json({
//             success: true,
//             message: "OTP sent successfully",
//         })


//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }

// sendOTP controller
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user already exists
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User is Already Registered',
            });
        }

        // Generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Store OTP temporarily in the database
        const otpPayload = { email, otp };
        const otpBody  = await OTP.create(otpPayload);
        console.log('OTP Body', otpBody);

        // Send OTP to the user's email

        return res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
            otp, // For testing purposes, remove this in production
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error.message,
        });
    }
};

// signUp controller
exports.signUp = async (req, res) => {
    try {
        const { username, phone, email, password, otp, accountType,address } = req.body;

        // Validate required fields
        if (!username || !phone || !email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        console.log("username : ",username)
        console.log("phone : ",phone)
        console.log("password : ",password)
        console.log("otp : ",otp)
        console.log("accountType : ",accountType)
        console.log("address",address)
        // Check if the user already exists
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already registered',
            });
        }

        // Find the most recent OTP stored for the user
        const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
        console.log("Recent OTP : ",recentOTP)
        // Validate the OTP
        if (!recentOTP || otp !== recentOTP.otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }
        
        // Hash the password
        const hashedPwd = await bcrpyt.hash(password,10);
        console.log(hashedPwd)
        // Create the user in the database
        const [firstName, lastName] = username.split(' ');
        const user = await User.create({
            phone,
            username,
            email,
            password : hashedPwd,
            accountType,
            address,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error: error.message,
        });
    }
};


// LogIn
exports.login  = async (req,res) => {
    try {
        // get data from req body
        const {email,password} = req.body;
        // validation data
        if(!email || !password)
            return res.status(403).json({
        success : false,
            message  : "All fields are required",
    }); 
        console.log(email)
        console.log(password)
        const user = await User.findOne({email})
        console.log(user);
        
        // user check exists or not
        if(!user){
        return res.status(401).json({
            success : false,
            message : "User is not registered. please signup"
        })
    }   let pass = user.password;
        console.log(pass)
        let originalPassword = await bcrpyt.compare(password,user.password)
        console.log(originalPassword)
        // generate JWT, after pwd matching

        if(originalPassword){
            const payload = {
                email : user.email,
                id : user._id,
                accountType : user.accountType
            }
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn : "24h"
                }
            )
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*10000),
                httpOnly: true,
            }
            user.token = token;
            console.log(user.password)
            

            res.cookie('token',token,options).status(200).json(
                {
                    success : true,
                    token,
                    user,
                    message : "logged in successfully",
                }
            )


        }
        else 
            return res.status(401).json(
        {
            success : false,
            message : "Password is incorrect",
        })



        // create cookie and send response
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Login failure. Please try again"
        })
    }
}


exports.changePassword = async (req,res) => {
    // get data from req body

    // get oldPassword, newPassword, confirmNewPassword
    // validation

    // update pwd in DB
    // send mail = password updated
    // return the response
}

