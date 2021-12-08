const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');
const { createAccountNumber } = require('../utils/helper');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "A user must have a name"],
        minlength: [5, "Full name must be more than five(5) characters"]
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        validate: [validator.isEmail, 'Enter a valid email format'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be more than five (5) characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // Only works on save and create
            validator: function(el) {
                return this.password === el;
            },
            message: 'Passwords don\'t match'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    accountNumber: {
        type: String,
    },
    phone: {
        type: String,
        required : [true, 'A user must have phone number'],
        maxlength: [14, 'Enter a valid phone number'],
        minlength: [7, 'Enter a valid number'],
        validate: {
            validator: function (el) {
                const values = ['+', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
                const elements = el.split('');
                elements.forEach(element => {
                    if (!values.includes(element)) return false;
                });
            },
            message: 'Enter a valid phone number'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
)

userSchema.pre(/^save/, async function(next) {
  // Only run this function if password was modified
  if (!this.isModified("password")) return next();
  //Hash password
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordConfirm
  this.passwordConfirm = undefined;
  // set account number
  this.accountNumber = createAccountNumber();
  next();
})

module.exports = mongoose.model("user", userSchema);