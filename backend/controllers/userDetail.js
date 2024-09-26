const User = require('../models/User')

exports.getAllUserDetails = async (req,res) => {

    try {
        // get id
        // get user

        const id = req.user.id;

        // validation and get user details

        const userDetails = await User.findById(id);

        return res.status(200).json({
            success : true,
            message : "User data fetched successfully",
            data: userDetails,
        })




    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}