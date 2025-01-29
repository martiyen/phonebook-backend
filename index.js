require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json()) 

let phonebook = []

app.use(express.static("dist"))

app.use((req, res, next) => {
    if (req.body) {
        req.originalBody = { ...req.body }
    }
    next()
})

morgan.token('data', (req) => {
    return  JSON.stringify(req.originalBody)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {
    skip: (req, res) => { return req.method !== 'POST'}
}))

app.use(morgan('tiny', {
    skip: (req, res) => { return req.method === 'POST'}
}))

app.get("/api/persons", (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get("/api/info", (request, response) => {
    const date = Date()
    Person.find({}).then(result => {
        response.send(`<p>Phonebook has info for ${result.length} people</p>${date}`)
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(result => {
        result ? response.json(result) : response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
    request.params.id !== "undefined"? 
    Person.deleteOne({ _id: request.params.id }).then(result => response.status(204).end()):
    response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name and number must be defined'}).end()
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })
    
    newPerson.save().then(result => {
        response.json(result)
    })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Application started on port ${PORT}`)
