const router = require('express').Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation')


router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send({ status: "ERROR", msg: error.details[0].message })
  
  const { name, email, password } = req.body

  const emailExist = await User.findOne({ email: email })
  if (emailExist) return res.status(400).send({ status: "ERROR", msg: "Email already exists" })

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword
  })
  try {
    const savedUser = await user.save()
    res.status(201).send({
      status: "OK",
      msg: "User has added!",
      data: { uid: savedUser._id }
    })
  } catch (err) {
    res.status(400).send({
      status: "ERROR",
      msg: err
    })
  }
})

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send({ status: "ERROR", msg: error.details[0].message })

  const { email, password } = req.body

  const user = await User.findOne({ email: email })
  if (!user) return res.status(400).send({ status: "ERROR", msg: "Email doesn't exists" })
  
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) return res.status(400).send({ status: "ERROR", msg: "Invalid password" })

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  res.header('auth-token', token)
    .status(200)
    .send({
      status: "OK",
      msg: "Login has success",
      data: { "auth-token": token }
    })
})

module.exports = router