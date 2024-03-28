//自动回复
// 示例的静态回复模板
const replyTemplates = {
    orderStatus: "您的订单正在处理中，预计发货时间是...",
    returnPolicy: "我们的退货政策允许在购买后30天内无理由退货。",
    // 添加更多模板...
  };
  
  // 简单的自然语言处理函数来选择回复模板
  function getReply(message) {
    if (message.includes("订单状态")) {
      return replyTemplates.orderStatus;
    } else if (message.includes("退货政策")) {
      return replyTemplates.returnPolicy;
    } 
    // 添加更多条件...
    return "对不起，我没有找到关于这个问题的信息。";
  }
  
  // 聊天API端点
  app.post('/api/chat', (req, res) => {
    console.log('Chat request received:', req.body);
    const { message } = req.body;
    const reply = getReply(message);
    res.json({ reply });
  });
  
  // 这将在服务器启动时训练模型，您也可以选择在其他时机调用它
  trainAndSave();
  
  app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const response = await manager.process('en', message);
    let reply = '';
    if (response.answer) {
      reply = response.answer;
    } else {
      reply = "Sorry, I don't understand your question.";
    }
    res.json({ reply });
  });
  