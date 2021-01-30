<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togglechange">|||</div>
        <!-- collapse这是element提供的是否折叠  router开启路由模式 default-active的值是对应的index值的时候能保持高亮 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active='activePath'>
          <!-- 一级菜单 -->
          <el-submenu :index='item.id+""'  v-for="item in menulist" :key="item.id" >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <!-- 给每一个子菜单注册点击事件,然后把index的值保证到本地存储中 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" 
            @click="saveNavActive('/'+subItem.path)" >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import hub from '../utils/hub'
export default {
  name: "",
  created () {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
     // 定义一个事件监听，事件监听里面做 2 件事情，改变 activePath 和 本地的 sessionStorage,利用事件处理中心监听saveNavActive事件
    hub.$on('saveNavActive', this.saveNavActive)
  },
  beforeDestroy(){
   // 移除事件监听，防止监听多次
    hub.$off('saveNavActive')
  },
  data() {
    return {
      menulist:[],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
      
    };
  },

  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    togglechange(){
      this.isCollapse = ! this.isCollapse
    },
    saveNavActive(path){
      window.sessionStorage.setItem('activePath',path)
      this.activePath= window.sessionStorage.getItem('activePath')
    }
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eee;
}
.home_container {
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
