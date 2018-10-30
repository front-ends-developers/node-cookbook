'use strict';

// 简化示例，直接全局变量存储数据。
const frameworkList = [
  { name: 'Express', description: 'this is detail of Express', star: false },
  { name: 'Koa', description: 'this is detail of Koa', star: true },
  { name: 'Egg', description: 'this is detail of Egg', star: true },
];

// 列出数据
exports.list = function(req, res) {
  const data = {
    list: frameworkList,
  };
  res.status(200);
  res.json(data);
};

// 单个详情
exports.toggle = function(req, res) {
  // 上一个中间件的产物
  const { name, star } = req.body;

  // 查询找到 framework 对象，并更新状态
  const data = frameworkList.find(x => x.name === name);
  data.star = star;

  // 发送响应
  res.status(200);
  res.json(data);
};
