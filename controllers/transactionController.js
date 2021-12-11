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
  // checking if the sender's account is disabled

  if(prevUser.disable) return next(new AppError("This account has been disabled, please contact your account manager", 403));

    // checking if amount is more than or equal to minimum amount

    if(req.body.amount < 100) return next(new AppError("The minimum amount for deposit is 100", 403));
    const user = req.user._id;
    const prevUser = await User.findById(user);

    const balance = prevUser.balance + req.body.amount
    await User.findByIdAndUpdate(user, { balance },{new: true});
    const doc = await new Transaction({...req.body, transactionType: "deposit", user, balance}).save();

    res.status(201).json({
      status: "success",
      data: doc
    });
});

exports.withdraw = catchAsync(async (req, res, next) => {
  // checking if the sender's account is disabled

  if (prevUser.disable)return next(new AppError("This account has been disabled, please contact your account manager",403));

    // checking if amount is more than or equal to minimum amount

    if (req.body.amount < 100) return next(new AppError("The minimum amount for withdrawal is 100", 403));
    const user = req.user._id;
    const prevUser = await User.findById(user);

    const balance = prevUser.balance - req.body.amount;
    await User.findByIdAndUpdate(user, { balance }, { new: true });
    const doc = await new Transaction({ ...req.body,transactionType: "withdrawal", user, balance }).save();

    res.status(201).json({
      status: "success",
      data: doc,
    });
});

exports.transferFunds = catchAsync(async (req, res, next) => {
  // checking if the sender's account is disabled

  if (sender.disable)return next(new AppError("This account has been disabled, please contact your account manager",403));
  
    // checking if amount is more than or equal to minimum amount

    if (req.body.amount < 100)return next(new AppError("The minimum amount for transfer is 100", 403));

    // checking if there is no description
    if(!req.body.description) return next(new AppError("Every transfer should have a description", 403));
    const user = req.user._id;
    const sender = await User.findById(user);

    const receiver = await User.findOne({accountNumber: req.body.receiver});
    if(!receiver) return next(new AppError("There is no user with that account Number", 404));
    const senderBalance = sender.balance - req.body.amount;
    const receiverBalance = receiver.balance + req.body.amount;

    // creating sender's transaction

    await User.findByIdAndUpdate(user, { balance: senderBalance }, { new: true });
    const doc = await new Transaction({ ...req.body, user, transactionType: "transfer", balance: senderBalance }).save();

    // creating receiver's transaction

    await User.findByIdAndUpdate(receiver._id, { balance: receiverBalance }, { new: true });
    await new Transaction({ ...req.body,transactionType: "credit", user: receiver._id, balance: receiverBalance }).save();

    res.status(201).json({
      status: "success",
      data: doc,
    });
});

exports.getAllTransactions = catchAsync(async (req, res, next) => {

});