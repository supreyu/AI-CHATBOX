const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors'); // 唯一声明cors的地方
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('./src/components/auth');

//const { trainAndSave, manager } = require('./nlpModel');
const { NlpManager } = require('node-nlp');

const app = express();
const port = 3001;
const OPENWEATHERMAP_API_KEY = '3ec8a937f9fb0cf1dce47dc8bba276f9';
app.use(cors()); 
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000' 
}));



// 创建与数据库的连接
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'booktravel',
  connectTimeout: 60000,
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

// 动态导入node-fetch
let fetch;
import('node-fetch').then(({default: importedFetch}) => {
    fetch = importedFetch;
    startServer();
}).catch(err => console.error('Failed to load node-fetch:', err));

function startServer() {
    // 天气预报API路由
    app.get('/api/weather', async (req, res) => {
      const { lat, lon } = req.query;
      if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing latitude or longitude' });
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        // 检查OpenWeatherMap API的返回状态
        if (data.cod !== 200) {
          return res.status(data.cod).json({ error: data.message });
        }

        // 成功获取天气信息后，返回给客户端
        res.json(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
      }
    });

    // 启动服务器
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}


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


app.get('/api/products', (req, res) => {
  const { type } = req.query; // 从查询参数中获取type
  db.query('SELECT * FROM product WHERE type = ?', [type], (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // 发送与type匹配的产品列表作为响应
  });
});



app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  
  // 根据userId查询购物车数据
  try {
    const [cartItems] = await db.promise().query('SELECT * FROM cart WHERE user_id = ?', [userId]);
    res.json({ items: cartItems });
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ message: 'Error fetching cart data' });
  }
});
app.post('/api/add-to-cart', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const userId = verifyToken(token);
  if (!userId) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const { productId, quantity } = req.body;
  try {
    // Check if the item is in the cart
    const [existingItem] = await db.promise().query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
    if (existingItem.length > 0) {
      // Number of updates
      await db.promise().query('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?', [quantity, userId, productId]);
    } else {
      // Insert new product
      await db.promise().query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity]);
    }
    res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});


const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'yugiegie';
// 用户登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    if (result.length > 0) {
      const user = result[0];
      bcrypt.compare(password, user.password, (compareErr, isMatch) => {
        if (compareErr) {
          console.error('Error comparing passwords:', compareErr);
          res.status(500).json({ message: 'Internal Server Error' });
          return;
        }
        if (isMatch) {
          // 用户验证成功，生成JWT令牌
          const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

          // 登录成功，将JWT令牌发送回客户端
          res.json({
            message: 'Login successful',
            token: token, // 发送JWT令牌
            userId: user.id,
            username: user.username,
            isAdmin: !!user.is_admin
          });
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
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



//获取商品
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM product WHERE id = ?';
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

// 搜索路由
app.get('/search', (req, res) => {
  // 获取查询参数
  const query = req.query.query;
  
  // 构建模糊搜索的SQL查询
  const searchSql = 'SELECT * FROM product WHERE title LIKE ? OR description LIKE ?';
  const searchTerms = [`%${query}%`, `%${query}%`]; // 使用模糊搜索
  
  // 执行查询
  db.query(searchSql, searchTerms, (err, results) => {
    if (err) {
      // 如果查询失败，返回错误
      console.error('Error performing search query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // 成功获取数据后发送JSON响应
      res.json(results);
    }
  });
});




// 获取产品评论
app.get('/api/products/:id/comments', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE product_id = ?';
  db.query(query, [productId], (error, results) => {
      if (error) throw error;
      res.json(results);
  });
});






// 发表评论并返回新评论的完整信息
app.post('/api/products/:id/comments', async (req, res) => {
  // 提取 token
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // 验证 token 并提取 userId
  const userId = verifyToken(token);
  if (!userId) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const productId = req.params.id;
  const { content } = req.body;

  try {
    // 将评论插入数据库
    const insertResult = await db.promise().query('INSERT INTO comments (user_id, product_id, content) VALUES (?, ?, ?)', [userId, productId, content]);

    // 获取新插入的评论信息
    const newCommentId = insertResult[0].insertId;
    const [newComment] = await db.promise().query('SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.id = ?', [newCommentId]);
    
    if (newComment.length > 0) {
      res.status(201).json(newComment[0]);
    } else {
      res.status(404).json({ message: 'Comment not found after insertion' });
    }
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ message: 'Error posting comment' });
  }
});


// 删除评论
app.delete('/api/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const query = 'DELETE FROM comments WHERE id = ?';
  db.query(query, [commentId], (error, results) => {
      if (error) throw error;
      res.json({ message: 'Comment deleted' });
  });
});

