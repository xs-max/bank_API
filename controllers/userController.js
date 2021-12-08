const {createOne, getAll} = require('./handlerFactory');
const User = require('../models/userModel');

exports.createUser = createOne(User);

exports.getAllUsers = getAll(User);