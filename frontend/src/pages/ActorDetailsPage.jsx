import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'

export default function ActorDetailsPage() {
  const { actorId } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get(`/actors/${actorId}`).then(res => setData(res.data))
  }, [actorId])

  if (!data) return <p>Loading...</p>

  return (
    <div style={{ padding: 18 }}>
      <Link to="/">Back</Link>
      <h2>{data.actor.first_name} {data.actor.last_name}</h2>
      <h3>Top 5 rented films</h3>
      <ul>
        {data.top_films.map(f => (
          <li key={f.film_id}>
            <Link to={`/films/${f.film_id}`}>{f.title}</Link> ({f.rentals})
          </li>
        ))}
      </ul>
    </div>
  )
}
