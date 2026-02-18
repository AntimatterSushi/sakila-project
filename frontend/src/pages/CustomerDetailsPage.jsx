/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { styles } from '../ui/styles'

export default function CustomerDetailsPage() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  function load() {
    setError('')
    setStatus('')
    api.get(`/customers/${customerId}`)
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err)
        setError('Failed to load customer')
      })
  }

  useEffect(() => {
    load()
  }, [customerId])

  function returnRental(rentalId) {
    setError('')
    setStatus('')
    api.post(`/rentals/return/${rentalId}`)
      .then(() => {
        setStatus('Rental returned')
        load()
      })
      .catch(() => setError('Failed to return rental'))
  }

  const customer = data?.customer
  const rentals = data?.rentals || []

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>Sakila Video Store</h1>
          <p style={styles.subtitle}>Customer details and rental history</p>
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
            <h2 style={styles.cardTitle}>
              {customer ? `${customer.first_name} ${customer.last_name}` : 'Loading...'}
            </h2>
          </div>

          {customer && (
            <div style={{ lineHeight: 1.6 }}>
              <div>Email: {customer.email}</div>
              <div>Active: {customer.active}</div>
              <div>Created: {String(customer.create_date)}</div>
            </div>
          )}

          <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={styles.primaryButton} onClick={() => navigate(-1)}>Back</button>
            <Link style={styles.smallButton} to="/customers">Customers</Link>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>RENTAL HISTORY</h2>
          </div>

          <ul style={styles.list}>
            {rentals.map(r => (
              <li key={r.rental_id} style={styles.listItem}>
                <div style={styles.itemMain}>
                  <div style={{ fontFamily: 'Impact', letterSpacing: '0.06em' }}>
                    {r.title}
                  </div>
                  <div style={styles.itemMeta}>
                    rental id {r.rental_id} · rented {String(r.rental_date)}
                    {r.return_date ? ` · returned ${String(r.return_date)}` : ' · not returned'}
                  </div>
                </div>

                {!r.return_date ? (
                  <button style={styles.primaryButton} onClick={() => returnRental(r.rental_id)}>
                    Return
                  </button>
                ) : (
                  <span style={styles.itemMeta}>Returned</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
