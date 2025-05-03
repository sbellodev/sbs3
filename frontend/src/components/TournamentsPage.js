import React, { useState, useEffect } from 'react';
import '../App.css';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({ 
    name: '', 
    date: '', 
    location: '1',
    organizer: '1'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const locations = [
    { id: '1', name: 'Madrid Gaming Center' }
  ];

  useEffect(() => { 
    fetchTournaments(); 
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tournaments`);
      if (!response.ok) {
        throw new Error(`Failed to load tournaments: HTTP ${response.status}`);
      }
      const { data } = await response.json();
      setTournaments(data || []);
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTournament(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTournament)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create tournament');
      }

      setSuccess('Tournament created successfully!');
      setNewTournament({ name: '', date: '', location: '1', organizer: '1'});
      await fetchTournaments();
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tournaments?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete tournament');
      }

      setSuccess('Tournament deleted successfully!');
      setTournaments(tournaments.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    }
  };

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <div className="general-page">
      <h1>Manage Tournaments</h1>
      
      {/* Success/Error Messages */}
      {error && (
        <div className="alert error">
          <span className="close-btn" onClick={() => setError(null)}>&times;</span>
          {error}
        </div>
      )}
      {success && (
        <div className="alert success">
          <span className="close-btn" onClick={() => setSuccess(null)}>&times;</span>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="tournament-form">
        <input
          type="text"
          name="name"
          placeholder="Tournament name"
          value={newTournament.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={newTournament.date}
          onChange={handleChange}
          required
        />
        <select
          name="location"
          value={newTournament.location}
          onChange={handleChange}
          required
        >
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Tournament</button>
      </form>

      <div className="general-grid">
        {tournaments.map(({ id, name, date, location }) => (
          <div key={id} className="tournament-card">
            <h3>{name}</h3>
            <p>Date: {new Date(date).toLocaleDateString()}</p>
            <p>Location: {locations.find(l => l.id === location)?.name || location}</p>
            <button onClick={() => handleDelete(id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentsPage;