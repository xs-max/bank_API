const express = require("express");
const { protect } = require("../controllers/authController");
const {createTransaction, deposit, withdraw, transferFunds} = require('./../controllers/transactionController');

const router = express.Router();

router.use(protect)

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transferFunds);


module.exports = router;
