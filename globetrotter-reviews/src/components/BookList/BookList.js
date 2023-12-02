//Booklist.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 导入Link组件
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('/api/books')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();  // 解析JSON格式的响应数据
      })
      .then((data) => {
        console.log('Books data:', data); // 确保这里打印的数据包含了正确的书籍信息
        setBooks(data); // 更新状态
      })
      .catch((error) => {
        console.error('Fetch error:', error); // 更改了日志输出
      });
  }, []); // 空依赖数组意味着这个effect只会在组件挂载后运行一次

  // 组件的其余部分不变

  return (
    <div className="book-list-container">
      <h1>Book List</h1>
      <div className="books">
        {books.map((book) => (
          <div key={book.id} className="book">
            <Link to={`/books/${book.id}`}> {/* 使用Link组件包装图片和标题 */}
              <img src={book.cover_image} alt={book.title} />
              <h3>{book.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
