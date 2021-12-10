const mongoose = require("mongoose");
const { createTransactionID } = require("../utils/helper");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    transactionType: {
        type: String,
        required: [true, "A transaction should have a transaction type"],
        enum: ['withdrawal', 'deposit', 'transfer', 'credit']
    },
    amount: {
        type: Number,
        required: [true, 'A transaction should have an amount']
    },
    receiver: String,
    balance: Number,
    description: String,
    createdAt: String

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

transactionSchema.pre("save", function (next) {
    const timestamp = Date.now();
    this.createdAt = new Date(timestamp).toLocaleString();
    this.transactionId = createTransactionID();
    next();
});

module.exports = mongoose.model("Transaction", transactionSchema);