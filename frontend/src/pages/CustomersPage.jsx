/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import api from '../services/api'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [status, setStatus] = useState('')

  const [searchId, setSearchId] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  const [addForm, setAddForm] = useState({ first_name: '', last_name: '', email: '' })

  const [editId, setEditId] = useState('')
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '' })

  const [deleteId, setDeleteId] = useState('')

  function loadCustomers() {
    setStatus('')
    api.get('/customers')
      .then(res => setCustomers(res.data))
      .catch(err => {
        console.error(err)
        setStatus('Failed to load customers')
      })
  }

  useEffect(() => {
    setStatus('')
    api.get('/customers')
      .then(res => setCustomers(res.data))
      .catch(err => {
        console.error(err)
        setStatus('Failed to load customers')
      })
  }, [])


  function doSearch() {
    setStatus('')
    setSearchResult(null)
    if (!searchId) return
    api.get(`/customersearch/${searchId}`)
      .then(res => setSearchResult(res.data))
      .catch(() => setStatus('Customer not found'))
  }

  function doAdd() {
    setStatus('')
    api.post('/customeradd', addForm)
      .then(() => {
        setStatus('Customer added')
        setAddForm({ first_name: '', last_name: '', email: '' })
        loadCustomers()
      })
      .catch(err => {
        console.error(err)
        setStatus('Failed to add customer')
      })
  }

  function doEdit() {
    setStatus('')
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
        setStatus('Failed to edit customer')
      })
  }

  function doDelete() {
    setStatus('')
    if (!deleteId) return
    api.delete(`/customerdelete/${deleteId}`)
      .then(() => {
        setStatus('Customer deleted')
        setDeleteId('')
        loadCustomers()
      })
      .catch(err => {
        console.error(err)
        setStatus('Failed to delete customer. They may have rentals.')
      })
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.h2}>Customers</h2>
      {status && <p style={styles.status}>{status}</p>}

      <div style={styles.grid}>
        <section style={styles.card}>
          <h3 style={styles.h3}>Customer list</h3>
          <button style={styles.button} onClick={loadCustomers}>Refresh</button>

          <div style={styles.list}>
            {customers.map(c => (
              <div key={c.customer_id} style={styles.row}>
                <div style={styles.rowMain}>
                  <div style={styles.rowTitle}>
                    {c.first_name} {c.last_name}
                  </div>
                  <div style={styles.rowMeta}>
                    id {c.customer_id} · {c.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <h3 style={styles.h3}>Search by customer id</h3>
          <div style={styles.formRow}>
            <input
              style={styles.input}
              placeholder="customer id"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
            />
            <button style={styles.button} onClick={doSearch}>Search</button>
          </div>

          {searchResult && (
            <div style={styles.result}>
              <div><b>{searchResult.first_name} {searchResult.last_name}</b></div>
              <div>id {searchResult.customer_id}</div>
              <div>{searchResult.email}</div>
            </div>
          )}
        </section>

        <section style={styles.card}>
          <h3 style={styles.h3}>Add customer</h3>
          <div style={styles.formCol}>
            <input
              style={styles.input}
              placeholder="first name"
              value={addForm.first_name}
              onChange={e => setAddForm({ ...addForm, first_name: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="last name"
              value={addForm.last_name}
              onChange={e => setAddForm({ ...addForm, last_name: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="email"
              value={addForm.email}
              onChange={e => setAddForm({ ...addForm, email: e.target.value })}
            />
            <button style={styles.button} onClick={doAdd}>Add</button>
          </div>
        </section>

        <section style={styles.card}>
          <h3 style={styles.h3}>Edit customer</h3>
          <div style={styles.formCol}>
            <input
              style={styles.input}
              placeholder="customer id"
              value={editId}
              onChange={e => setEditId(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="new first name optional"
              value={editForm.first_name}
              onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="new last name optional"
              value={editForm.last_name}
              onChange={e => setEditForm({ ...editForm, last_name: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="new email optional"
              value={editForm.email}
              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
            />
            <button style={styles.button} onClick={doEdit}>Update</button>
          </div>
        </section>

        <section style={styles.card}>
          <h3 style={styles.h3}>Delete customer</h3>
          <div style={styles.formRow}>
            <input
              style={styles.input}
              placeholder="customer id"
              value={deleteId}
              onChange={e => setDeleteId(e.target.value)}
            />
            <button style={styles.dangerButton} onClick={doDelete}>Delete</button>
          </div>
          <div style={styles.help}>
            If deletion fails, they probably have rentals. you can demo deactivate later.
          </div>
        </section>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 18, maxWidth: 1100, margin: '0 auto' },
  h2: { margin: '8px 0 14px 0' },
  h3: { margin: '0 0 12px 0' },
  status: { padding: 10, background: '#f3f4f6', borderRadius: 10 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 },
  card: { border: '1px solid #e5e7eb', borderRadius: 14, padding: 14, background: 'white' },
  list: { display: 'grid', gap: 10, marginTop: 12 },
  row: { border: '1px solid #eef2f7', borderRadius: 12, padding: 12 },
  rowMain: { display: 'flex', flexDirection: 'column', gap: 4 },
  rowTitle: { fontWeight: 700 },
  rowMeta: { fontSize: 12, color: '#6b7280' },
  formRow: { display: 'flex', gap: 10, alignItems: 'center' },
  formCol: { display: 'grid', gap: 10 },
  input: { padding: 10, borderRadius: 10, border: '1px solid #e5e7eb', width: '100%' },
  button: { padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#111827', color: 'white', cursor: 'pointer' },
  dangerButton: { padding: '10px 12px', borderRadius: 10, border: '1px solid #ef4444', background: '#ef4444', color: 'white', cursor: 'pointer' },
  result: { marginTop: 10, padding: 12, borderRadius: 12, border: '1px solid #e5e7eb' },
  help: { marginTop: 8, fontSize: 12, color: '#6b7280' }
}
