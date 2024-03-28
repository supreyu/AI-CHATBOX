// src/components/EditProduct/EditProduct.js
import React, { useState, useEffect } from 'react';
import './EditProduct.css'; // 确保你有相应的CSS文件
import { useNavigate } from 'react-router-dom';


function EditProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // 添加这行

  useEffect(() => {
    // 获取所有产品信息
    fetch('/api/ProductList')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const deleteProduct = (id) => {
    // 弹出确认对话框
    if (window.confirm('Determine whether to delete the product？')) {
      // 如果用户确认删除，发送删除请求到后端
      fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            // 如果后端删除成功，更新前端产品列表状态
            setProducts(products.filter(product => product.id !== id));
          } else {
            console.error('Error deleting product');
          }
        })
        .catch(error => console.error('Error deleting product:', error));
    }
    // 如果用户取消，不执行任何操作
  };

  //编辑跳转链接
  const handleEdit = (id) => {
    // 使用navigate跳转到UpdateProduct页面，并传递产品ID
    navigate(`/admin/edit-product/${id}`);
  };
  

  return (
    <div className="product-table">
      <table>
        <thead>
          <tr>
            <th>Commodity</th>
            <th>Price</th>
            <th>Types</th>
            <th>inventory</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.type}</td>
              <td>{product.stock}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(product.id)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditProduct;