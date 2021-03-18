const mongoose = require('mongoose')
const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//Get routes
const authRoutes = require('./routes/auth')

//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB CONNECTED')
  })

app.get('/test', (req, res) => {
  res.send("App is working")
})

//Middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

//Routes
app.use('/api', authRoutes)

//Since the frontend used is angular, if react, use something other than 3000
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})
