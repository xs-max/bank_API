const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const { checkMinimum, isActive, checkBalance } = require("../middlewares/transactionMiddleware");
const {createTransaction, deposit, withdraw, transferFunds, getAllTransactions, reverseTransfer} = require('./../controllers/transactionController');

const router = express.Router();

router.use(protect)
router.patch('/reverse/:transactionID', reverseTransfer);

router.use(isActive);

router.get('/mytransactions' ,getAllTransactions);

router.use(checkMinimum);

router.post('/deposit', deposit);

router.use(checkBalance);

router.post('/withdraw', withdraw);
router.post('/transfer', transferFunds);


module.exports = router;
