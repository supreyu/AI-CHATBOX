import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App'; 
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext); // 使用上下文中的currentUser
  const userId = currentUser ? currentUser.userId : null; // 从currentUser中获取id

  const [user, setUser] = useState({
    username: '',
    email: '',
    // ...其他用户属性
  });

  // 当组件加载或者userId更新时，获取用户信息
  useEffect(() => {
    // 如果有有效的userID，则获取用户信息
    if (userId) {
      console.log("当前 userId:", userId); // 打印当前的 userId
      fetch(`/api/users/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setUser(data)) // 更新用户信息状态
        .catch(error => console.error('获取用户信息出错:', error));
    }
  }, [userId]); // 依赖数组中只有userId

  // 更新用户信息的函数
  const navigateToUpdateUser = () => {
    navigate(`/update-user/${userId}`);
  };
  return (
    <div className="user-profile-container">
      <h1>User Profile</h1>
      <div>
        <strong>User name:</strong> {user.username}
      </div>
      <div>
        <strong>E-mail:</strong> {user.email}
      </div>
      {/* 展示其他用户属性 */}
      {/* ... */}
      <button onClick={navigateToUpdateUser}>Modification of Personal Information</button>
    </div>
  );
  };

export default UserProfile;