// 获取所有商品列表
app.get('/api/ProductList', (req, res) => {
  const sql = 'SELECT * FROM product;';
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



// 用户信息路由
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT username, email, birthday, gender FROM users WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      res.status(500).send({ message: '服务器错误', error: error.message });
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send({ message: '未找到用户' });
    }
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

app.post('/api/AddProduct', upload.single('cover_image'), (req, res) => {
  // 获取表单提交的数据和文件信息
  const { title, author, description, type } = req.body;
  
  // 如果文件上传成功，使用相对路径
  const coverImagePath = req.file ? `/images/cover/${req.file.filename}` : '';

  // 构建 SQL 语句
  const sql = 'INSERT INTO product (title, price, description, type, cover_image) VALUES (?, ?, ?, ?, ?)';

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




//自动回复功能
// 支持英语和中文
const manager = new NlpManager({ languages: ['en', 'zh'], forceNER: true });

const loadData = () => {
  try {
    // reading processed_data.json file
    const rawDataProcessed = fs.readFileSync('processed_data.json');
    const parsedDataProcessed = JSON.parse(rawDataProcessed);

    if (Array.isArray(parsedDataProcessed)) {
      parsedDataProcessed.forEach(item => {
        manager.addDocument('en', item.utterance, item.intent);
      });
    } else {
      throw new Error('Processed data is not in expected format.');
    }
  } catch (error) {
    console.error('Error during data loading:', error);
  }
};
//自动回复的内容
const intentReplies = {
  create_account: [
    "Just click that little 'Sign Up' button at the top right and you'll be part of the crew in no time! 😎",
    "Wanna dive into the adventure? Hit 'Sign Up' and let the journey begin! 🌟"
  ],
  delete_account: [
    "Wanna say goodbye? Head over to your settings and hit 'Delete', but hey, we'll miss you! 😢",
    "If it's time to move on, you can delete your account in settings. We hope you'll remember the good times! 🍃"
  ],
  edit_account: [
    "Need a fresh start? Spruce up your account details in settings! ✏️",
    "Change is good! Update your account info anytime, just head to your settings. 🔄"
  ],
  recover_password: [
    "Forgot your password? No worries, happens to the best of us! Just click on 'Forgot password' to reset it. 🔒",
    "Password slipped your mind? Hit up our password recovery to get back on track! 🕵️‍♂️"
  ],
  registration_problems: [
    "Hitting a snag with signing up? Make sure all the fields are filled out. If you're still stuck, our support team's got your back! 🤝",
    "Trouble at the sign-up stage? Double-check those details and if you're still in a pickle, our customer support is here to help! 🛠️"
  ],
  switch_account: [
    "Need a fresh view? Swap accounts on the login screen and see things from a different angle! 🔀",
    "Mixing things up? Just hop over to the login page to switch between accounts. Easy-peasy! 🔄"
  ],
  check_cancellation_fee: [
    "Curious about cancellation costs? Our refund policy has all the numbers crunched for you. 🧮",
    "Looking to bail out? Check out our refund policy for the lowdown on cancellation fees. 💸"
  ],
  contact_customer_service: [
    "Got questions? Our customer service heroes are ready to swoop in with answers! 🦸‍♂️🦸‍♀️",
    "In need of a chat? Our customer service team is here to talk it out, anytime! 🗨️"
  ],
  contact_human_agent: [
    "Robots not your thing? A human agent is just a message away for that personal touch. 👤",
    "Need a real conversation? Drop us a message and our human reps will get back to you, stat! 📬"
  ],
  delivery_options: [
    "Fast? Cheap? Eco-friendly? We've got delivery options to suit your pace and your conscience. 🚚💨🌿",
    "Choose your delivery destiny! Check our policy page to find the perfect fit for your parcel. 📦✨"
  ],
  complaint: [
    "We're all ears for your grievances. Drop us a complaint and we'll jump on it, pronto! 🏃‍♂️💨",
    "Not up to snuff? Let us know what's up through our contact form and we'll strive to make it right. ✍️👍"
  ],
  review: [
    "Your review's like a lighthouse guiding us through stormy seas—thanks for the beacon! 🏆🌟",
    "A massive thanks for your review! It's the compass that guides our ship! 🧭💖"
  ],
  // ... and so on for each intent
  get_invoice: [
    "Your invoice awaits! A couple of clicks in your account, and you'll have that precious paperwork. 📄✨",
    "Invoice mission? Log in, navigate to your order, and you'll find your treasure! 🗺️🔍"
  ],
  // ... continue in this pattern for the rest
  track_order: [
    "Order's on the move! Grab your tracking number and follow the journey on our site. 🛤️👀DPD: https://www.dpd.co.uk/service/   royal mail:https://www.royalmail.com/",
    "Got that tracking itch? Pop your order number on our tracker and watch its voyage! 🌐🔎DPD: https://www.dpd.co.uk/service/   royal mail:https://www.royalmail.com/"
  ],
  change_shipping_address: [
    "Need to reroute? Buzz our customer service ASAP and we'll redirect your delivery! 📭➡️",
    "New destination? Reach out to us before your order's on the move, and we'll take care of it. 🚚🔄"
  ],
  set_up_shipping_address: [
    "Plant your flag! Set your shipping address in the order process and claim your land. 🏡🚩",
    "Make your mark! Adding or tweaking your shipping address is a breeze when you're checking out. 🌬️📝"
  ],
};
const chineseIntentReplies = {
  抱怨: [
    "不开心呀？告诉我们吧，我们一定尽力解决！😣",
    "服务不满意？快来吐槽，我们等着改进！📝"
  ],
  编辑账户: [
    "想变个新模样？账户设置里随你编辑哦！✨",
    "资料更新，心情也更新，赶紧去账户设置看看吧！🔄"
  ],
  创建账户: [
    "加入我们，就差一步啦！右上角的'注册'按钮等你点击！🌟",
    "新的开始，从'注册'开始，快来成为我们的一员吧！🎉"
  ],
  付款问题: [
    "付款遇到障碍？检查一下信息，或者换个方式试试看！💳",
    "付款不顺？我们这里还有其他方案，总有一款适合你！🔄"
  ],
  改变顺序: [
    "订单想要改改？联系客服，我们帮你看看有什么办法！📞",
    "订单要调整？我们随时在这里帮忙哦！🔧"
  ],
  跟踪退款: [
    "退款去哪了？点这里看看它的旅行日志！🔍",
    "追踪退款就像打宝一样，点进订单详情开始探险吧！🗺️"
  ],
  恢复密码: [
    "密码丢了？别急，我们这有找回密码的魔法！🧙‍♂️",
    "忘记密码？点击这里，让我们帮你召唤回它！🔮"
  ],
  获得退款: [
    "钱包感到寂寞？访问订单，申请退款让它再次充实起来！💰",
    "退款申请只需一点点魔法，点这里快速实现！✨"
  ],
  获取发票: [
    "发票大搜寻！登录账户，就在订单详情等你哦！🔎",
    "需要证明你的购物冒险？发票下载就在账户里！🧾"
  ],
  检查发票: [
    "在'我的订单'里，你的所有宝贵记忆（发票）都保存好了！📚",
    "发票需要审核？不用担心，所有记录都在这里！📜"
  ],
  检查付款方法: [
    "如何支付？来看看我们接受的神秘付款方式！💳",
    "多彩的支付选项，为你的购物之旅增添便利！🌈"
  ],
  检查取消费: [
    "取消也要潇洒！看看我们的政策，了解一下可能的花费吧！📖",
    "取消订单，无压力。先了解一下我们的政策哦！🍃"
  ],
  检查退款政策: [
    "退款政策，知识就是力量！点这里了解更多！📚",
    "退款的疑问？我们的退款条款为你解答！💡"
  ],
  交付选项: [
    "想知道我们的快递飞毯有多快吗？点这里查看详情哦！🚚✨",
    "各种运送方式，为你的宝贝找到最快的路径！详情点这里！📦🏃‍♂️"
  ],
  交货期: [
    "不想等太久？我们也不想让你等！看看这里的交货政策，了解具体时刻。⏰",
    "马上查看我们的交付政策，让你的包裹快速起飞！🛫"
  ],
  联系客户服务: [
    "遇到难题了吗？客服小精灵随时待命，为你解忧！🧚‍♀️",
    "有问题？我们的客服队伍已经整装待发，等你来撩！📞"
  ],
  联系人_人类_代理: [
    "机器人回答不了？没关系，真人客服将接管对话，为你排忧解难！🙋‍♂️🙋‍♀️",
    "需要人工智能之外的智能？点击这里，真人客服马上和你聊！👨‍💼👩‍💼"
  ],
  切换账户: [
    "就像变换面具一样切换账户，点这里轻松转换！🎭",
    "换个新面孔？在登录页面切换账号，体验不同的我！🔄"
  ],
  追踪订单: [
    "你的宝贝在哪里？用订单号在这里追踪它的足迹吧！📍DPD: https://www.dpd.co.uk/service/   royal mail:https://www.royalmail.com/",
    "订单追踪如探宝，每个环节都不放过！点进来看看！🔍DPD: https://www.dpd.co.uk/service/   royal mail:https://www.royalmail.com/"
  ],
  取消订单: [
    "改变主意了？在这里取消订单，就像按下撤销键那样简单！🔙",
    "想取消订单？速速前往订单页面，一键搞定！🆗"
  ],
  删除账户: [
    "决定要离开我们了吗？我们会想你的！点这里删除账户。👋😢",
    "删除账户就如同翻篇，祝你未来一切顺利！点击这里操作。📖🍀"
  ],
  设置送货地址: [
    "新的起点，新的送货地址！来这里设置你的下一个目的地吧！🏠✏️",
    "添加或修改送货地址，为你的购物旅程定好新航标！📍✨"
  ],
  审查: [
    "你的评价如同星光，指引我们前行。感谢你的反馈！🌟",
    "听到你的声音我们很开心！你的评价对我们来说非常宝贵。💎"
  ],
  通讯订阅: [
    "最新优惠，第一时间掌握！赶快订阅我们的通讯吧！📬",
    "想得到最热的新闻和最酷的优惠？点这里订阅通讯！💌"
  ],
  下订单:[
    "轻触这里下单，让我们迅速把幸福送到你手上！🛍️",
    "把喜欢的都放进购物车，我们来完成你的心愿清单！🎁"
  ],
  修改配送地址: [
    "变心了？赶快在订单飞出去前，联系我们更改地址！🏠",
    "新的起点？告诉我们你的新地址，我们不让每一份礼物迷路！🧭"
  ],
  注册问题:  [
    "注册遇到障碍？我们在这里帮你一把，快联系客服吧！🆘",
    "想成为我们的一员遇到困难？别担心，客服小哥哥小姐姐来帮忙！💁‍♀️💁‍♂️"
  ],
};
const getReplyForIntent = (intent, language) => {
  // 根据语言选择合适的回复集
  const repliesForIntent = language === 'zh' ? chineseIntentReplies[intent] : intentReplies[intent];
  
  if (!repliesForIntent) return language === 'zh' ? "对不起，我不明白您的问题。" : "I'm a bit puzzled by what you're asking. Could you tell me more? 🤔";

  // 随机选择一个回复模板
  const randomIndex = Math.floor(Math.random() * repliesForIntent.length);
  return repliesForIntent[randomIndex];
};

// 示例：获取'create_account'意图的回复
const reply = getReplyForIntent('create_account');
console.log(reply); // 输出一个随机的创建账户回复模板


// 加载中文数据
const loadChineseData = () => {
  try {
    const rawDataProcessedZh = fs.readFileSync('Chinese_processed_data.json');
    const parsedDataProcessedZh = JSON.parse(rawDataProcessedZh);

    if (Array.isArray(parsedDataProcessedZh)) {
      parsedDataProcessedZh.forEach(item => {
        manager.addDocument('zh', item.utterance, item.intent);
        // 如果您有中文答案，也可以在这里添加
        // manager.addAnswer('zh', item.intent, item.answer);
      });
    } else {
      throw new Error('Processed data for Chinese is not in expected format.');
    }
  } catch (error) {
    console.error('Error during Chinese data loading:', error);
  }
};
const trainAndSave = async () => {
  loadData();// 加载英文数据
  loadChineseData(); // 加载中文数据
  await manager.train();
  manager.save('model.nlp');
};

trainAndSave().then(() => {
  console.log('NLP training complete.');
}).catch((error) => {
  console.error('NLP training failed:', error);
});

// 聊天API端点
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    if (!manager.isLoaded) {
      await manager.load('model.nlp');
    }

    // The message is processed using NlpManager and the language is taken from the result
    const response = await manager.process(message);
    const language = response.localeIso2; 

    // The appropriate set of responses is selected based on the detected language
    let reply; 
    const replies = language === 'zh' ? chineseIntentReplies : intentReplies;
    reply = getReplyForIntent(response.intent, language);

    res.json({ reply });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).send('Error processing your message');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




//管理员页面

// 删除产品
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM product WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Error deleting product');
    } else {
      res.status(200).send('Product deleted successfully');
    }
  });
});



// 更新产品
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { title, price, type, stock } = req.body;
  const sql = 'UPDATE product SET title = ?, price = ?, type = ?, stock = ? WHERE id = ?';

  db.query(sql, [title, price, type, stock, id], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).send('Error updating product');
    } else {
      res.status(200).send('Product updated successfully');
    }
  });
});





// 获取所有用户的信息
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(result);
  });
});

// 删除特定用户
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Error deleting user');
      return;
    }
    res.status(200).send('User deleted successfully');
  });
});

// 更新特定用户的信息
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, birthday, gender, is_admin } = req.body;
  const sql = 'UPDATE users SET username = ?, email = ?, birthday = ?, gender = ?, is_admin = ? WHERE id = ?';

  db.query(sql, [username, email, birthday, gender, is_admin, id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).send('Error updating user');
    } else {
      res.status(200).send('User updated successfully');
    }
  });
});




