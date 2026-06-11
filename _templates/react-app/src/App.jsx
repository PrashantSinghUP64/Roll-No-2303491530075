import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/items`)
      setItems(res.data)
    } catch (err) {
      setError('could not load items')
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editId) {
        await axios.put(`${API_URL}/items/${editId}`, { name, description })
        setEditId(null)
      } else {
        await axios.post(`${API_URL}/items`, { name, description })
      }
      setName('')
      setDescription('')
      loadItems()
    } catch (err) {
      setError(err.response?.data?.message || 'something went wrong')
    }
  }

  const handleEdit = (item) => {
    setEditId(item.id)
    setName(item.name)
    setDescription(item.description)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('delete this item?')) return
    try {
      await axios.delete(`${API_URL}/items/${id}`)
      loadItems()
    } catch (err) {
      setError('could not delete')
    }
  }

  const handleCancel = () => {
    setEditId(null)
    setName('')
    setDescription('')
  }

  return (
    <div className="app">
      <h1>Items Manager</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">{editId ? 'update' : 'add'}</button>
        {editId && (
          <button type="button" onClick={handleCancel}>cancel</button>
        )}
      </form>

      {loading && <p>loading...</p>}

      <ul className="list">
        {items.map(item => (
          <li key={item.id} className="list-item">
            <div>
              <strong>{item.name}</strong>
              <span>{item.description}</span>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(item)}>edit</button>
              <button onClick={() => handleDelete(item.id)} className="danger">delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
