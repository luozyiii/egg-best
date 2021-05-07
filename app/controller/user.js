'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // egg 框架强制 controller 内的方法都是异步方法
  async index() {
    const { ctx } = this;
    // ctx.body = 'user index';
    await ctx.render('user.html', {
      id: 100,
      name: 'admin',
      list: [ 'html', 'js', 'css' ],
    });
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
    // console.log(ctx.query); // 在终端查看
    // ctx.body = ctx.query.id;
    const res = ctx.service.user.detail(10);
    console.log(res);
    ctx.body = ctx.query.id;
  }
  async detail2() {
    const { ctx } = this;
    // http://127.0.0.1:7001/user/detail2/100
    console.log(ctx.params);
    ctx.body = ctx.params.id;
  }

  // add user
  // post 请求 参数的获取
  async add() {
    const { ctx } = this;
    console.log(ctx.request.body);
    const rules = {
      name: { type: 'string' },
      age: { type: 'number' },
    };
    ctx.validate(rules); // 利用egg-validate 插件对参数进行校验
    ctx.body = {
      status: 200,
      data: ctx.request.body,
    };
  }

  // put 请求
  async edit() {
    const { ctx } = this;
    ctx.body = {
      status: 200,
      data: ctx.request.body,
    };
  }

  // delete 请求
  async del() {
    const { ctx } = this;
    ctx.body = ctx.request.body.id;
  }
}

module.exports = UserController;

