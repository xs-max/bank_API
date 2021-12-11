const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const { checkMinimum, isActive } = require("../middlewares/transactionMiddleware");
const {createTransaction, deposit, withdraw, transferFunds} = require('./../controllers/transactionController');

const router = express.Router();

router.use(protect)
router.use(isActive);

router.use(checkMinimum);

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transferFunds);


module.exports = router;
