import React from 'react';
import { Navigation, Globe, Zap, Users } from 'lucide-react';

const ISSStats = ({ location, speed, place, totalPositions, peopleCount }) => {
  const stats = [
    {
      label: 'Latitude',
      value: (location?.latitude !== undefined && !isNaN(location.latitude)) 
        ? Number(location.latitude).toFixed(4) 
        : '0.0000',
      icon: <Navigation size={20} />,
      color: 'var(--accent-primary)',
    },
    {
      label: 'Longitude',
      value: (location?.longitude !== undefined && !isNaN(location.longitude)) 
        ? Number(location.longitude).toFixed(4) 
        : '0.0000',
      icon: <Globe size={20} />,
      color: 'var(--accent-secondary)',
    },
    {
      label: 'Current Speed',
      value: `${speed ? speed.toFixed(2) : '0.00'} km/h`,
      icon: <Zap size={20} />,
      color: '#f59e0b',
    },
    {
      label: 'Nearest Place',
      value: place || 'Calculating...',
      icon: <Globe size={20} />,
      color: '#10b981',
    },
    {
      label: 'Positions Tracked',
      value: totalPositions || 0,
      icon: <Navigation size={20} />,
      color: '#8b5cf6',
    },
    {
      label: 'People in Space',
      value: peopleCount || 0,
      icon: <Users size={20} />,
      color: '#ec4899',
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card stat-card">
          <div style={{ color: stat.color, marginBottom: '0.5rem' }}>{stat.icon}</div>
          <div className="stat-label" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {stat.label}
          </div>
          <div className="stat-value" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ISSStats;
