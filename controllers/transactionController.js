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

  if(!transactions) return next(new AppError("No transaction found for this account", 404));

  res.status(200).json({
    status: "success",
    results: transactions.length,
    data: {
      data: transactions,
    },
  });
});

exports.reverseTransfer = catchAsync(async (req, res, next) => {
  const transactionId = req.params.transactionID;
  const transaction = await Transaction.findOne({transactionId});

  // checking if the transaction exists
  if(!transaction) return next(new AppError("There is no transaction with such ID", 404));

  // checking if the transaction was previously reversed
  if(transaction.status == 'canceled') return next(new AppError("This transaction is already reversed", 404));

  // checking if the type of transaction was a transfer
  if(transaction.transactionType != 'transfer') return next(new AppError("This transaction was not a transfer", 404));

  const user = transaction.user;
  const amount = transaction.amount;
  const receiverAcc = transaction.receiver;

  // Giving the sender back their money
  const sender = await User.findById(user);
  await User.findByIdAndUpdate(user, {balance: sender.balance + amount}, { new: true });

  // taking the money from the receiver
  const receiver = await User.findOne({accountNumber: receiverAcc});
  await User.findByIdAndUpdate(receiver._id, {balance: receiver.balance - amount}, { new: true });

  // cancelling the transaction
  await Transaction.updateMany({transactionId}, {status: 'canceled'}, { new: true });

  res.status(200).json({
    status: "success",
    data: {
      message: 'Transaction reversed successfully',
    },
  });

})