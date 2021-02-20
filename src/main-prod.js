import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import "./plugins/element.js";
//导入全局样式
import "./assets/css/global.css";
//导入fonts样式
import "./assets/fonts/iconfont.css";
// 导入tree_table依赖项
import treeTable from "vue-table-with-tree-grid";
Vue.component("tree-table", treeTable);
// 引入axios
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
//拦截器设置请求头必须携带token
axios.interceptors.request.use((config) => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.token;
  //注意一定要return
  return config;
});
Vue.prototype.$http = axios;
//时间过滤器
Vue.filter("dateFormat", function(originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");

  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});
//导入富文本
import quillEditor from "vue-quill-editor";
//导入富文本样式
// import "quill/dist/quill.core.css"; // import styles
// import "quill/dist/quill.snow.css"; // for snow theme
// import "quill/dist/quill.bubble.css"; // for bubble theme
Vue.use(quillEditor);

Vue.config.productionTip = false;
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
