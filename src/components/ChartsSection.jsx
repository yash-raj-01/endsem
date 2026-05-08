import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const ChartsSection = ({ speedHistory, newsData }) => {
  // Process news data for pie chart
  const categories = Object.keys(newsData || {});
  const newsDistribution = categories.map((cat) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: newsData[cat]?.length || 0,
  }));

  const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="charts-grid">
      <div className="glass-card chart-container" style={{ height: '400px' }}>
        <h3 style={{ marginBottom: '1rem' }}>ISS Speed Velocity (km/h)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={speedHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-secondary)" 
              fontSize={10} 
              tickFormatter={(t) => (t && typeof t === 'string' ? t.split(':').slice(1).join(':') : '')} 
            />
            <YAxis stroke="var(--text-secondary)" fontSize={10} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.5rem',
                color: 'var(--text-primary)',
              }}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              dot={false}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card chart-container" style={{ height: '400px' }}>
        <h3 style={{ marginBottom: '1rem' }}>News Category Distribution</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={newsDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {newsDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.5rem',
                color: 'var(--text-primary)',
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;
