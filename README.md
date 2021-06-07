# kb磁力前端
该vue项目是kb磁力的前端项目，基于kb磁力后端所开发的。用于提供用户登录页面，磁力信息管理，用户权限管理以及漫画爬虫
## 预览
* 前端已部署至[https://kbdog.github.io/magnet-system-web/](https://kbdog.github.io/magnet-system-web/)
* 后端可以自行部署进行数据访问，默认域名localhost，磁力链接管理端口8082，漫画端口8081
## 前言
* [kb磁力后端地址](https://github.com/KBdog/magnet-system)
* 该项目使用的是[@lin-xin](https://github.com/lin-xin)大佬的[vue-manage-system](https://github.com/lin-xin/vue-manage-system)模板
* 为了适应项目需求，本人对[vue-manage-system](https://github.com/lin-xin/vue-manage-system)模板中部分页面进行了修改，添加了用户信息管理页面、磁力信息管理页面、磁力收录情况、漫画爬虫页面
* components/page目录下的页面暂未使用
## 使用依赖
* `node.js`
* `vue.js`
## 功能介绍
1. 用户登录验证
2. 用户查询、编辑、删除、添加、权限管理
3. 记录磁力收录情况、复制磁力信息、磁力删除、磁力编辑、添加磁力、打印时段磁力报表
4. 根据漫画源抓取漫画简介、抓取漫画章节、抓取漫画图片集合
5. 漫画图片列表懒加载、图片预览
# 感谢
* [@lin-xin](https://github.com/lin-xin)的开源支持



