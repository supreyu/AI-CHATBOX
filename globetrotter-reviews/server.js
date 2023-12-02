// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


const app = express();
const port = 3001;
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'booktravel',
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('')
  },
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

app.use(bodyParser.json());

// 用户注册
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // 检查用户名或邮箱是否已存在
  const checkExistenceSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkExistenceSql, [username, email], (existenceErr, existenceResult) => {
    if (existenceErr) {
      console.error('Error checking user existence:', existenceErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (existenceResult.length > 0) {
      res.status(400).send('Username or email already exists');
      return;
    }

    // 用户不存在，可以注册
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error('Error hashing password:', hashErr);
        res.status(500).send('Internal Server Error');
        return;
      }

      const registerSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(registerSql, [username, email, hashedPassword], (registerErr, registerResult) => {
        if (registerErr) {
          console.error('Error registering user:', registerErr);
          res.status(500).send('Internal Server Error');
        } else {
          res.status(201).send('User registered successfully');
        }
      });
    });
  });
});

// 用户登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.length > 0) {
        const hashedPassword = result[0].password;
        bcrypt.compare(password, hashedPassword, (compareErr, isMatch) => {
          if (compareErr) {
            console.error('Error comparing passwords:', compareErr);
            res.status(500).send('Internal Server Error');
          } else {
            if (isMatch) {
              res.status(200).send('Login successful');
            } else {
              res.status(401).send('Invalid username or password');
            }
          }
        });
      } else {
        res.status(401).send('Invalid username or password');
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


//活动页面获取数据
// 获取所有活动的列表
app.get('/api/activities', (req, res) => {
  // 逻辑来从数据库获取数据
  const sql = 'SELECT * FROM activities';
  db.query(sql, (err, result) => {
    if (err) {
      // 如果数据库查询失败，返回500错误
      console.error('Error fetching activities:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // 成功获取数据后发送JSON响应
      res.json(result);
    }
  });
});



//获取书籍信息
app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM books WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching book details:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // 如果查询结果为空，则返回404错误
    if (result.length === 0) {
      res.status(404).send('Book not found');
      return;
    }
    // 发送查询到的书籍详情
    res.json(result[0]);
  });
});


// 获取书籍的评论
app.get('/api/books/:id/comments', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM comments WHERE bookId = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching comments for book:', err);
      res.status(500).send('Error fetching comments');
      return;
    }
    res.json(result);
  });
});

// 提交评论
app.post('/api/books/:id/comments', (req, res) => {
  const { id } = req.params;
  const { userId, content, rating } = req.body;
  const sql = 'INSERT INTO comments (userId, bookId, content, rating) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, id, content, rating], (err, result) => {
    if (err) {
      console.error('Error posting comment:', err);
      res.status(500).send('Error posting comment');
      return;
    }
    res.status(201).send('Comment posted');
  });
});


// 获取所有书籍列表
app.get('/api/books', (req, res) => {
  const sql = 'SELECT * FROM books;';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching books:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result);
  });
});


//作者列表的内容
app.get('/api/authors', (req, res) => {
  const sql = 'SELECT * FROM authors';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching authors:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result);
  });
});





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 设置目标路径为 public/images/cover/
    cb(null, path.join(__dirname, 'public/images/cover/'));
  },
  filename: function (req, file, cb) {
    // 设置文件名为字段名 + 时间戳 + 原始文件扩展名
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


// 然后创建 multer 实例
const upload = multer({ storage: storage });

app.post('/api/Addbook', upload.single('cover_image'), (req, res) => {
  // 获取表单提交的数据和文件信息
  const { title, author, description, type } = req.body;
  
  // 如果文件上传成功，使用相对路径
  const coverImagePath = req.file ? `/images/cover/${req.file.filename}` : '';

  // 构建 SQL 语句
  const sql = 'INSERT INTO books (title, author, description, type, cover_image) VALUES (?, ?, ?, ?, ?)';

  // 执行 SQL 插入
  db.query(sql, [title, author, description, type, coverImagePath], (err, result) => {
    if (err) {
      console.error('Error adding new book:', err);
      res.status(500).send('Error adding new book');
      return;
    }
    res.status(201).send({ message: 'New book added successfully', bookId: result.insertId });
  });
});






