import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import FilmDetailsPage from './pages/FilmDetailsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/films/:filmId" element={<FilmDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
