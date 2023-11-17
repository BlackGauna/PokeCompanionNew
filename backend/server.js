import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import pokemon from './routes/pokemon2.route.js'
import Location from './routes/location.route.js'

const app = express()
const PORT = process.env.PORT || 3500

// Middleware for handling CORS policy
app.use(cors())

// routes
app.use('/api/pokemon', pokemon)
app.use('/api/location', Location)

// connect to DB
// get uri
var uri = process.env.MONGO_URL
const pw = process.env.MONGO_PW
// console.log(uri)
uri = uri.replace("<password>", encodeURIComponent(pw))
// console.log(uri)

mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB database.")
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  })


