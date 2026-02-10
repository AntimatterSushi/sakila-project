import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function LandingPage() {
  const [films, setFilms] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/films/top')
      .then(res => setFilms(res.data))
      .catch(err => {
        console.error(err)
        setError('Failed to load top films')
      })
  }, [])

  return (
    <div>
      <h2>Top 5 Rented Films</h2>

      {error && <p>{error}</p>}

      <ul>
        {films.map(f => (
          <li key={f.film_id}>
            <Link to={`/films/${f.film_id}`}>
              {f.title}
            </Link>
            {' '}({f.rentals} rentals)
          </li>
        ))}
      </ul>
    </div>
  )
}
