# ISS Live Intelligence Dashboard

A complete React + Vite web application for real-time ISS tracking, mission news, and AI-powered intelligence.

## Features

- **Live ISS Tracking**: Real-time position updates every 15 seconds with trajectory path.
- **News Dashboard**: Latest space and technology news with category filtering and caching.
- **AI Chatbot**: Intelligent assistant trained on dashboard data (using Mistral-7B via HF Router).
- **Interactive Visualizations**: Live speed charts and news distribution analytics.
- **Modern UI/UX**: Glassmorphism design, dark/light mode, and fully responsive layout.
- **Persistence**: LocalStorage caching for news, chat history, and theme settings.

## Tech Stack

- **Framework**: React 19 + Vite
- **Maps**: Leaflet.js + React-Leaflet
- **Charts**: Recharts
- **AI**: OpenAI SDK (pointing to Hugging Face Inference API)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with Glassmorphism
- **API**: axios

## Setup Instructions

1. **Clone the repository** (or ensure you are in the project directory).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (use `.env.example` as a template):
   ```env
   VITE_NEWS_API_KEY=your_newsapi_key_here
   VITE_HF_TOKEN=your_huggingface_token_here
   ```
   *Note: A Hugging Face token is provided by default for the AI chatbot.*
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Build for production**:
   ```bash
   npm run build
   ```

## API Credits

- ISS Tracking: [OpenNotify API](http://api.open-notify.org/)
- Reverse Geocoding: [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/)
- News: [NewsAPI](https://newsapi.org/)
- AI Model: Mistral-7B via [Hugging Face](https://huggingface.co/)
