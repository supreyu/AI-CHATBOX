import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext,UserContext } from '../../App'; // 确保路径正确
import './ProductList.css';

const ProductList = () => {
  const [products, setProductList] = useState([]);
  const { addToCart } = useContext(CartContext); // 使用 useContext 获取 addToCart 方法
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    fetch('/api/ProductList')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProductList(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []);

  const handleAddToCart = async (product) => {
    // 确保用户已经登录
    if (!currentUser) {
      alert('User must be logged in to add items to cart');
      return;
    }
      // 使用当前登录用户的ID
      const userId = currentUser.id;
    addToCart(product); // 添加到本地状态的购物车
    console.log('Add to cart:', product);
  

  
    try {
      const response = await fetch('/api/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`, // 假设使用token进行认证
        },
        body: JSON.stringify({
          userId: userId,
          productId: product.id,
          quantity: 1, // 或其他逻辑确定的数量
        }),
      });
  
      if (!response.ok) {
        throw new Error('Problem adding item to cart');
      }
  
      // 这里可以处理响应，比如确认消息
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <div className="product-list-container">
      <h1>Product List</h1>
      <div className="products">
        {products.map((product) => (
          <div key={product.id} className="product">
            <Link to={`/products/${product.id}`}>
              <img src={product.cover_image} alt={product.title} />
              <h3>{product.title}</h3>
            </Link>
            <p className="product-price">￡{product.price}</p>
            {/* 修改按钮点击事件，传递整个 product 对象而不仅仅是 productId */}
            <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
