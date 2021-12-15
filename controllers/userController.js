const {createOne, getAll, getOne, updateOne, deleteOne} = require('./handlerFactory');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.disableUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) return next(new AppError("User does not exist", 404));
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { disable: true },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
          message: `${updatedUser.fullName}'s account disabled successfully`
      }
    });
});

exports.activateUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User does not exist", 404));
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { disable: false }, 
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        message: `${updatedUser.fullName}'s account activated successfully`,
      },
    });
})

exports.createUser = catchAsync(async (req, res, next) => {

    const user = User.findOne({email: req.body.email});
    if(user) return next(new AppError("This user already exist", 403));

    const doc = await new User(req.body).save();

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createAdmin = catchAsync(async (req, res, next) => {
  const admin = User.findOne({ email: "admin@gmail.com" });
  if(admin) return next(new AppError("Admin exists already", 403));
  const doc = await new User({
    fullName: "admin",
    email: "admin@gmail.com",
    role: "admin",
    typeOfAccount: "current",
    phone: "1234567890",
    password: "pass1234",
    passwordConfirm: "pass1234"
  }).save();

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.getAllUsers = getAll(User);


exports.getUser = getOne(User, {path: 'transactions'});


// Do not update password with this
exports.updateUser = updateOne(User);

exports.deleteUser = deleteOne(User);