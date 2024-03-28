// src/components/EditUsers/EditUsers.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditUsers.css'; // 创建并引入相应的CSS样式文件

function EditUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 获取所有用户信息
    fetch('/api/users') // 确保后端有一个返回所有用户的API端点
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const deleteUser = (id) => {
    if (window.confirm('Determine whether to delete the user？')) {
      fetch(`/api/users/${id}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            setUsers(users.filter(user => user.id !== id));
          } else {
            console.error('Error deleting user');
          }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  };

  const handleEdit = (id) => {
    // 根据您的应用结构，可能需要创建一个用于编辑用户的组件
    navigate(`/admin/edit-users/${id}`);
  };

  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>User name</th>
            <th>Email address</th>
            <th>Birthday</th>
            <th>Gender</th>
            <th>Administrator</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.birthday || 'Not set'}</td>
              <td>{user.gender || 'Not set'}</td>
              <td>{user.is_admin ? 'YES' : 'NO'}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(user.id)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditUsers;