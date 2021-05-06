'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // egg 框架强制 controller 内的方法都是异步方法
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async demo() {
    const { ctx } = this;
    ctx.body = 'demo page';
  }
}

module.exports = HomeController;
