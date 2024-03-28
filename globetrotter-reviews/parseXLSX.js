const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs'); // 引入fs模块

// 指定文件路径
const filePath = path.resolve(__dirname, '2.xlsx'); // 确保这里的路径指向您的xlsx文件

// 读取xlsx文件
const workbook = XLSX.readFile(filePath);

// 获取工作表的第一个sheet
const sheetName = workbook.SheetNames[0]; // 这里是正确的使用方式
const sheet = workbook.Sheets[sheetName];

// 将工作表数据转换为JSON对象数组
const data = XLSX.utils.sheet_to_json(sheet);

// 将处理过的数据保存为JSON文件
const outputFilePath = path.resolve(__dirname, 'Chinese_processed_data.json');
fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2)); // 美化JSON输出

console.log(`Processed data saved to ${outputFilePath}`);
