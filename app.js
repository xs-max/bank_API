const express = require('express');
const morgan = require("morgan");

const globalErrorHandler = require('./controllers/errorHandler');
const userRouter = require('./routes/userRoute');
const transactionRouter = require('./routes/transactionRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);

// Handling unavailable routes
app.all("*", (req, res, next) => {
  res.status(404).json({
      message: "route not found"
  });
});

app.use(globalErrorHandler);

module.exports = app;