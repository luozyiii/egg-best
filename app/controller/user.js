'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // egg 框架强制 controller 内的方法都是异步方法
  async index() {
    const { ctx } = this;
    ctx.body = 'user index';
  }

  async lists() {
    const { ctx } = this;
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
    ctx.body = [{ id: 123 }];
  }

  // get 请求的处理方式; 获取参数
  async detail() {
    const { ctx } = this;
    // http://127.0.0.1:7001/user/detail?id=123&name=leilie
    // 获取参数id和name
    console.log(ctx.query); // 在终端查看
    ctx.body = ctx.query.id;
  }
  async detail2() {
    const { ctx } = this;
    // http://127.0.0.1:7001/user/detail2/100
    console.log(ctx.params);
    ctx.body = ctx.params.id;
  }
}

module.exports = UserController;

