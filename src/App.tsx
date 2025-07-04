import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { HomePage } from './pages/HomePage';
import { AdminLogin } from './components/Admin/AdminLogin';
import AdminPanel from './components/Admin/AdminPanel';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  const config = useAppStore(state => state.config);
  const fetchAndSetConfig = useAppStore(state => state.fetchAndSetConfig);

  useEffect(() => {
    // Fetch the configuration from the server when the app loads
    fetchAndSetConfig();
  }, [fetchAndSetConfig]);

  // Inject styles from config
  const dynamicStyles = `
    :root {
      --primary-color: ${config.primaryColor};
      --secondary-color: ${config.secondaryColor};
      --header-bg-color: ${config.headerBgColor};
      --footer-bg-color: ${config.footerBgColor};
      --footer-text-color: ${config.footerTextColor};
      --menu-item-color: ${config.menuItemColor};
      --menu-item-hover-color: ${config.menuItemHoverColor};
    }
  `;

  return (
    <Router>
      <style>{dynamicStyles}</style>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
