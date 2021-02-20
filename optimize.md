 ## 项目优化
 ### 1.进度条优化
 .通过插件nprogress 
 ### 2.在执行bind打包命令的时候移除所有conglog()
 ### 3.生成打包报告
 .通过vue.config.js文件对webpack进行配置,通过chainwebpack把发布和开发进行分离main.js进行入口分别

 .通过externals对有选择的对一些运行依赖排除打包.利用cdn服务线上资源进行减少bind打包的体积
 ### 4.路由懒加载
 .进行对路由进行配置达到渲染页面时候对应相应的路由
 
