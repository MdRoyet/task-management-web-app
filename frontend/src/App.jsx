import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import Layout from './components/Layout';
import api from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? <Layout><DashboardPage user={user} setUser={setUser} /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/board/:id" 
          element={user ? <Layout><BoardPage /></Layout> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
