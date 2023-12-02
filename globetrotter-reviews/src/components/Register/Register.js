// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入useNavigate钩子
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // 新的状态变量
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // 阻止默认的表单提交行为

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...'); // 设置成功消息
        // 延迟一段时间后跳转到登录页面
        setTimeout(() => navigate('/login'), 2000); // 2秒后跳转
      } else {
        console.error('Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}> {/* 使用 onSubmit 事件处理函数 */}
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit"> {/* 将按钮类型改为 submit */}
          Register
        </button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>} {/* 条件渲染成功消息 */}
    </div>
  );
};

export default Register;
