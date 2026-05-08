import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Trash2, Zap } from 'lucide-react';
import { OpenAI } from 'openai';
import { getChatHistory, saveChatHistory, clearChatHistory as clearStorage } from '../utils/storage';

const Chatbot = ({ dashboardData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(getChatHistory());
  }, []);

  useEffect(() => {
    saveChatHistory(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const client = new OpenAI({
    baseURL: 'https://router.huggingface.co/v1',
    apiKey: import.meta.env.VITE_HF_TOKEN,
    dangerouslyAllowBrowser: true, // Only for demo purposes in local environment
  });

  const generateResponse = async (userMessage) => {
    if (!import.meta.env.VITE_HF_TOKEN) {
      return getFallbackResponse(userMessage);
    }

    const context = `
      You are an AI assistant for the ISS Live Intelligence Dashboard. 
      Current Dashboard Data:
      - ISS Location: Lat ${dashboardData.location?.latitude}, Lon ${dashboardData.location?.longitude}
      - ISS Speed: ${dashboardData.speed?.toFixed(2)} km/h
      - People in Space: ${dashboardData.people?.length} people (${dashboardData.people?.map(p => p.name).join(', ')})
      - News Categories: ${Object.keys(dashboardData.news || {}).join(', ')}
      - Total Articles: ${Object.values(dashboardData.news || {}).flat().length}
      
      Instructions: Answer ONLY using the dashboard data provided. If you don't know the answer based on this data, say you don't have that information. Keep answers concise.
    `;

    try {
      const chatCompletion = await client.chat.completions.create({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        messages: [
          { role: 'system', content: context },
          ...messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage },
        ],
        max_tokens: 150,
      });

      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.error('HF API Error:', error);
      return getFallbackResponse(userMessage);
    }
  };

  const getFallbackResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('location') || q.includes('where')) {
      return `The ISS is currently at Latitude: ${dashboardData.location?.latitude?.toFixed(4) || 'N/A'}, Longitude: ${dashboardData.location?.longitude?.toFixed(4) || 'N/A'}.`;
    }
    if (q.includes('speed') || q.includes('fast')) {
      return `The ISS is traveling at approximately ${dashboardData.speed?.toFixed(2)} km/h.`;
    }
    if (q.includes('people') || q.includes('astronauts')) {
      return `There are currently ${dashboardData.people?.length} people in space: ${dashboardData.people?.map(p => p.name).join(', ')}.`;
    }
    if (q.includes('news')) {
      return `I have ${Object.values(dashboardData.news || {}).flat().length} articles across ${Object.keys(dashboardData.news || {}).length} categories.`;
    }
    return "I can only provide information about the ISS location, speed, people in space, and news data from this dashboard.";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const botResponse = await generateResponse(input);
    const botMsg = { role: 'assistant', content: botResponse, timestamp: new Date().toLocaleTimeString() };
    
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    clearStorage();
  };

  return (
    <>
      <button className="chatbot-trigger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window glass-card">
          <div className="chat-header" style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--accent-primary)" />
              ISS Intelligence AI
            </h4>
            <button onClick={clearChat} title="Clear history">
              <Trash2 size={16} color="var(--text-secondary)" />
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem', fontSize: '0.9rem' }}>
                Ask me about ISS location, speed, or mission news!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role === 'user' ? 'message-user' : 'message-bot'}`}>
                {msg.content}
                <div style={{ fontSize: '0.6rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message message-bot">
                <div className="typing-indicator" style={{ display: 'flex', gap: '4px' }}>
                  <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" style={{ color: 'var(--accent-primary)' }}>
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
