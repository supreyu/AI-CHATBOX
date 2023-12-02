import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 使用 useNavigate 而不是 useHistory
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 
  const navigate = useNavigate(); // 创建 navigate 实例

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('Login successful!');
        setSuccessMessage('Login Successfully!'); // 显示登录成功的消息
        setTimeout(() => navigate('/'), 1000); // 使用 navigate 进行跳转
      } else {
        console.error('Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>} {/* 条件渲染成功消息 */}
    </div>
  );
};

export default Login;

