'use strict';

module.exports = options => {
  console.log('options', options);
  return async (ctx, next) => {
    const url = ctx.request.url;
    console.log('url', url);
    const user = ctx.session.user;

    if (!user && !options.exclude.includes(ctx.request.url.split('?')[0])) {
      ctx.body = {
        status: 1001,
        errMsg: '用户未登录',
      };
    } else {
      await next();
    }
  };
};
