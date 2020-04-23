# idcard-web

> A Vue.js project
#CROS问题：
修改src/api/index.js中root,配置webconfig的proxy
参考：https://www.cnblogs.com/web-record/p/9467258.html
#瞎写的并不规范
脚手架是vue-cli 3.0
用了iview库、axios、vue-router
axios未改造完全
路由这块基本完善，使用了嵌套，动态
各组件的样式还要继续改

## Build Setup

``` bash
# install dependencies
cnpm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


##src
``` bash
#├── App.vue                         // APP入口文件
#├── api                             // axios接口调用工具文件夹
#│   └── index.js                    // axios接口调用工具
#├── components                      // 组件文件夹
#|     ├──activityAdd.vue				// 添加活动的表单组件
#|     ├──activityCard.vue				// 展示活动点击进入统计
#|     ├──activityDetails.vue			// 活动详情，由此进入签到/评分界面
#|     ├──activityRevised.vue			// 活动信息修改
#|     ├──activityStat.vue			// 统计模块
#|     ├──administerAdd.vue			// 管理员添加
#|     ├──footer
#|     ├──header
#|     ├──Menue.vue					// 横向主菜单
#|     ├──StudentItem.vue				// 展示修改学生列表
#|     ├──studentsListToAdd.vue		// 添加学生
#|     └── toSelectActivity.vue			// 选择活动并转到活动详情界面
#├── config                          // 项目配置文件夹
#│   └── index.js                    // 项目配置文件
#├── frame                           // 子路由文件夹
#│   ├── frame.vue                   // 评分组件
#|   └── content.vue			  // 签到核心组件
#├── main.js                         // 项目配置文件
#├── page                              // 我们的页面组件文件夹 
#│   ├── accounts.vue             	// 账户管理 二级路由
#│   ├── activity.vue					// 活动管理 二级路由
#│   ├── base.vue					// 主页面 一级路由
#│   ├── login.vue					// 登录组件 一级路由
#│   ├── toSignUp.vue				// 选择活动签到 二级路由
#│   └── index.vue                   // test
#├── router                          // 路由配置文件夹
#│   └── index.js                    // 路由配置文件 组件是第三级路由
#├── style                           // scss 样式存放目录
#│   ├── base                        // 基础样式存放目录
#│   │   ├── _base.scss         	 	// 基础样式文件
#│   │   ├── _color.scss     			// 项目颜色配置变量文件
#│   │   ├── _mixin.scss    			 // scss 混入文件
#│   │   └── _reset.scss     			// 浏览器初始化文件
#│   ├── scss                        // 页面样式文件夹
#│   │   ├── _content.scss       	// 内容页面样式文件
#│   │   └── _index.scss     		// 列表样式文件
#│   └── style.scss              	// 主样式文件
#└── utils                           // 常用工具文件夹
     └── index.js                    // 常用工具文件
```
## static
``` bash
#├── json             			// axios测试
#├── css             // 放一些第三方的样式文件
#├── font                // 放字体图标文件
#├── image           // 放图片文件，如果是复杂项目，可以在这里面再分门别类
#└── js              // 放一些第三方的JS文件，如 jquery
```
