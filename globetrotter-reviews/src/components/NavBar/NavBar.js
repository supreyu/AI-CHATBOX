  // NavBar.js
  import React, { useState, useEffect, useContext } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';
  import { UserContext } from '../../App'; // 确保路径正确
  import { CartContext } from '../../App';
  import './NavBar.css';
  
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faBars } from '@fortawesome/free-solid-svg-icons';
  const NavBar = () => {
    const [cartVisible, setCartVisible] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const { currentUser ,setCurrentUser} = useContext(UserContext); // 使用上下文获取当前用户信息
    const isLoggedIn = currentUser != null;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const { cartItems, removeFromCart } = useContext(CartContext);

    // 登出函数
    const handleLogout = () => {
      setCurrentUser(null); // 清除用户状态
      navigate('/login'); // 重定向到登录页
      setIsDropdownVisible(false); // 关闭下拉菜单
    };


    const toggleNav = () => {
      setIsNavExpanded(!isNavExpanded);
    };



    //搜索功能
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
    const performSearch = () => {
      // 使用 navigate 函数进行页面跳转，并带上查询参数
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    };
    

    // 鼠标移入事件处理函数
    const handleMouseEnter = () => {
      setCartVisible(true);
    };

    // 鼠标移出事件处理函数
    const handleMouseLeave = () => {
      setCartVisible(false);
    };
    


    // 在用户图标上悬停时显示下拉菜单
    const handleUserIconMouseEnter = () => {
      setIsDropdownVisible(true);
    };

    // 当鼠标离开用户图标时隐藏下拉菜单
    const handleUserIconMouseLeave = () => {
      setIsDropdownVisible(false);
    };


  const handleUserIconClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
    if (isLoggedIn) {
      console.log('Current User:', currentUser);
      if (currentUser && currentUser.userId) {
        navigate(`/users/${currentUser.userId}`);
      } else {
        console.error('No valid currentUser.id available');
      }
    } else {
      alert('请先登录或注册');
      navigate('/login');
    }
    
  };





  return (
    
    <nav className={`navbar ${isNavExpanded ? "active" : ""}`}>
      <div className="hamburger" onClick={toggleNav}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      
      <ul className={`nav-links ${isNavExpanded ? "nav-links-expanded" : ""}`}>
        <li><Link to="/" className="nav-btn">Home</Link></li>
        <li><Link to="/ProductList" className="nav-btn">Products</Link></li>
        {isLoggedIn && currentUser.isAdmin && (
          <li><Link to="/admin" className="nav-btn">Admin</Link></li>
        )}
      </ul>

      <div className="nav-right">
        <div className="shopping-cart-icon"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave} 
        >
          <FontAwesomeIcon icon={faShoppingCart} />
          {cartVisible && (
            <div className="shopping-cart-dropdown">
              {cartItems.length > 0 ? (
                <ul className="cart-items">
                  {cartItems.map(item => (
                    <li key={item.id} className="cart-item">
                      <img src={item.cover_image} alt={item.title} className="cart-item-image" />
                      <div className="cart-item-description">{item.title}</div>
                      <div className="cart-item-quantity">Quantity: {item.quantity}</div>
                      <div className="cart-item-price">£{Number(item.price).toFixed(2)}</div>
                      {/* 删除按钮 */}
                      <div className="cart-item-remove" onClick={() => removeFromCart(item.id)}>×</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-cart">Your cart is empty</div>
              )}
            </div>
          )}
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            type="button"
            className="search-btn"
            onClick={performSearch}
          >
            Search
          </button>
        </div>
        
        <div className={`user-icon ${isDropdownVisible ? "active" : ""}`}
        onClick={handleUserIconClick} 
        onMouseEnter={handleUserIconMouseEnter}
        onMouseLeave={handleUserIconMouseLeave}
        style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faUserCircle} size="2x" />
          
              {isLoggedIn && isDropdownVisible && (
                <div className="user-dropdown">
                  <ul className="user-dropdown-items">
                    <li>{currentUser?.username}</li>
                    <li onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}

        </div>
        
        <Link to="/register" className="nav-btn">Register</Link>
        {
          isLoggedIn ? (
            <div className="login">
              {/* 如果已登录，显示用户相关的选项 */}
            </div>
          ) : null // 当用户未登录时不渲染任何东西
        }
      </div>
    </nav>

  );
  };

  export default NavBar;


