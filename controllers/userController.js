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
exports.createUser = createOne(User);

exports.getAllUsers = getAll(User);


exports.getUser = getOne(User, {path: 'transactions'});


// Do not update password with this
exports.updateUser = updateOne(User);

exports.deleteUser = deleteOne(User);