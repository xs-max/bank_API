const express = require("express");
const { protect } = require("../controllers/authController");
const {createTransaction, deposit} = require('./../controllers/transactionController');

const router = express.Router();

router.use(protect)

router.post('/deposit', deposit);


module.exports = router;
