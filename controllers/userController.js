const {createOne} = require('./handlerFactory');
const User = require('../models/userModel');

exports.createUser = createOne(User);