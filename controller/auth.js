const User = require('../models/user')
const { check, validationResult } = require('express-validator')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
var MongoClient = require('mongodb').MongoClient
require('dotenv').config()

var url = process.env.DATABASE

exports.onboarding = (req, res) => {
  const user = new User(req.body)
  user.save((err, user) => {
    if (err) {
      return res.json({
        status: 400,
        err: err,
        message: 'Not able to save user in the DB',
      })
    }
    //Token for storing data in the cookies
    const token = jwt.sign(
      { _id: user.id, nickname: user.nickname },
      process.env.SECRET
    )
    //Put the token in the cookie
    res.cookie('token', token, { expire: new Date() + 9999 })
    res.json(user)
  })
}

exports.getUserData = (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    var dbo = db.db('')
    dbo
      .collection('users')
      .find({})
      .toArray(function (err, result) {
        if (err) throw err
        res.send(result)
        db.close()
      })
  })
}

exports.signup = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.json({
      status: 422,
      error: errors.array()[0].msg,
    })
  } else {
    return res.json({
      status: 200,
      message: 'Valid details',
      data: req.body,
    })
  }
}

exports.signin = (req, res) => {
  decoded = jwt.verify(req.cookies['token'], process.env.SECRET)
  res.json({ cookie: req.cookies, values: decoded })
}

exports.signout = (req, res) => {
  res.json({
    message: 'User signout',
  })
}
