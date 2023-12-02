// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import BookList from './components/BookList/BookList';
import AuthorList from './components/AuthorList/AuthorList';
import UserProfile from './components/UserProfile/UserProfile';
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import BookDetail from './components/BookDetail/BookDetail'; // 同样，路径可能需要调整
import AddBook from './components/Addbook/Addbook';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/authors" element={<AuthorList />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Addbook" element={<AddBook />} /> 
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

