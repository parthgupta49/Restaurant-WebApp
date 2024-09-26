//Import the required modules
const express = require('express');
const router = express.Router();


const User = require('../models/User')

//Import the required controllers and  middleware functions
const {
    login,
    signUp, 
    sendOTP,
} = require('../controllers/auth');


const {getAllUserDetails} = require('../controllers/userDetail');
// const {
//     resetPasswordToken,
//     resetPassword,
// } = require('../controllers/ResetPassword');

const {auth} = require('../middleware/auth');

//Routes for Login, signUp, and Authentication

//*******************************************************************************
//                          Authentication Routes
//*******************************************************************************

//Route for user login
router.post('/login', login);

//Route for user signUp
router.post('/signUp', signUp);

//Route for sending OTP to the user's email
router.post('/sendOTP', sendOTP);

router.post('/auth',auth,async (req,res)=>{
    console.log("hello after authentication")
    console.log("user : ",req.user);
    const id = req.user.id
    // res.send(id)

    // const response = await user.findById(id)
    let response = await User.findById(id);
    console.log(response)
    // console.log(response)
    response = response.toObject();
    response.success = true;
    res.status(200).json(response);
})
//Route for changing the password
// router.post('/changePassword', auth, changePassword);

//**********************************************************************************
//                          Reset Password
//**********************************************************************************

//Route for generating a reset password token
// router.post('/reset-password-token', resetPasswordToken);

//Route for resetting user's password after verification
// router.post('/reset-password', resetPassword);








router.get('/getUserDetails', auth, getAllUserDetails);



//Export the router for use in the main application
module.exports = router;

