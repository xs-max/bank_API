const {createOne, getAll, getOne, updateOne, deleteOne} = require('./handlerFactory');
const User = require('../models/userModel');

exports.createUser = createOne(User);

exports.getAllUsers = getAll(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getUser = getOne(User, {path: 'transactions'});


// Do not update password with this
exports.updateUser = updateOne(User);

exports.deleteUser = deleteOne(User);