import React, { useState, useEffect } from 'react';
import { userService } from '../services/UserService';
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
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await userService.getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setError(`Failed to load users: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      await userService.createUser(newUser);
      setSuccess('User created successfully!');
      setNewUser({ username: '', email: '', role: 'user' });
      await loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userService.deleteUser(id);
      setSuccess('User deleted successfully!');
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(`Failed to delete user: ${error.message}`);
    }
  };

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
      
      {/* Messages */}
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