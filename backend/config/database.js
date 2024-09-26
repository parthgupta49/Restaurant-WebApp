
const mongoose = require('mongoose');

require('dotenv').config();
exports.connect = () => {

    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("DB CONNECTED ")
    })
    .catch((err)=>{
        console.log("DB CONNECTion FAILED");
        console.error(err);
        process.exit(1);
    })      
}