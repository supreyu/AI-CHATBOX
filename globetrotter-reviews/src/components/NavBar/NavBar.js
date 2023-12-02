// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/" className="nav-btn">Home</Link></li>
        <li><Link to="/books" className="nav-btn">Books</Link></li>
        <li><Link to="/authors" className="nav-btn">Authors</Link></li>
        {/* 添加其他导航项 */}
      </ul>
      <div className="nav-right">
        <div className="search-bar">
          <input type="text" placeholder="Search for Books" />
          <button type="button" className="search-btn">Search</button>
        </div>
        <div className="login">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="register-btn">Register</Link>
          <Link to="/Addbook" className="login-btn">AddBook</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;


