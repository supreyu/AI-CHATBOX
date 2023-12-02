// BookDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css'; // 确保你有一个相应的CSS文件

const BookDetail = () => {
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [rating, setRating] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    // Fetch book details
    fetch(`/api/books/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setBook(data))
      .catch(error => console.error('Error fetching book details:', error));

    // Fetch comments
    fetch(`/api/books/${id}/comments`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error));
  }, [id]);

  const submitComment = () => {
    // Assuming a logged-in user with ID 1
    const userId = 1;

    fetch(`/api/books/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, content: commentContent, rating }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      setCommentContent('');
      setRating(1);
      return fetch(`/api/books/${id}/comments`);
    })
    .then(response => response.json())
    .then(data => setComments(data))
    .catch(error => console.error('Error posting comment:', error));
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-detail-container">
      <div className="book-cover-and-info">
        <img src={book.cover_image} alt={book.title} className="book-cover" />
        <div className="book-info">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Description:</strong> {book.description}</p>
          <p><strong>Country:</strong> {book.type}</p>
          {/* Add more details as needed */}
        </div>
      </div>
      <div className="book-comments-section">
        <h3>Comments</h3>
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
            <p>Rating: {Array(comment.rating).fill('⭐')}</p>
          </div>
        ))}
        <div className="comment-form">
          <textarea value={commentContent} onChange={e => setCommentContent(e.target.value)} />
          <select value={rating} onChange={e => setRating(e.target.value)}>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
          <button onClick={submitComment}>Submit Comment</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
