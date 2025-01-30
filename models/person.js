require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
console.log('connected to MongoDB')

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        const re = /^0\d{3}\/\d{6}$/
        return re.test(v)
      },
      message: props => `${props.value} is a not a valid phone number`

    },
    minLength: [8, '{VALUE} is shorter than 8 characters'],
    required: true
  }
})

noteSchema.set('toJSON', {
  transform: (doc, res) => {
    res.id = res._id.toString()
    delete res._id
    delete res.__v
  }
})

module.exports = mongoose.model('Person', noteSchema)