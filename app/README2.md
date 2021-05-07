# Egg.js

## Egg.js 高阶--插件中间件的拓展

### 中间件
Egg 的中间件形式和 Koa 的中间件形式是一样的，都是基于洋葱圈模型。每次我们编写一个中间件，就相当于在洋葱外面包了一层。

- 目录 /app/middleware/* m1.js m2.js

- 配置 config.default.js
```
config.middleware = [ 'm1', 'm2' ];
```

- 访问
```
http://127.0.0.1:7001/
```

- 日志中间件 httpLog.js
(1) 引入时间库
```
yarn add dayjs
```
(2) fs.appendFileSync 写日志 
```
const fs = require('fs');
```
(3) config.default.js配置项 在中间件的使用
```
console.log(options); // config.default.js配置项
```
(4) 完整示例
```
'use strict';

const dayjs = require('dayjs');
const fs = require('fs');

module.exports = options => {
  return async (ctx, next) => {
    // console.log(ctx);
    console.log(options); // config.default.js配置项
    const sTime = Date.now();
    const startTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    const req = ctx.request;
    await next(); // 继续往下执行
    const log = {
      method: req.method,
      url: req.url,
      data: req.body,
      startTime,
      endTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      timeLength: Date.now() - sTime,
    };
    // console.log('log:', log);
    const data = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss') + '[httpLog]' + JSON.stringify(log) + '\r\n';
    fs.appendFileSync(`${ctx.app.baseDir}/logs/httpLog.log`, data);
  };
};
```

### 丰富的拓展方式
[框架拓展](https://eggjs.org/zh-cn/basics/extend.html)
/app/extend/*

- Application
方法拓展和属性拓展 /extend/application.js

- Context
方法拓展和属性拓展 /extend/context.js

- Request
属性拓展 /extend/request.js

- Response
属性拓展 /extend/response.js

- Helper
属性拓展 /extend/helper.js

### 插件
- 中间件更适合处理请求，插件可以处理业务逻辑。
- Egg.js的插件相当于一个微型应用
- 插件不包含router.js和controller控制器

- 目录
/lib/plugin/egg-auth
插件命名规则：egg- 开头；eg: egg-auth

- 启用插件
```
// /config/plugin.js
const path = require('path');

exports.auth = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-auth'),
};

//  额外的配置 /app.js
app.config.coreMiddleware.push('auth');

// config.default.js
// 插件auth 配置
config.auth = {
  exclude: [ '/home', '/user', '/login', '/logout' ],
};

```

### Egg.js 定时任务
- 定时上报应用状态，便于系统监控
- 定时从远程接口更新数据
- 定时处理文件（清除过期日志文件）

#### 编写获取本机系统信息插件egg-info
- 目录
/lib/plugin/egg-info

- 启用插件
```
// /config/plugin.js
const path = require('path');

exports.info = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-info'),
};
```

- 创建定时任务
目录：/app/schedule/get_info.js

```
'use strict';

// 定时任务：每隔3秒 打印本机状态信息
const Subscription = require('egg').Subscription;

class getInfo extends Subscription {
  static get schedule() {
    return {
      interval: 3000, // 每3秒执行一次
      // cron: '0 0 */3 * * *', // 每三小时准点执行一次
      type: 'worker',
    };
  }
  async subscribe() {
    const info = this.ctx.info;
    console.log(Date.now(), info);
  }
}

module.exports = getInfo;

```