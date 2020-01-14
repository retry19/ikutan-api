const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const authRoute = require('./routes/auth')
const eventRoute = require('./routes/event') 

dotenv.config()

//  connect to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to db!'))

// middleware
app.use(express.json())

// Route middleware
app.use('/api/user', authRoute)
app.use('/api/events', eventRoute)

app.listen(process.env.PORT, () => console.log('Magic happen on port 3000...')) 
 