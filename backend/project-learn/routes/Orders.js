//Import the required modules
const express = require('express');
const { createOrder, getAllOrders } = require('../controllers/Orders');
const router = express.Router();

// import the controllers


router.post('/createOrder',createOrder);
router.get('/getAllOrders',getAllOrders);

module.exports = router;