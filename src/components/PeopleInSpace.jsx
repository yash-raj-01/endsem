import React from 'react';
import { User } from 'lucide-react';

const PeopleInSpace = ({ people }) => {
  return (
    <div className="glass-card people-section">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User size={20} color="var(--accent-primary)" />
        People in Space ({people.length})
      </h3>
      <div className="people-list" style={{ marginTop: '1rem' }}>
        {people.length > 0 ? (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {people.map((person, index) => (
              <li
                key={index}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 500 }}>{person.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {person.craft}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="skeleton" style={{ height: '100px', width: '100%' }}></div>
        )}
      </div>
    </div>
  );
};

export default PeopleInSpace;
