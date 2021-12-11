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
const { createTransactionID } = require("../utils/helper");

exports.createTransaction = createOne(Transaction);

exports.deposit = catchAsync( async (req, res, next) => {
    const transactionID = createTransactionID();
    const user = req.user._id;
    const prevUser = await User.findById(user);

    const balance = prevUser.balance + req.body.amount
    await User.findByIdAndUpdate(user, { balance },{new: true});
    const doc = await new Transaction({
      ...req.body,
      transactionType: "deposit",
      transactionId: transactionID,
      user,
      balance,
    }).save();

    res.status(201).json({
      status: "success",
      data: {
        data: doc
      }
    });
});

exports.withdraw = catchAsync(async (req, res, next) => {
    const transactionID = createTransactionID();
    const user = req.user._id;
    const prevUser = await User.findById(user);

    const balance = prevUser.balance - req.body.amount;
    await User.findByIdAndUpdate(user, { balance }, { new: true });
    const doc = await new Transaction({
      ...req.body,
      transactionType: "withdrawal",
      transactionId: transactionID,
      user,
      balance,
    }).save();

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
});

exports.transferFunds = catchAsync(async (req, res, next) => {
    const transactionID = createTransactionID();
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
    const doc = await new Transaction({
      ...req.body,
      user,
      transactionType: "transfer",
      transactionId: transactionID,
      balance: senderBalance,
    }).save();

    // creating receiver's transaction

    await User.findByIdAndUpdate(receiver._id, { balance: receiverBalance }, { new: true });
    await new Transaction({ 
      ...req.body, 
      transactionId: transactionID, 
      transactionType: "credit", 
      user: receiver._id, 
      sender: sender.fullName, 
      balance: receiverBalance 
    }).save();

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
});

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const transactions = await Transaction.find({user}).select('-user');

  res.status(200).json({
    status: "success",
    results: transactions.length,
    data: {
      data: transactions,
    },
  });
});

// exports.reverseTransfer = catchAsync(async (req, res, next) => {
//   const transactionID = req.params.transactionID;
//   const transaction = await Transaction.findOne({transactionID});
//   if(!transaction) return next(new AppError("There is no transaction with such ID", 404));
//   const user = await User.findById(transaction.user);
//   await 
// })