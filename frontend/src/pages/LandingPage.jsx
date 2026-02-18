import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function LandingPage() {
  const navigate = useNavigate()

  const [films, setFilms] = useState([])
  const [actors, setActors] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/films/top'), api.get('/actors/top')])
      .then(([filmsRes, actorsRes]) => {
        setFilms(filmsRes.data)
        setActors(actorsRes.data)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load landing data')
      })
  }, [])

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style = {styles.headerCenter}>
          <h1 style={styles.title}>Sakila Video Store</h1>
          <p style={styles.subtitle}>
            Top rentals and quick access to customers
          </p>
        </div>

        <div style={styles.headerActions}>
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>TOP 5 RENTED FILMS</h2>
          </div>

          <ul style={styles.list}>
            {films.map(f => (
              <li key={f.film_id} style={styles.listItem}>
                <div style={styles.itemMain}>
                  <Link to={`/films/${f.film_id}`} style={styles.itemLink}>
                    {f.title}
                  </Link>
                  <div style={styles.itemMeta}>{f.rentals} rentals</div>
                </div>
                <Link to={`/films/${f.film_id}`} style={styles.smallButton}>
                  Details
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>TOP 5 ACTORS</h2>
          </div>

          <ul style={styles.list}>
            {actors.map(a => (
              <li key={a.actor_id} style={styles.listItem}>
                <div style={styles.itemMain}>
                  <Link to={`/actors/${a.actor_id}`} style={styles.itemLink}>
                    {a.first_name} {a.last_name}
                  </Link>
                  <div style={styles.itemMeta}>{a.rentals} rentals</div>
                </div>
                <Link to={`/actors/${a.actor_id}`} style={styles.smallButton}>
                  Details
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ ...styles.card, gridColumn: '1 / -1' }}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Customers</h2>
          </div>

          <div style={styles.customerRow}>
            <div>
              <div style={styles.customerHeadline}>Manage your customer records</div>
              <div style={styles.customerSub}>
                View customers, search by id, add, edit, delete, and check rental history
              </div>
            </div>

            <div style={styles.customerActions}>
              <button style={styles.primaryButton} onClick={() => navigate('/customers')}>
                Open customer list
              </button>
              <button style={styles.ghostButton} onClick={() => navigate('/films')}>
                Go to film search
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

import { styles } from '../ui/styles'