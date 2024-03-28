import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../App';
import CategoryBar from './CategoryBar'; // 假设你已经有了这个组件
import './CategoryBar.css';
import { categories } from './categoriesData'; // 假设你的分类数据

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    console.log('Added to cart:', product);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // 过滤产品列表以显示选定分类的产品
  const filteredProducts = products.filter((product) => {
    return selectedCategory === 'All' || product.type === selectedCategory;
  });

  return (
    <div>
      <CategoryBar categories={categories} onCategoryClick={handleCategoryClick} />
      <div className="product-list-container">
        <h1>Product List</h1>
        <div className="products">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product">
              <Link to={`/products/${product.id}`}>
                <img src={product.coverImage} alt={product.title} />
                <h3>{product.title}</h3>
              </Link>
              <p className="product-price">{product.price}</p>
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
