// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useMemo,useEffect,createContext } from 'react';
import Home from './components/Home/Home';
import ProductList from './components/ProductList/ProductList';
import AuthorList from './components/AuthorList/AuthorList';
import UserProfile from './components/UserProfile/UserProfile';
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ProductDetail from './components/ProductDetail/ProductDetail'; 
import ChatInterface from './components/ChatInterface/ChatInterface';
import Cart from './components/Cart/Cart'; 
import Admin from './components/Admin/Admin';
import AddProduct from './components/AddProduct/AddProduct';
import EditProduct from './components/EditProduct/EditProduct';
import EditUsers from './components/EditUsers/EditUsers';
import UpdateProduct from './components/UpdateProduct/UpdateProduct';
import UpdateUser from './components/UpdateUser/UpdateUser';
import SearchResults from './components/SearchResults/SearchResults'; 
import Classify from './components/Classify/Classify';
import PostComment from './components/PostComment/PostComment';
import CommentsList from './components/CommentsList/CommentsList';
export const UserContext = React.createContext(null);
export const CartContext = React.createContext();
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const userContextValue = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser, setCurrentUser]);
  useEffect(() => {
    console.log('当前用户状态：', currentUser);
  }, [currentUser]); // 当 currentUser 更新时，这个 useEffect 会运行

  const addToCart = (product) => {
    
    setCartItems(prevCartItems => {
      const itemExists = prevCartItems.find(item => item.id === product.id);
      if (itemExists) {
      return prevCartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );} else {
        return [...prevCartItems, { ...product, quantity: 1 }];
      }});
      };
    const value = useMemo(() => ({ cartItems, addToCart }), [cartItems]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const removeFromCart = (productId) => {
      setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== productId));
    };

    return (
      <UserContext.Provider value={userContextValue}>
        <CartContext.Provider value={{ cartItems, addToCart ,removeFromCart }}>
          
          <Router>
            <div>
              <NavBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<UserProfile userId={currentUserId} />} />
                <Route path="/ProductList" element={<ProductList />} />
                <Route path="/classify" element={<Classify />} />
                <Route path="/CommentsList" element={<CommentsList />} />
                <Route path="/PostComment" element={<PostComment />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/authors" element={<AuthorList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/users" element={<UserProfile userId={currentUserId} />} />
                <Route path="/users/:id" element={<UserProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/cart" element={<Cart cartItems={cartItems} />} />
                <Route path="/admin" element={<Admin />}>
                  <Route index element={<AddProduct />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="edit-product" element={<EditProduct />} />
                  <Route path="edit-product/:id" element={<UpdateProduct />} />
                  <Route path="edit-users" element={<EditUsers />} />
                  <Route path="edit-users/:id" element={<UpdateUser />} />
                </Route>
                <Route path="/update-user/:id" element={<UpdateUser />} />
              </Routes>
            </div>
          </Router>
        </CartContext.Provider>
      </UserContext.Provider>
    );
}

export default App;

