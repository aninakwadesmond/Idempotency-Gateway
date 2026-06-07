const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const config = require('config');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 2 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

//hash password before save
userSchema.pre('save', async function (next) {
  console.log('before save');
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare password;
userSchema.methods.comparePassword = async function (password) {
  const isSamePassword = await bcrypt.compare(password, this.password);
  return isSamePassword;
};

// token generation
userSchema.methods.genAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    config.get('JWT_SECRET_KEY'),
    { expiresIn: '2d' },
  );

  return token;
};

const User = mongoose.model('User', userSchema);

// validate user request body

const complexityOptions = {
  min: 4,
  max: 40,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 1,
};

function validateUser(req) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: PasswordComplexity(complexityOptions).required(),
  });

  return schema.validate(req, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });
}

function validateUserLogin(req) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: PasswordComplexity(complexityOptions).required(),
  });

  return schema.validate(req, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });
}

module.exports = { User, validateUser, validateUserLogin };
