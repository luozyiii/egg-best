'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 数据库查询
  async lists() {
    try {
      const { app } = this;
      const res = await app.mysql.select('user');
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async detail(id) {
    return {
      id,
      name: 'leslie',
      age: 18,
    };
  }

  // 通过id查询数据
  async detail2(id) {
    try {
      const { app } = this;
      const res = await app.mysql.get('user', { id });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 数据库新增数据
  async add(params) {
    try {
      const { app } = this;
      const res = await app.mysql.insert('user', params);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 数据库修改数据
  async edit(params) {
    try {
      const { app } = this;
      const res = await app.mysql.update('user', params);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 删除数据
  async delete(id) {
    try {
      const { app } = this;
      const res = await app.mysql.delete('user', { id });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
