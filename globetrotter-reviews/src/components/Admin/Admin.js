// src/components/Admin/Admin.js
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Admin.css'; // 确保您的样式文件路径是正确的

function Admin() {
  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <ul>
          <li><NavLink to="add-product" activeClassName="active">ADD PRODUCT</NavLink></li>
          <li><NavLink to="edit-product" activeClassName="active">EDIT PRODUCT</NavLink></li>
          <li><NavLink to="edit-users" activeClassName="active">EDIT USERS</NavLink></li>
        </ul>
      </div>
      <div className="admin-content">
        {/* Outlet将渲染匹配的子路由 */}
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;


