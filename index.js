require('dotenv').config()
const { LolerosRacha, LolerosRecord } = require('./models/lolerosRacha')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors())

app.get('/api/record', (request, response) => {
    LolerosRecord.find({}).then(result => {
        response.send(result[0])
      })
})

app.get('/api/racha', (request, response) => {
    LolerosRacha.find({}).then(result => {
        console.log(result)
        response.send(result)
      })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
