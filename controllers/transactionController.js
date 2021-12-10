const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");
const Transaction = require("../models/transactionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

exports.createTransaction = createOne(Transaction);

exports.deposit = catchAsync( async (req, res, next) => {
    if(req.body.amount < 100) return next(new AppError("The minimum amount for deposit is 100", 403));
    const user = req.user._id;
    const prevUser = await User.findById(user);
    if(prevUser.disable) return next(new AppError("This account has been disabled, please contact your account manager", 403))
    const balance = prevUser.balance + req.body.amount
    await User.findByIdAndUpdate(user, { balance },{new: true});
    const doc = await new Transaction({...req.body, user, balance}).save();

    res.status(201).json({
      status: "success",
      data: doc
    });
});

exports.withdraw = catchAsync(async (req, res, next) => {
    if (req.body.amount < 100)
      return next(new AppError("The minimum amount for withdrawal is 100", 403));
    const user = req.user._id;
    const prevUser = await User.findById(user);
    if (prevUser.disable)return next(new AppError("This account has been disabled, please contact your account manager",403));
    const balance = prevUser.balance - req.body.amount;
    await User.findByIdAndUpdate(user, { balance }, { new: true });
    const doc = await new Transaction({ ...req.body, user, balance }).save();

    res.status(201).json({
      status: "success",
      data: doc,
    });
});
