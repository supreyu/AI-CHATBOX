import React, { useState, useEffect } from 'react';
import './Home.css';
import ChatInterface from '../ChatInterface/ChatInterface';
import { Link } from 'react-router-dom';
import Classify from '../Classify/Classify';
const Home = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('/api/activities')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setActivities(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []);

  return (
    <div className="home-container">
      <div className="main-content">
        <h1>Commodity Classification</h1>
        <div className="activity-section">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <img src={activity.image_url} alt={activity.title} />
              <h2>{activity.title}</h2>
              <p>{activity.description}</p>
              <Link to={`/classify?type=${encodeURIComponent(activity.type)}`} className="learn-more-btn">
              MORE
            </Link>
            </div>
          ))}
        </div>
        <h2>Recommended goods</h2>
        <div className="recommended-book">
          <p className="book-quote">"For more product recommendations, please consult customer service at the bottom right corner."</p>
        </div>
      </div>
      <ChatInterface /> {/* 渲染聊天界面组件 */}
    </div>
  );
};

export default Home;


