/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import { styles } from '../ui/styles'
import { useNavigate } from 'react-router-dom'

export default function CustomersPage() {
  const navigate = useNavigate()
  
  const [customers, setCustomers] = useState([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const [searchId, setSearchId] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  const [addForm, setAddForm] = useState({ first_name: '', last_name: '', email: '' })

  const [editId, setEditId] = useState('')
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '' })

  const [deleteId, setDeleteId] = useState('')

  function loadCustomers() {
    setStatus('')
    setError('')
    api.get('/customers')
      .then(res => setCustomers(res.data))
      .catch(err => {
        console.error(err)
        setError('Failed to load customers')
      })
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  function doSearch() {
    setStatus('')
    setError('')
    setSearchResult(null)

    if (!searchId) return

    api.get(`/customers/search?q=${encodeURIComponent(searchId)}`)
      .then(res => {
        setSearchResult(res.data)
      })
      .catch(() => setError('Search failed'))
  }


  function doAdd() {
    setStatus('')
    setError('')
    api.post('/customeradd', addForm)
      .then(() => {
        setStatus('Customer added')
        setAddForm({ first_name: '', last_name: '', email: '' })
        loadCustomers()
      })
      .catch(err => {
        console.error(err)
        setError('Failed to add customer')
      })
  }

  function doEdit() {
    setStatus('')
    setError('')
    if (!editId) return

    const payload = {}
    if (editForm.first_name) payload.first_name = editForm.first_name
    if (editForm.last_name) payload.last_name = editForm.last_name
    if (editForm.email) payload.email = editForm.email

    api.put(`/customeredit/${editId}`, payload)
      .then(() => {
        setStatus('Customer updated')
        setEditForm({ first_name: '', last_name: '', email: '' })
        loadCustomers()
      })
      .catch(err => {
        console.error(err)
        setError('Failed to edit customer')
      })
  }

  function doDelete() {
    setStatus('')
    setError('')
    if (!deleteId) return

    api.delete(`/customerdelete/${deleteId}`)
      .then(() => {
        setStatus('Customer deleted')
        setDeleteId('')
        loadCustomers()
      })
      .catch(err => {
        console.error(err)
        setError('Failed to delete customer. They may have rentals.')
      })
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>Sakila Video Store</h1>
          <p style={styles.subtitle}>Customer records</p>

          <div style={{ marginTop: 12 }}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate('/')}
            >
              Back to home
            </button>
          </div>
        </div>
      </header>


      <div style={styles.grid}>
        {(error || status) && (
          <div style={error ? styles.error : styles.card}>
            {error || status}
          </div>
        )}

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>CUSTOMER LIST</h2>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                placeholder="search"
                style={{ ...styles.input, width: 140 }}
              />
              <button style={styles.primaryButton} onClick={doSearch}>Search</button>
              <button style={styles.primaryButton} onClick={loadCustomers}>Refresh</button>
            </div>
          </div>

          {/* if search found someone, show them at the top */}
          {Array.isArray(searchResult) && searchResult.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {searchResult.map(c => (
                <div key={c.customer_id} style={{ ...styles.listItem, marginBottom: 8 }}>
                  <div style={styles.itemMain}>
                    <div style={{ fontFamily: 'Impact', letterSpacing: '0.06em' }}>
                      {c.first_name} {c.last_name}
                    </div>
                    <div style={styles.itemMeta}>id {c.customer_id} · {c.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}


          {/* scrollable list */}
          <div style={styles.scrollBox}>
            <ul style={styles.list}>
              {customers.map(c => (
                <li key={c.customer_id} style={styles.listItem}>
                  <div style={styles.itemMain}>
                    <div style={{ fontFamily: 'Impact', letterSpacing: '0.06em' }}>
                      {c.first_name} {c.last_name}
                    </div>
                    <div style={styles.itemMeta}>id {c.customer_id} · {c.email}</div>
                  </div>
                  <Link to={`/customers/${c.customer_id}`} style={styles.smallButton}>
                    View
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>ADD CUSTOMER</h2>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <input
              value={addForm.first_name}
              onChange={e => setAddForm({ ...addForm, first_name: e.target.value })}
              placeholder="first name"
              style={inputStyle}
            />
            <input
              value={addForm.last_name}
              onChange={e => setAddForm({ ...addForm, last_name: e.target.value })}
              placeholder="last name"
              style={inputStyle}
            />
            <input
              value={addForm.email}
              onChange={e => setAddForm({ ...addForm, email: e.target.value })}
              placeholder="email"
              style={inputStyle}
            />
            <button style={styles.primaryButton} onClick={doAdd}>Add</button>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>EDIT CUSTOMER</h2>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <input
              value={editId}
              onChange={e => setEditId(e.target.value)}
              placeholder="customer id"
              style={inputStyle}
            />
            <input
              value={editForm.first_name}
              onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
              placeholder="new first name optional"
              style={inputStyle}
            />
            <input
              value={editForm.last_name}
              onChange={e => setEditForm({ ...editForm, last_name: e.target.value })}
              placeholder="new last name optional"
              style={inputStyle}
            />
            <input
              value={editForm.email}
              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              placeholder="new email optional"
              style={inputStyle}
            />
            <button style={styles.primaryButton} onClick={doEdit}>Update</button>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>DELETE CUSTOMER</h2>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              value={deleteId}
              onChange={e => setDeleteId(e.target.value)}
              placeholder="customer id"
              style={{ ...inputStyle, flex: 1, minWidth: 160 }}
            />
            <button
              onClick={doDelete}
              style={{ ...styles.primaryButton, background: '#ef4444' }}
            >
              Delete
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: 10,
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(0,0,0,0.25)',
  color: '#e9ecf1'
}
