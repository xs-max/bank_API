const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    transactionType: {
        type: String,
        required: [true, "A transaction should have a transaction type"],
        enum: ['withdrawal', 'deposit', 'transfer']
    },
    amount: {
        type: Number,
        required: [true, 'A transaction should have an amount'],
        min: [100, 'Amount must be more than 100']
    },
    receiver: {
        type: String,
        minlength: [3, 'A receiver name must be more than three(3) characters']
    },

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

