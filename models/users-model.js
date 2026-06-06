const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    process.env.JWT_SECRET_KEY,
    { expiresIn: '2d' },
  );

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
