const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.checkMinimum = (req, res, next) => {
    // checking if amount is more than or equal to minimum amount

    if(req.body.amount < 100) return next(new AppError("The minimum amount for deposit is 100", 403));
    next();
}

exports.isActive = catchAsync(async (req, res, next) => {
    const {disable} = await User.findById(req.user._id);
    if(disable) return next(new AppError("This account has been disabled, please contact your account manager",403))
    next();
})

exports.checkBalance = catchAsync(async (req, res, next) => {
    const {balance} = await User.findById(req.user._id);
    if(balance <  req.body.amount) return next(new AppError("Your account has an insufficient balance for this transaction ",403))
    next();
})