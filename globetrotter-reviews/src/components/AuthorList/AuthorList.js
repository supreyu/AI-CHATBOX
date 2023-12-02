// AuthorList.js
import React, { useState, useEffect } from 'react';
import './AuthorList.css';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    // 在此处发起请求以获取作者列表数据
    fetch('/api/authors') // 假设有一个用于获取作者数据的API端点
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setAuthors(data))
      .catch(error => console.error('Error fetching authors:', error));
  }, []);

  return (
    <div className="author-list-container">
      {authors.map((author, index) => (
        <div className="author-box" key={index}>
          <h2 className="author-name">{author.name}</h2>
          <p className="author-info"><strong>Nationality:</strong> {author.nationality}</p>
          <p className="author-info"><strong>Bio:</strong> {author.bio}</p>
        </div>
      ))}
    </div>
  );
};

export default AuthorList;

