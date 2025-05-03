import React, { useState, useEffect } from 'react';
import '../App.css';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({ 
    name: '', 
    date: '', 
    location: '1' // Default to Madrid Gaming Center
  });

  useEffect(() => { fetchTournaments(); }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tournaments`);
      const { data } = await response.json();
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTournament(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTournament)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      setNewTournament({ name: '', date: '', location: '1' });
      await fetchTournaments();
    } catch (error) {
      console.error('Error adding tournament:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tournaments?id=${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Delete failed');
      setTournaments(tournaments.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  // Mock location data
  const locations = [
    { id: '1', name: 'Madrid Gaming Center' }
  ];

  return (
    <div className="general-page">
      <h1>Manage CRUD Tournaments</h1>
      
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