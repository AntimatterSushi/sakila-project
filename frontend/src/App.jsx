import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import FilmDetailsPage from './pages/FilmDetailsPage'
import CustomersPage from './pages/CustomersPage'
import FilmsPage from './pages/FilmsPage'
import ActorDetailsPage from './pages/ActorDetailsPage'
import CustomerDetailsPage from './pages/CustomerDetailsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/films/:filmId" element={<FilmDetailsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/actors/:actorId" element={<ActorDetailsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:customerId" element={<CustomerDetailsPage />} />
        <Route path="/films/:filmId" element={<FilmDetailsPage />} />
        <Route path="/actors/:actorId" element={<ActorDetailsPage />} />
        <Route path="/customers/:customerId" element={<CustomerDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
