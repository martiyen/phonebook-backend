const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://doyenmartin:${password}@cluster0.cy2ez.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', noteSchema)

if (!name || !number) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => {
            console.log(p.name, p.number)
        })
        mongoose.connection.close()
    })
}

if (password && name && number) {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}