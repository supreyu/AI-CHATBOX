import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App'; 
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext); // Use the useContext hook to get the setCurrentUser function

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
        const data = await response.json();
        console.log('Login successful!', data);
        console.log(data);
        setCurrentUser(data); // 使用 setCurrentUser 更新上下文中的当前用户信息
        navigate(data.isAdmin ? '/admin' : '/'); // 根据用户是否为管理员导航到相应页面
      } else {
        const errorText = await response.text();
        setErrorMessage(`Login failed: ${errorText}`);
        console.error('Login failed:', errorText);
      }
    } catch (error) {
      setErrorMessage(`Error during login: ${error.toString()}`);
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
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* 条件渲染错误消息 */}
      </form>
    </div>
  );
};

export default Login;
