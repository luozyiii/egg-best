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
