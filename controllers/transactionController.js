const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");
const Transaction = require("../models/transactionModel");

exports.createTransaction = createOne(Transaction);
