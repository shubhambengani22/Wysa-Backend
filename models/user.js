const mongoose = require('mongoose')
const crypto = require('crypto')
const { Schema } = mongoose
const { v4: uuidv4 } = require('uuid')
var salt = ''

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true,
  },
  secure_password: {
    type: String,
    required: true,
  },
  problem_since: {
    type: String,
    required: true,
    trim: true,
  },
  bedtime: {
    type: String,
    required: true,
  },
  wakeup_time: {
    type: String,
    required: true,
  },
  sleep_duration: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  efficiency: {
    type: Number,
    required: true,
    default: 1.0,
  },
})

//Creating virtuals to set salt and encrypting password
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    salt = uuidv4()
    this.secure_password = this.createsecurePassword(password)
  })
  .get(function () {
    return this._password
  })

//Schema method to encrypt the password using a salt
userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.createsecurePassword(plainPassword) === this.secure_password
  },
  createsecurePassword: function (plainPassword) {
    if (!plainPassword) return ''
    try {
      return crypto
        .createHmac('sha256', salt)
        .update(plainPassword)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
}

module.exports = mongoose.model('User', userSchema)
