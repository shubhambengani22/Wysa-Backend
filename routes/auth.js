const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const {
  signout,
  onboarding,
  signin,
  signup,
  getUserData,
} = require('../controller/auth')

router.post('/onboarding', onboarding)

router.post(
  '/signup',
  [
    check(
      'password',
      'The password should be atleast 8 characters in length'
    ).isLength({ min: 8 }),
  ],
  signup
)

router.get('/getUsers', getUserData)

router.get('/signout', signout)

router.post('/signin', signin)

module.exports = router
