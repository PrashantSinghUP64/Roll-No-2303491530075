const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// sample data
let items = [
  { id: 1, name: 'Item One', description: 'First item' },
  { id: 2, name: 'Item Two', description: 'Second item' },
]
let nextId = 3

app.get('/', (req, res) => {
  res.json({ message: 'server is running', status: 'ok' })
})

// get all items
app.get('/api/items', (req, res) => {
  res.json(items)
})

// get single item
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id))
  if (!item) {
    return res.status(404).json({ message: 'item not found' })
  }
  res.json(item)
})

// create new item
app.post('/api/items', (req, res) => {
  const { name, description } = req.body
  if (!name) {
    return res.status(400).json({ message: 'name is required' })
  }
  const newItem = { id: nextId++, name, description: description || '' }
  items.push(newItem)
  res.status(201).json(newItem)
})

// update item
app.put('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ message: 'item not found' })
  }
  const { name, description } = req.body
  if (name) items[index].name = name
  if (description) items[index].description = description
  res.json(items[index])
})

// delete item
app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id))
  if (index === -1) {
    return res.status(404).json({ message: 'item not found' })
  }
  const deleted = items.splice(index, 1)
  res.json({ message: 'deleted', item: deleted[0] })
})

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'route not found' })
})

// error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'something went wrong' })
})

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})
