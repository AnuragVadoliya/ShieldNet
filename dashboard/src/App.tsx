import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastProvider } from './components/Toast';
import { Dashboard } from './pages/Dashboard';
import { Threats } from './pages/Threats';
import { Devices } from './pages/Devices';
import { Zones } from './pages/Zones';
import { Federated } from './pages/Federated';
import Settings from './pages/Settings';
import { ThreatDetail } from './pages/ThreatDetail';
import { DeviceDetail } from './pages/DeviceDetail';
import { theme } from './styles/theme';

const AppShell: React.FC = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const go = () => setOnline(true);
    const goff = () => setOnline(false);
    window.addEventListener('online', go);
    window.addEventListener('offline', goff);
    return () => {
      window.removeEventListener('online', go);
      window.removeEventListener('offline', goff);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: theme.colors.background }}>
      <Navbar />
      {!online && (
        <div style={{
          background: theme.colors.error,
          color: theme.colors.onError,
          textAlign: 'center',
          padding: '6px',
          fontSize: '13px',
          fontWeight: 500,
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          zIndex: 1300,
        }}>
          <span style={{ fontSize: '16px', fontFamily: '"Material Symbols Outlined"', verticalAlign: 'middle', marginRight: 8 }}>wifi_off</span>
          No internet connection &mdash; live updates paused
        </div>
      )}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{
          flex: 1,
          padding: theme.spacing.xl,
          overflowY: 'auto',
          marginTop: '64px',
          marginLeft: '72px',
          background: theme.colors.background,
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/zones" element={<Zones />} />
            <Route path="/federated" element={<Federated />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/threats/:incidentRef" element={<ThreatDetail />} />
            <Route path="/device/:deviceId" element={<DeviceDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </ToastProvider>
);

export default App;