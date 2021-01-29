import Vue from 'vue'
import VueRouter from 'vue-router'
//引人login单文件
import Login from '../components/login.vue'
//引入home单文件
import home from '../components/home.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {path:'/home',component:home}
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫 参数to代表要去的路由 from代表来的路由 next是一个函数 代表放行 next(/login)代表强制跳转到login页面 
router.beforeEach((to,from,next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
