import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext, UserContext } from '../../App'; // 确保路径正确
import './SearchResults.css'; // 假设你创建了一个CSS文件来样式化搜索结果

function SearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const { addToCart } = useContext(CartContext); // 使用 useContext 获取 addToCart 方法
  const { currentUser } = useContext(UserContext); // 在组件顶层获取 currentUser

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query');
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:3001/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [location]);

  const handleAddToCart = async (product) => {
    // 在这个函数中直接使用 currentUser 而不是再次调用 useContext
    if (!currentUser) {
      alert('Please log in to add items to the cart.');
      return;
    }
    
    const userId = currentUser.id;
    addToCart(product); // 更新全局状态的购物车
  
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
  
      console.log('Item added to cart successfully.');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // 渲染搜索结果
  return (
    <div className="search-results-container">
      {results.map(result => (
        <div key={result.id} className="search-result-item">
          <img src={result.cover_image} alt={result.title} className="search-result-cover" />
          <div className="search-result-info">
            <h2>{result.title}</h2>
            <p><strong>Price:</strong> {result.price}</p>
            <p><strong>Description:</strong> {result.description}</p>
            <div className="search-result-actions">
              <button className="button" onClick={() => handleAddToCart(result)}>Add to Cart</button>
              {/* 这里可以添加立即购买的逻辑 */}
              <button className="button">Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
