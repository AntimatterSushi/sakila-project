import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { styles } from '../ui/styles'

export default function ActorDetailsPage() {
  const { actorId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/actors/${actorId}`)
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err)
        setError('Failed to load actor')
      })
  }, [actorId])

  const actor = data?.actor
  const films = data?.top_films || []

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>Sakila Video Store</h1>
          <p style={styles.subtitle}>Actor details and top films</p>
        </div>
      </header>

      <div style={styles.grid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              {actor ? `${actor.first_name} ${actor.last_name}` : 'Loading...'}
            </h2>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <h3 style={{ margin: '10px 0', fontFamily: 'Impact', letterSpacing: '0.08em' }}>
            TOP 5 RENTED FILMS
          </h3>

          <ul style={styles.list}>
            {films.map(f => (
              <li key={f.film_id} style={styles.listItem}>
                <div style={styles.itemMain}>
                  <Link to={`/films/${f.film_id}`} style={styles.itemLink}>
                    {f.title}
                  </Link>
                  <div style={styles.itemMeta}>{f.rentals} rentals</div>
                </div>
                <Link to={`/films/${f.film_id}`} style={styles.smallButton}>Details</Link>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={styles.primaryButton} onClick={() => navigate(-1)}>Back</button>
            <Link style={styles.smallButton} to="/">Home</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
