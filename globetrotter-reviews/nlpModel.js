// nlpModel.js
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], forceNER: true });

// Add intent and example statements
manager.addDocument('en', 'What is the status of my order?', 'order.status');
manager.addDocument('en', 'Can you check my order status?', 'order.status');
manager.addDocument('en', 'I want to return my product', 'return.policy');
manager.addDocument('en', 'How can I return an item?', 'return.policy');

// Adding entities
manager.addNamedEntityText(
  'order.status',
  'orderNumber',
  ['en'],
  ['123456', 'A0001', 'B2345'],
);

//Add a reply
manager.addAnswer('en', 'order.status', 'Your order is being processed and will be shipped soon.');
manager.addAnswer('en', 'return.policy', 'Our return policy allows you to return products within 30 days without any reason.');

// Add a response to the entity
manager.addAnswer('en', 'order.status', 'The status of order {{orderNumber}} is: In transit.');

// Train and save the model
async function trainAndSave() {
  await manager.train();
  manager.save('model.nlp');
}

// 暴露函数以便外部调用
module.exports = { trainAndSave, manager };
