import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { styles } from '../ui/styles'

export default function FilmDetailsPage() {
  const { filmId } = useParams()
  const navigate = useNavigate()
  const [film, setFilm] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/films/${filmId}`)
      .then(res => setFilm(res.data))
      .catch(err => {
        console.error(err)
        setError('Failed to load film')
      })
  }, [filmId])

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>Sakila Video Store</h1>
          <p style={styles.subtitle}>Film details</p>
        </div>
      </header>

      <div style={styles.grid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>{film ? film.title : 'Loading...'}</h2>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {film && (
            <div style={{ lineHeight: 1.6 }}>
              <div style={{ opacity: 0.9, marginBottom: 10 }}>{film.description}</div>
              <div>Release year: {film.release_year}</div>
              <div>Rating: {film.rating}</div>
              <div>Length: {film.length} minutes</div>
              <div>Rental rate: {film.rental_rate}</div>
            </div>
          )}

          <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={styles.primaryButton} onClick={() => navigate(-1)}>Back</button>
            <Link style={styles.smallButton} to="/">Home</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
