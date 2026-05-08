import React, { useState, useEffect, useCallback } from 'react';
import ISSMap from './components/ISSMap';
import ISSStats from './components/ISSStats';
import PeopleInSpace from './components/PeopleInSpace';
import NewsDashboard from './components/NewsDashboard';
import ChartsSection from './components/ChartsSection';
import Chatbot from './components/Chatbot';
import Toast from './components/Toast';
import { fetchISSLocation, fetchPeopleInSpace, fetchReverseGeocode } from './utils/api';
import { calculateDistance, calculateSpeed } from './utils/haversine';
import { getTheme, saveTheme, getSavedPositions, savePositions, getCachedNews } from './utils/storage';
import { Moon, Sun, RefreshCw } from 'lucide-react';
import './styles/global.css';
import './styles/dashboard.css';

function App() {
  const [location, setLocation] = useState(null);
  const [history, setHistory] = useState(getSavedPositions());
  const historyRef = React.useRef(history);
  const [speed, setSpeed] = useState(0);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [place, setPlace] = useState('');
  const [people, setPeople] = useState([]);
  const [theme, setTheme] = useState(getTheme());
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(Date.now());
  const [nextUpdate, setNextUpdate] = useState(20);
  const [toast, setToast] = useState(null);

  // Sync ref with state
  useEffect(() => {
    historyRef.current = history;
    savePositions(history);
  }, [history]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  const updateISSData = useCallback(async () => {
    try {
      const data = await fetchISSLocation();
      const newPos = {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        timestamp: data.timestamp,
      };

      setLocation(newPos);
      setLastFetch(Date.now());

      // Update history (max 15 for map trajectory)
      setHistory((prev) => {
        const newHistory = [...prev, newPos].slice(-15);
        savePositions(newHistory);
        return newHistory;
      });

      // Calculate speed (use API velocity if available, otherwise Haversine)
      const currentHistory = historyRef.current;
      const currentSpeed = data.velocity || (currentHistory.length > 0 ? calculateSpeed(
        calculateDistance(
          currentHistory[currentHistory.length - 1].latitude,
          currentHistory[currentHistory.length - 1].longitude,
          newPos.latitude,
          newPos.longitude
        ),
        newPos.timestamp - currentHistory[currentHistory.length - 1].timestamp
      ) : 27600); // Default ISS speed approx

      setSpeed(currentSpeed);
      setSpeedHistory(prev => [...prev, { 
        time: new Date(newPos.timestamp * 1000).toLocaleTimeString(), 
        speed: currentSpeed 
      }].slice(-30));

      // Reverse geocode occasionally (non-blocking)
      fetchReverseGeocode(newPos.latitude, newPos.longitude)
        .then(setPlace)
        .catch(err => console.error('Geocoding error:', err));
      
      if (!loading) {
        setToast({ message: 'ISS Data Updated', type: 'info' });
      }

    } catch (error) {
      console.error('Error fetching ISS data:', error);
      setToast({ message: 'Error updating ISS data', type: 'error' });
    }
  }, [history, loading]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Use a direct call to the API functions here to avoid closure issues during init
        const [locationData, peopleData] = await Promise.all([
          fetchISSLocation(),
          fetchPeopleInSpace()
        ]);
        
        const newPos = {
          latitude: parseFloat(locationData.iss_position.latitude),
          longitude: parseFloat(locationData.iss_position.longitude),
          timestamp: locationData.timestamp,
        };
        
        setLocation(newPos);
        setPeople(peopleData.people);
        setHistory([newPos]);
        setLastFetch(Date.now());
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    init();

    const interval = setInterval(() => {
      // We use the function itself to get the latest state indirectly if needed, 
      // but updateISSData is stable enough if we fix its dependencies.
      updateISSData();
    }, 20000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this only runs once on mount

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((20000 - (Date.now() - lastFetch)) / 1000));
      setNextUpdate(remaining);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastFetch]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // We no longer block the whole UI with a spinner. 
  // Components handle their own loading states for a much faster perceived performance.

  const dashboardData = {
    location,
    speed,
    people,
    news: getCachedNews() || {},
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-title">
          <h1>ISS Live Intelligence</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time tracking and mission intelligence dashboard
          </p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="update-timer">
            Next update: {nextUpdate}s
          </div>
          <button onClick={updateISSData} className="header-btn glass-card" title="Refresh Data">
            <RefreshCw size={20} color={theme === 'dark' ? '#0ea5e9' : '#0284c7'} />
          </button>
          <button onClick={toggleTheme} className="header-btn glass-card" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#4f46e5" />}
          </button>
        </div>
      </header>

      <ISSStats
        location={location}
        speed={speed}
        place={place}
        totalPositions={history.length}
        peopleCount={people.length}
      />

      <main className="main-content">
        <ISSMap position={location} history={history} />
        <PeopleInSpace people={people} />
      </main>

      <ChartsSection speedHistory={speedHistory} newsData={dashboardData.news} />

      <NewsDashboard />

      <Chatbot dashboardData={dashboardData} />

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <footer style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)' }}>
        <p>&copy; 2026 ISS Live Intelligence Dashboard. Powered by OpenNotify & NewsAPI.</p>
      </footer>
    </div>
  );
}

export default App;
