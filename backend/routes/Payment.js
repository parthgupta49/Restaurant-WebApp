//Import the required modules
const express = require('express');
const router = express.Router();

const {capturePayment, verifySignature} = require('../controllers/payment');
const {auth, isVisitor, isAdmin} = require('../middleware/auth');

router.post('/capturePayment', auth, isVisitor, capturePayment);
router.post('/verifySignature', verifySignature);

module.exports = router;
