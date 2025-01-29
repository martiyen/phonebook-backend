require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
console.log('connected to MongoDB')

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

module.exports = mongoose.model('Person', noteSchema) 