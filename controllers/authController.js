const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
      base: req.user,
    },
  });
};


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1 check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2 check if user exists and password is correct
  const user = await User.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3 Send token
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it exists
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in, please log in to get access", 401)
    );
  }
  // 2)Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3) check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("The user does no longer exists", 401));
  }

  // 4) check if user change password after token issue
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password please log in again", 401)
    );
  }

  // Grant Access to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles [admin, user].
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get User from collection
  const user = await User.findById(req.user.id).select("+password");

  //2) check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }

  //3) Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await (await user).save();

  //4) Log user in
  createSendToken(user, 200, req, res);
});