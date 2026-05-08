import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { RefreshCw, Search, ChevronDown } from 'lucide-react';
import { fetchNews } from '../utils/api';
import { getCachedNews, saveCachedNews } from '../utils/storage';

const NewsDashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('space');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const categories = ['space', 'technology', 'science', 'astronomy'];

  const loadNews = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!forceRefresh) {
        const cached = getCachedNews();
        if (cached && cached[category]) {
          setNews(cached[category]);
          setLoading(false);
          return;
        }
      }

      const articles = await fetchNews(category);
      setNews(articles);
      
      const currentCache = getCachedNews() || {};
      saveCachedNews({ ...currentCache, [category]: articles });
    } catch (err) {
      setError('Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [category]);

  const filteredNews = news
    .filter((article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.publishedAt) - new Date(a.publishedAt);
      return a.source.name.localeCompare(b.source.name);
    });

  return (
    <section className="news-section list-layout glass-card">
      <div className="news-header-top">
        <h2 className="news-title">Breaking News</h2>
        <button onClick={() => loadNews(true)} className="refresh-btn-simple">
          Refresh
        </button>
      </div>

      <div className="news-controls-row">
        <div className="search-container-simple">
          <input
            type="text"
            placeholder="Search title, source, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-simple"
          />
        </div>
        <div className="sort-container-simple">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select-simple"
          >
            <option value="date">Sort by Date</option>
            <option value="source">Sort by Source</option>
          </select>
        </div>
      </div>

      <div className="news-list-container">
        {loading ? (
          <div className="loading-state">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="news-item-row skeleton" style={{ height: '80px', margin: '10px 0' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => loadNews(true)}>Retry</button>
          </div>
        ) : (
          <div className="news-items-list">
            {filteredNews.map((article, index) => (
              <ArticleCard key={index} article={article} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsDashboard;
