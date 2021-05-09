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

## Egg.js 操作Mysql数据库

### 安装Mysql数据库
- windows
[windows10上安装mysql](https://blog.csdn.net/zhouzezhou/article/details/52446608)
[navicat_for_mysql](https://www.cnblogs.com/william-dai/p/12784619.html)

- mac
```
// 安装
brew install mysql
// 遇到问题 brew版本低，mac os 版本低，xcode版本低不支持下载； 都更新一遍才安装上mysql; 最后 mac os 13.1, xcode 12.5, mysql 8
// 安装后-> 去到系统偏好设置找到mysql, ->  我选择了use strong password encryption 强密码模式， egg-mysql 连接不上，报错用工具nacicat 能连上数据；重新选择 Use Legacy Password Encryption 才可连接上。
```
[navicat](https://www.macwk.com/soft/navicat-premium?__cf_chl_jschl_tk__=bcf60bc1145838338fc0192159d4ab4747a2cd78-1620482097-0-AZGUupDdI0N1q6UGh45rDNCJj1O93BCTT-dir5BJ0nVxQvC2Q-hs6xQ8CgwD7y_LFNpQ0LN3pUzYLYNDu2ScXbJ0z8ZQL4QGU76ZFCHsJJkpKufjBMwdU3up4lLnGypsmStQfAyCwZKEMRLKjWRzJdQfVocI_oezODLeoNptaX7ldHaxTuZ5z6R_EbOe4JIYnYvxj6Csi5wBg3lgQhYQLNlN35CKkBsPwsnwzLCo8FlQiWykjjtfIyvO2iEU72dHW5oQZPTBobBxOy0R1pQ9dAuEJ1rPqqW17clYttLq4AvRNmgwqEgAcoWcggOzOw59QBsoY9PcMVrV0qJdKJ4fk_SR-UemroVHDPJhehYvNK65k7WRW-C-a_OSYSoebTou3z8KibFeLuzKV9JNEZ0FDyA)

### Mysql入门，基础增删改查操作
/demo.sql

### 使用egg-mysql插件操作数据库 (中小型业务需求,不适合分页，多表联查)
```
// 安装 
yarn add egg-mysql

// plugin 配置
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

// config.default.js 配置
config.mysql = {
  app: true,
  agent: false,
  client: {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'luo924361501',
    database: 'egg',
  },
};

```

- 实践
```
/app/controller/user.js
/app/service/user.js
```

### Egg.js 中使用 Sequelize 操作 mysql 数据库
```
// 安装
yarn add egg-sequelize mysql2

// plugin 配置
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

// config.default.js 配置
config.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'luo924361501',
  database: 'egg',
  define: {
    timestamps: false,
    freezeTableName: true,
  },
};

// app 下 新建文件夹model/user.js 模型

'use strict';
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(20),
    pwd: STRING(50),
  });
  return User;
};

// 实践 /app/service/user.js
增删改查

```