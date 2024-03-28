// PostComment.js
import React, { useState, useContext } from 'react';
import { UserContext } from '../../App'; // 确保路径正确
import './PostComment.css';
function PostComment({ productId, handleNewComment }) {
  const [commentText, setCommentText] = useState('');
  const { currentUser } = useContext(UserContext); // 使用 useContext 获取 currentUser

  const postComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to post comments.');
      return;
    }
    
    try {
      const response = await fetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`, // 如果你使用了 token 认证
        },
        body: JSON.stringify({
          userId: currentUser.id,
          content: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error('Problem posting comment');
      }

      const newCommentData = await response.json();
      handleNewComment(newCommentData);
      setCommentText(''); // 清空评论框
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="post-comment-container">
      <form onSubmit={postComment}>
        <textarea
          className="comment-textarea"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment here..."
          required
        />
        <button className="submit-comment-button" type="submit">Post Comment</button>
      </form>
    </div>
  );
}

export default PostComment;
