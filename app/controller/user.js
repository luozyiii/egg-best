'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  encode(str = '') {
    return new Buffer(str).toString('base64');
  }
  decode(str = '') {
    return new Buffer(str, 'base64').toString();
  }
  // egg 框架强制 controller 内的方法都是异步方法
  async index() {
    const { ctx } = this;
    // ctx.body = 'user index';
    const user = ctx.cookies.get('user');

    // 获取session
    const session = ctx.session.user;
    const zhSession = ctx.session.zh;
    console.log('session:', session, zhSession);

    // ctx.cookies.set('zh', '测试'); // 报错
    // 方案一： 加密/解密
    ctx.cookies.set('zh', '测试', {
      encrypt: true,
    });
    const zh = ctx.cookies.get('zh', {
      encrypt: true,
    });
    console.log(zh);

    // 方案二: base64
    ctx.cookies.set('base64', this.encode('中文base64'));
    const base64 = this.decode(ctx.cookies.get('base64'));
    console.log(base64);


    await ctx.render('user.html', {
      id: 100,
      name: 'admin',
      list: [ 'html', 'js', 'css' ],
      user: user ? JSON.parse(user) : null,
      zh,
      base64,
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

  // login
  async login() {
    const { ctx } = this;
    const body = ctx.request.body;
    ctx.cookies.set('user', JSON.stringify(body), {
      maxAge: 1000 * 60 * 10,
      // httpOnly: false,
    });
    // 保存session
    ctx.session.user = body;
    ctx.session.zh = '中文测试';
    ctx.body = {
      status: 200,
      data: body,
    };
  }

  // logout
  async logout() {
    const { ctx } = this;
    ctx.cookies.set('user', null);

    // 清除session
    ctx.session.user = null;
    ctx.session.zh = null;
    ctx.body = {
      status: 200,
    };
  }
}

module.exports = UserController;

