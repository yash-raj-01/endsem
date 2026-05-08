import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const ArticleCard = ({ article, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { title, source, author, publishedAt, urlToImage, description, url } = article;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB') + ', ' + date.toLocaleTimeString('en-GB');
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`news-item-row glass-card ${isExpanded ? 'expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
    >
      <div className="news-item-main-row">
        <div className="news-item-image-container">
          <span className="news-rank">{index + 1}</span>
          {urlToImage ? (
            <img src={urlToImage} alt={title} className="news-item-thumb" />
          ) : (
            <div className="news-item-thumb-placeholder" />
          )}
        </div>
        
        <div className="news-item-details">
          <div className="news-item-main">
            <h4 className="news-item-title">{title}</h4>
            <span className="news-item-date">{formatDate(publishedAt)}</span>
          </div>
        </div>

        <div className="news-item-action">
          <button onClick={toggleExpand} className="expand-btn">
            {isExpanded ? <ChevronUp size={18} color="#ef4444" /> : <ChevronDown size={18} color="#ef4444" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="news-item-expanded-content" style={{ marginTop: '1rem', padding: '1rem', borderTop: '1px solid var(--glass-border)', animation: 'fadeIn 0.3s ease' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {description || 'No description available for this article.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {author && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>By: {author}</span>}
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="read-more-link"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                color: 'var(--accent-primary)', 
                fontWeight: 600, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem' 
              }}
            >
              Read Full Article <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ArticleCard;
