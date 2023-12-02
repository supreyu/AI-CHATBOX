import React, { useState, useEffect } from 'react';
import './Home.css';

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
        <h1>Latest activity</h1>
        <div className="activity-section">
          {/* 确保这里的activities已经定义并且包含了你的活动数据 */}
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <img src={activity.image_url} alt={activity.title} />
              <h2>{activity.title}</h2>
              <p>{activity.description}</p>
              <a href="/activity-link" className="learn-more-btn">LEARN MORE</a>
            </div>
          ))}
        </div>
        <h2>Recommended book</h2>
        <div className="recommended-book">
          <p className="book-quote">"No book in the world can bring you good luck; But they can make you become yourself quietly"</p>
        </div>
      </div>
    </div>
  );
};

export default Home;


