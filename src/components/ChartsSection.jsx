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
      <div className="glass-card chart-container iss-trend-card">
        <h3 className="chart-title">ISS Speed Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart 
            data={speedHistory.length > 0 ? speedHistory : [{time: '', speed: 0}]}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="1 1" stroke="rgba(0,0,0,0.1)" vertical={true} />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-secondary)" 
              fontSize={10} 
              tick={{ angle: -45, textAnchor: 'end', dy: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="var(--text-secondary)" 
              fontSize={10} 
              domain={['auto', 'auto']}
              tickFormatter={(val) => val.toLocaleString()}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.5rem',
                color: 'var(--text-primary)',
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="center" 
              wrapperStyle={{ paddingBottom: '20px' }}
              iconType="circle"
            />
            <Line
              name="ISS Speed (km/h)"
              type="monotone"
              dataKey="speed"
              stroke="var(--text-primary)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'var(--text-primary)', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card chart-container">
        <h3 style={{ marginBottom: '1rem' }}>News Category Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
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
