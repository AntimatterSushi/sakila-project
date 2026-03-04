import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; 
import { styles } from '../ui/styles'; 

export default function FilmsPage() {
  const [query, setQuery] = useState('');
  const [films, setFilms] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  // NEW: State for the Customer ID input
  const [targetCustomerId, setTargetCustomerId] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setStatus('');

    try {
      const res = await api.get(`/films/search?q=${encodeURIComponent(query)}`);
      setFilms(res.data);
      if (res.data.length === 0) {
        setStatus('No films found matching that search.');
      }
    } catch (err) {
      console.error("Search Error:", err);
      setStatus('Failed to search films.');
    } finally {
      setLoading(false);
    }
  };

  const rentFilm = async (filmId) => {
    // Validation: Ensure a Customer ID is entered before renting
    if (!targetCustomerId) {
      setStatus('Error: Please enter a Customer ID first.');
      return;
    }

    try {
      const res = await api.post('/rentals/rent', {
        customer_id: targetCustomerId, // Use the ID from the input field
        film_id: filmId
      });
      
      if (res.status === 200 || res.status === 201) {
        setStatus(`Success! Film rented to Customer ${targetCustomerId}.`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Rental failed.';
      setStatus(`Error: ${errorMsg}`);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>Film Catalog</h1>
          <p style={styles.subtitle}>Find a film and enter a Customer ID to process a rental</p>
        </div>
      </header>

      <div style={{ ...styles.card, margin: '20px auto', maxWidth: '900px' }}>
        
        {/* INPUT SECTION */}
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
              type="text" 
              placeholder="Search Movie, Actor, or Genre..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 2, padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <button type="submit" style={styles.primaryButton} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* NEW: Customer ID Input Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Target Customer ID:</label>
            <input 
              type="number" 
              placeholder="e.g. 135" 
              value={targetCustomerId}
              onChange={(e) => setTargetCustomerId(e.target.value)}
              style={{ width: '120px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        {status && (
          <div style={{ 
            padding: '10px 20px', 
            margin: '10px 20px', 
            borderRadius: '4px',
            backgroundColor: status.startsWith('Error') ? '#f8d7da' : '#e7f3ff',
            color: status.startsWith('Error') ? '#721c24' : '#004085'
          }}>
            {status}
          </div>
        )}

        <ul style={styles.list}>
          {films.map((f) => (
            <li key={f.film_id} style={styles.listItem}>
              <div style={styles.itemMain}>
                <Link to={`/films/${f.film_id}`} style={styles.itemLink}>{f.title}</Link>
                <div style={styles.itemMeta}>Film ID: {f.film_id}</div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/films/${f.film_id}`} style={{ ...styles.smallButton, backgroundColor: '#6c757d' }}>
                  Details
                </Link>
                <button onClick={() => rentFilm(f.film_id)} style={styles.smallButton}>
                  Rent to Customer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}