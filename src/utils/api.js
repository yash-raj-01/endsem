import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export const fetchISSLocation = async () => {
  try {
    const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
    return {
      iss_position: {
        latitude: response.data.latitude,
        longitude: response.data.longitude,
      },
      timestamp: response.data.timestamp,
      velocity: response.data.velocity,
    };
  } catch (error) {
    console.warn('Primary ISS API failed, using simulated fallback.');
    
    // Fallback: Get last position from storage or use a default starting point
    const saved = JSON.parse(localStorage.getItem('iss_dashboard_positions') || '[]');
    const lastPos = saved.length > 0 ? saved[saved.length - 1] : { latitude: 0, longitude: 0, timestamp: Date.now() / 1000 };
    
    // Simulate a small drift (ISS moves about 0.07 degrees per minute)
    // 20 seconds is 1/3 minute -> ~0.02 degrees
    return {
      iss_position: {
        latitude: lastPos.latitude + (Math.random() * 0.02 - 0.01),
        longitude: lastPos.longitude + (0.05 + Math.random() * 0.05), // Moves mostly eastward
      },
      timestamp: (Date.now() / 1000),
      velocity: 27600, // Constant simulated velocity
      simulated: true
    };
  }
};

export const fetchPeopleInSpace = async () => {
  try {
    const response = await axios.get('https://corquaid.github.io/international-space-station-api/api/v1/astros.json');
    return response.data;
  } catch (error) {
    // Fallback to a static list if both fail
    return { 
      people: [
        { name: 'Oleg Kononenko', craft: 'ISS' },
        { name: 'Nikolai Chub', craft: 'ISS' },
        { name: 'Tracy Caldwell Dyson', craft: 'ISS' },
        { name: 'Matthew Dominick', craft: 'ISS' },
        { name: 'Michael Barratt', craft: 'ISS' },
        { name: 'Jeanette Epps', craft: 'ISS' },
        { name: 'Alexander Grebenkin', craft: 'ISS' }
      ]
    };
  }
};

export const fetchReverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ISS-Intelligence-Dashboard/1.0',
        },
      }
    );
    return response.data.display_name || 'Over the Ocean';
  } catch (error) {
    console.error('Geocoding error:', error);
    return 'Unknown Location';
  }
};

export const fetchNews = async (category = 'space') => {
  if (!NEWS_API_KEY || NEWS_API_KEY === 'your_newsapi_key_here') {
    // Fallback/Mock data if no key is provided
    return mockNews[category] || [];
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: category,
        sortBy: 'publishedAt',
        apiKey: NEWS_API_KEY,
        pageSize: 5,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error('News API error:', error);
    return mockNews[category] || [];
  }
};

const mockNews = {
  space: [
    {
      title: 'Stunning Image of Galaxy Captured by Webb',
      source: { name: 'SpaceNews' },
      author: 'John Doe',
      publishedAt: new Date().toISOString(),
      urlToImage: 'https://images.unsplash.com/photo-1464802686167-b939a67e06a1?auto=format&fit=crop&q=80&w=400',
      description: 'The James Webb Space Telescope has captured a new high-resolution image of a distant spiral galaxy.',
      url: '#',
    },
    {
      title: 'Mars Rover Finds New Evidence of Ancient Water',
      source: { name: 'NASA' },
      author: 'Jane Smith',
      publishedAt: new Date().toISOString(),
      urlToImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=400',
      description: 'The Perseverance rover has discovered rock samples that suggest Mars had liquid water for longer than previously thought.',
      url: '#',
    },
  ],
  technology: [
    {
      title: 'New AI Model Breakthrough in Satellite Imaging',
      source: { name: 'TechCrunch' },
      author: 'Alice Johnson',
      publishedAt: new Date().toISOString(),
      urlToImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
      description: 'Researchers have developed an AI model that can process satellite imagery 10x faster with higher precision.',
      url: '#',
    },
  ],
};
