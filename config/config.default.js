/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1620301657564_1710';

  // add your middleware config here
  config.middleware = [];

  // 学习阶段暂时关闭csrf 防御
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
    },
    // root: path.join(appInfo.baseDir, 'app/html'), // 自定义模板目录 root还支持数组 [path.join(appInfo.baseDir, 'app/html'), path.join(appInfo.baseDir, 'app/view')]
  };

  config.ejs = {
    delimiter: '%', // 全局修改分隔符
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
