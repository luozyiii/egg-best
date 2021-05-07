## egg

### 控制器（controller）的使用和单元测试
- 目录： /app/controller/user
路由目录： /app/router.js
简单的说 Controller 负责解析用户的输入，处理后返回相应的结果，例如
(1) 在 RESTful 接口中，Controller 接受用户的参数，从数据库中查找内容返回给用户或者将用户的请求更新到数据库中。
(2) 在 HTML 页面请求中，Controller 根据用户访问不同的 URL，渲染不同的模板得到 HTML 返回给用户。
(3) 在代理服务器中，Controller 将用户的请求转发到其他服务器上，并将其他服务器的处理结果返回给用户。

- 单元测试
目录： /test/app/user.test.js
```
yarn test // 执行
```

- 实用vs code 插件 project-tpl
快速生成模版 
eg: 页面上输入controller, 选择该模版

### Egg.js 路由中get的请求方式处理和参数获取
分两种（/app/controller/user.js 下的detail 和 detail2）
单元测试 在 ／test/app/controller/user.test.js
```
// 一、http://127.0.0.1:7001/user/detail?id=123&name=leilie

ctx.query

// 二、http://127.0.0.1:7001/user/detail2/100
ctx.params
```

### Egg.js 路由中 post.put.delete等请求的处理及参数校验
- 暂时关闭csrf防御
```
// 学习阶段暂时关闭csrf 防御
  config.security = {
    csrf: {
      enable: false,
    },
  };
```

- post、put获取参数
```
ctx.request.body
```

- 利用postman 发起post请求

- egg-validate

```
// 安装
yarn add egg-validate

// 在/config/plugin.js增加配置
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
```
- 单元测试
单元测试 在 ／test/app/controller/user.test.js 
add、edit、del


### Egg.js 中 Service 服务和单元测试
service 在egg 上挂载到ctx(上下文)

- 目录
/app/service/user.js 在controller detaill 中应用

- 单元测试
/test/app/service/user.test.js
```
const ctx = app.mockContext();
const user = await ctx.service.user.detail(10);
assert(user);
assert(user.id === 10);
```

### Egg.js 中使用Ejs模板引擎
- 后端渲染由来已久，渲染性能得到业界的认可
- 利于SEO优化，对纯展示类网站体验较好
- 对前后端分离开发模式的补充（单点登录的登录页面）

```
yarn add egg-view-ejs // 安装

// 在config plugin.js 配置
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};


// 在 config.default.js 配置
config.view = {
  mapping: {
    '.html': 'ejs',
  },
};

config.ejs = {

};

// 应用 
/app/controller/user  index
/view/user.html

// 模板引擎的分隔符全局和局部配置
// 全局 config.default.js
config.ejs = {
  delimiter: '$', // 全局修改分隔符
};

// 局部配置
await ctx.render('user.html', {
  id: 100,
  name: 'admin',
  list: [ 'html', 'js', 'css' ],
}, {
  delimiter: '$',
});


// 模板引擎目录的配置
config.view = {
  mapping: {
    '.html': 'ejs',
  },
  root: path.join(appInfo.baseDir, 'app/html'), // 自定义模板目录 root还支持数组 [path.join(appInfo.baseDir, 'app/html'), path.join(appInfo.baseDir, 'app/view')]
};

```



