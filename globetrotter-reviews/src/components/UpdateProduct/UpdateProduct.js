//UpdateProjuct.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ title: '', price: '', type: '', stock: '' });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    .then(response => {
      if (response.ok) {
        alert('Product updated successfully');
        navigate('/admin/edit-product');
      } else {
        alert('Failed to update product');
      }
    })
    .catch(error => {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product');
    });
  };
  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleInputChange}/>
        </label>
        <br />
        <label>
            Price:
            <input type="text" name="price" value={product.price} onChange={handleInputChange} />
        </label>
        <br />
        <label>
            Type:
            <input type="text" name="type" value={product.type} onChange={handleInputChange} />
        </label>
        <br />
        <label>
            Stock:
            <input type="number" name="stock" value={product.stock} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;