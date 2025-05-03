import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({
    name: '',
    date: '',
    location: ''
  });

  // Fetch tournaments from PHP backend
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/tournaments')
      .then(response => response.json())
      .then(data => setTournaments(data.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleInputChange = (e) => {
    setNewTournament({
      ...newTournament,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(process.env.REACT_APP_API_URL + '/tournaments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTournament)
    })
    .then(response => response.json())
    .then(data => {
      // Refresh tournament list
      fetch(process.env.REACT_APP_API_URL + '/tournaments')
        .then(response => response.json())
        .then(data => setTournaments(data.data));
    });
  };

  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/tournaments?id=${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      // Remove deleted tournament from state
      setTournaments(tournaments.filter(t => t.id !== id));
    });
  };

  return (
    <div className="App">
      <h1>SmashBrosSpain Tournaments</h1>
      
      {/* Add Tournament Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Tournament Name"
          value={newTournament.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          value={newTournament.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newTournament.location}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Tournament</button>
      </form>

      {/* Tournaments List */}
      <div className="tournaments">
        {tournaments.map(tournament => (
          <div key={tournament.id} className="tournament">
            <h3>{tournament.name}</h3>
            <p>Date: {tournament.date}</p>
            <p>Location: {tournament.location}</p>
            <button onClick={() => handleDelete(tournament.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;