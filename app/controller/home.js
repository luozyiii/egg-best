'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // egg 框架强制 controller 内的方法都是异步方法
  async index() {
    const { ctx } = this;
    const res = await ctx.service.user.detail(20);
    console.log(res);
    ctx.body = res;
    // ctx.body = 'hi, egg';
  }
  async demo() {
    const { ctx } = this;
    ctx.body = 'demo page';
  }

  // Application 拓展
  async newApplication() {
    const { ctx, app } = this;
    const packageInfo = app.package();
    console.log('packageInfo:', packageInfo);
    const allPack = app.allPackage;
    console.log('allPack:', allPack);
    ctx.body = 'newApplication';
  }

  // Context 拓展
  async newContext() {
    const { ctx } = this;
    const params = ctx.params();
    console.log(params);
    ctx.body = 'newContext';
  }

  // Request 拓展
  async newRequest() {
    const { ctx } = this;
    const token = ctx.request.token;
    ctx.body = token;
  }

  // Response 拓展
  async newResponse() {
    const { ctx } = this;
    ctx.response.token = 'abc123'; // 在浏览器的网络请求面板 Response Headers 查看
    const base64Parse = ctx.helper.base64Encode('newResponse');
    ctx.body = base64Parse;
  }
}

module.exports = HomeController;
