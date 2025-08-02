import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://user:634d325c6160a89428b42f77ea426915@test-dashboard-app-tunnel-3lu4cxww.devinapps.com/api';

axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('/auth/login', { username, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user ? (
          <AuthenticatedApp user={user} onLogout={handleLogout} />
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

function AuthenticatedApp({ user, onLogout }) {
  return (
    <>
      <header className="header">
        <div className="container">
          <h1>School Dashboard</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span>Welcome, {user.first_name} {user.last_name}</span>
              <span style={{ marginLeft: '1rem', opacity: 0.8 }}>({user.role})</span>
            </div>
            <button className="btn btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </div>
          <nav className="nav">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/students" className="nav-link">Students</Link>
            <Link to="/sessions" className="nav-link">Sessions</Link>
            {(user.role === 'superuser' || user.role === 'admin' || user.role === 'hr') && (
              <Link to="/workers" className="nav-link">Workers</Link>
            )}
            <Link to="/meals" className="nav-link">Meals</Link>
            {(user.role === 'superuser' || user.role === 'admin') && (
              <Link to="/schools" className="nav-link">Schools</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/students" element={<Students user={user} />} />
          <Route path="/sessions" element={<Sessions user={user} />} />
          <Route path="/workers" element={<Workers user={user} />} />
          <Route path="/meals" element={<Meals user={user} />} />
          <Route path="/schools" element={<Schools user={user} />} />
        </Routes>
      </main>
    </>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await onLogin(username, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '5rem' }}>
      <div className="card">
        <h2>School Dashboard Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/dashboard/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="card">
            <h3>Students</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_students || 0}</p>
          </div>
          <div className="card">
            <h3>Workers</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_workers || 0}</p>
          </div>
          <div className="card">
            <h3>Schools</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_schools || 0}</p>
          </div>
          <div className="card">
            <h3>Recent Sessions</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.recent_sessions || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Students({ user }) {
  return (
    <div>
      <h2>Students</h2>
      <div className="card">
        <p>Student management functionality will be implemented here.</p>
        <p>Features include:</p>
        <ul>
          <li>View and search students</li>
          <li>Add new students</li>
          <li>Edit student information</li>
          <li>Track attendance and assessments</li>
        </ul>
      </div>
    </div>
  );
}

function Sessions({ user }) {
  return (
    <div>
      <h2>Session Recording</h2>
      <div className="card">
        <p>Session recording functionality will be implemented here.</p>
        <p>Features include:</p>
        <ul>
          <li>Record academic sessions (for head_tutor role)</li>
          <li>Record physical education sessions (for head_coach role)</li>
          <li>Bulk session recording with student filtering</li>
          <li>Filter students by grade and reading level</li>
        </ul>
      </div>
    </div>
  );
}

function Workers({ user }) {
  return (
    <div>
      <h2>Workers</h2>
      <div className="card">
        <p>Worker management functionality will be implemented here.</p>
        <p>Features include:</p>
        <ul>
          <li>View tutors and coaches</li>
          <li>Add new workers</li>
          <li>Manage worker assignments</li>
          <li>Track training records</li>
        </ul>
      </div>
    </div>
  );
}

function Meals({ user }) {
  return (
    <div>
      <h2>Meal Management</h2>
      <div className="card">
        <p>Meal tracking functionality will be implemented here.</p>
        <p>Features include:</p>
        <ul>
          <li>Track meal distributions</li>
          <li>Record meal attendance</li>
          <li>Generate meal statistics</li>
          <li>Upload meal photos</li>
        </ul>
      </div>
    </div>
  );
}

function Schools({ user }) {
  return (
    <div>
      <h2>Schools</h2>
      <div className="card">
        <p>School management functionality will be implemented here.</p>
        <p>Features include:</p>
        <ul>
          <li>View all schools</li>
          <li>Add new schools</li>
          <li>Edit school information</li>
          <li>Manage school assignments</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
