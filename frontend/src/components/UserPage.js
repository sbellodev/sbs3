import React, { useState, useEffect } from 'react';
import '../App.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    username: '', 
    email: '', 
    role: 'user'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const roles = [
    { id: 'user', name: 'User' },
    { id: 'admin', name: 'Admin' }
  ];

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json();
      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error.message);
      setError(`Failed to load users: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Handle API validation errors
        throw new Error(result.error || 'Failed to create user');
      }

      setSuccess('User created successfully!');
      setNewUser({ username: '', email: '', role: 'user' });
      await fetchUsers();
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setSuccess('User deleted successfully!');
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error:', error.message);
      setError(`Failed to delete user: ${error.message}`);
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
      <h1>Manage Users</h1>
      
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

      <form onSubmit={handleSubmit} className="general-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleChange}
          required
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <button type="submit">Add User</button>
      </form>

      <div className="general-grid">
        {users.map(({ id, username, email, role }) => (
          <div key={id} className="general-card">
            <h3>{username}</h3>
            <p>Email: {email}</p>
            <p>Role: {roles.find(r => r.id === role)?.name || role}</p>
            <button onClick={() => handleDelete(id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;