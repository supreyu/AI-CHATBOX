import './Addbook.css';
import React, { useState } from 'react';

const Addbook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    type: '',
    cover_image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: name === 'cover_image' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    for (const key in formData) {
      if (key === 'cover_image' && formData[key]) {
        // 确保文件对象存在时才添加到FormData中
        data.append(key, formData[key], formData[key].name);
      } else if (formData[key] != null) {
        // 只有当字段不为空时才添加到FormData中
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('/api/Addbook', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        // 如果响应状态码不是2xx的成功状态，则抛出错误
        const errorDetails = await response.text(); // 或者 response.json() 如果服务器返回JSON格式的错误
        throw new Error(`HTTP ${response.status}: ${errorDetails}`);
      }

      alert('书籍添加成功！');
      // 如果需要，可以在这里重置表单
    } catch (error) {
      // 如果有错误发生，则显示错误消息
      alert(`添加书籍失败: ${error.message}`);
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
      <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
      <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
      <input type="file" name="cover_image" onChange={handleChange} placeholder="Cover Image" />
      <button type="submit">Add Book</button>
    </form>
  );

};

export default Addbook;
