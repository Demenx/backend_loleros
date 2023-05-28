const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const lolerosRachaSchema = new mongoose.Schema({
    nombre: String,
    racha: Number,
    puuid: String,
    foto: String
})

const lolerosRecordSchema = new mongoose.Schema({
    racha: Number,
    nombre: String,
    foto: String
})

lolerosRachaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

lolerosRecordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports.LolerosRacha = mongoose.model('LolerosRacha', lolerosRachaSchema)
module.exports.LolerosRecord = mongoose.model('LolerosRecord', lolerosRecordSchema)
