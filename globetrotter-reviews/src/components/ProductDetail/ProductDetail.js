import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext , UserContext} from '../../App';
import './ProductDetail.css';
import CommentsList from '../CommentsList/CommentsList'; 
import PostComment from '../PostComment/PostComment';
const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]); // 新增状态来存储评论
  const { id } = useParams();
  const { addToCart } = useContext(CartContext); // 从 CartContext 获取 addToCart 方法
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product details:', error));
  }, [id]);

  
  // 获取评论信息
  useEffect(() => {
    fetch(`/api/products/${id}/comments`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error));
  }, [id]); // 注意：这里的依赖项是产品id，当id变化时会重新获取评论


    // 处理添加新评论
    const handleNewComment = (newComment) => {
      console.log('New comment:', newComment);
      setComments([...comments, newComment]);
    };
  const handleAddToCart = async () => {
    // 确保用户已经登录
    if (!currentUser) {
      alert('Please log in to add items to the cart.');
      return;
    }

    // 使用全局的 addToCart 方法来添加商品到购物车
    addToCart(product);

    try {
      // 使用当前登录用户的ID
      const response = await fetch('/api/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`, // 使用 token 进行认证
        },
        body: JSON.stringify({
          userId: currentUser.id,
          productId: product.id,
          quantity: 1, // 或者其他逻辑确定的数量
        }),
      });

      if (!response.ok) {
        throw new Error('Problem adding item to cart');
      }

      // 这里可以处理响应，比如确认消息
      console.log('Item added to cart successfully.');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const buyNow = () => {
    console.log('Buy now:', product.id);
    // 这里将调用立即购买的API
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-cover-and-info">
        <img src={product.cover_image} alt={product.title} className="product-cover" />
        <div className="product-info">
          <h2>{product.title}</h2>
          <p><strong>Price:</strong> {product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Type:</strong> {product.type}</p>
          <p><strong>Stock:</strong> {product.stock || 'In stock'}</p>
          <div className="product-actions">
            <button className="button" onClick={handleAddToCart}>Add to Cart</button>
            <button className="button" onClick={buyNow}>Buy Now</button>
          </div>
          <div className="product-detail-container">
            {/* ...原有的商品详情UI */}
            <CommentsList productId={id} currentUser={currentUser} comments={comments} />
            <PostComment productId={id} currentUser={currentUser} handleNewComment={handleNewComment} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
