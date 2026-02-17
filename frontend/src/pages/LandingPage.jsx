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

const styles = {
  headerCenter: {
    textAlign: 'center',
    flex:1
  },
  page: {
    minHeight: '100vh',
    background: '#110c977a',
    color: '#ee8f13',
    padding: '28px 18px'
  },
  header: {
    maxWidth: 1100,
    margin: '0 auto 18px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  title: { margin: 0, fontSize: 32, letterSpacing: 0.2, fontFamily: "Impact"},
  subtitle: { margin: '6px 0 0 0', opacity: 0.8 },
  headerActions: { display: 'flex', alignItems: 'center', gap: 12 },
  grid: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 14
  },
  card: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10
  },
  cardTitle: { margin: 1, fontSize: 30, fontFamily: "Impact", letterSpacing: '0.08em'},
  badge: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999,
    background: 'rgba(99, 102, 241, 0.25)',
    border: '1px solid rgba(99, 102, 241, 0.35)'
  },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.06)'
  },
  itemMain: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
  itemLink: {
    color: '#e9ecf1',
    textDecoration: 'none',
    fontWeight: 650,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  itemMeta: { fontSize: 12, opacity: 0.8 },
  smallButton: {
    fontSize: 12,
    padding: '8px 10px',
    borderRadius: 10,
    textDecoration: 'none',
    color: '#e9ecf1',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)'
  },
  primaryButton: {
    border: 'none',
    borderRadius: 12,
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
    background: '#6366f1',
    color: 'white'
  },
  ghostButton: {
    borderRadius: 12,
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
    background: 'transparent',
    color: '#e9ecf1',
    border: '1px solid rgba(255,255,255,0.18)'
  },
  error: {
    maxWidth: 1100,
    margin: '0 auto 14px auto',
    padding: 12,
    borderRadius: 12,
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.25)'
  },
  customerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    flexWrap: 'wrap'
  },
  customerHeadline: { fontWeight: 750, marginBottom: 6, fontFamily: "Impact", letterSpacing: '0.08em'},
  customerSub: { opacity: 0.85, fontSize: 13, lineHeight: 1.4, maxWidth: 700, letterSpacing: '0.08em' },
  customerActions: { display: 'flex', gap: 10, flexWrap: 'wrap' }
}
