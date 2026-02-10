import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

export default function FilmDetailsPage() {
  const { filmId } = useParams()
  const [film, setFilm] = useState(null)

  useEffect(() => {
    api.get(`/films/${filmId}`).then(res => setFilm(res.data))
  }, [filmId])

  if (!film) return <p>Loading...</p>

  return (
    <div>
      <Link to="/">Back</Link>
      <h2>{film.title}</h2>
      <p>{film.description}</p>
      <p>Release year: {film.release_year}</p>
      <p>Rating: {film.rating}</p>
      <p>Length: {film.length} minutes</p>
      <p>Rental rate: {film.rental_rate}</p>
    </div>
  )
}
