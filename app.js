const express = require('express');
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.all("*", (req, res, next) => {
  res.status(404).json({
      message: "route not found"
  });
});

module.exports = app;