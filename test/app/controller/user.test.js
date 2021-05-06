'use strict';

const { app } = require('egg-mock/bootstrap');

describe('user test', () => {
  // 同步
  it('user index', () => {
    return app.httpRequest().get('/user').expect('user index');
  });
  // 异步
  it('user lists', async () => {
    await app.httpRequest().get('/user/lists').expect(200)
      .expect('[{"id":123}]');
  });
});
