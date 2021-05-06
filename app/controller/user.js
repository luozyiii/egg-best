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
}

module.exports = UserController;

