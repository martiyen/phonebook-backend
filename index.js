const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json()) 

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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
    response.json(phonebook)
})

app.get("/api/info", (request, response) => {
    const date = Date()
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p>${date}`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = phonebook.find(p => p.id === id)

    if (person) {
        response.json(person)
    }
    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = phonebook.length > 0
    ? Math.max(...phonebook.map(p => Number(p.id)))
    : 0

    return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const person = request.body
    const existingPerson = phonebook.find(p => p.name === person.name)

    if (!person.name || !person.number) {
        return response.status(400).json({ error: 'name and number must be defined'}).end()
    }

    if (existingPerson) {
        return response.status(400).json({ error: 'name must be unique'}).end()
    }

    person.id = generateId()

    phonebook = phonebook.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Application started on port ${PORT}`)
