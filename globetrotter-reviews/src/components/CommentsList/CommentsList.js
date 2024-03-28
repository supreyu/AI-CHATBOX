// CommentsList.js
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App'; // 确保路径正确
import './CommentsList.css'; 
function CommentsList({ productId }) {
  const [comments, setComments] = useState([]);
  const { currentUser } = useContext(UserContext); // 使用 useContext 获取 currentUser

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/comments`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [productId]);

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}` // 假设使用token进行认证
        },
      });

      if (!response.ok) {
        throw new Error('Problem deleting comment');
      }

      // 更新状态以移除已删除的评论
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comments-list">
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <p className="comment-content">{comment.content}</p>
          <div className="comment-info">
            <span className="comment-user">{comment.username}</span>
            <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
            {(currentUser?.isAdmin || currentUser?.id === comment.user_id) && (
              <button className="delete-comment-button" onClick={() => deleteComment(comment.id)}>Delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentsList;
