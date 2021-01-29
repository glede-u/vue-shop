<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/mi.png" alt="" />
      </div>
      <!-- from表单 -->
      <el-form ref="loginFormRefs" :model="loginForm" :rules="loginRules" class="form_box">
        <!-- 登录 -->
        <el-form-item prop="username" >
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
         <el-form-item  prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
         <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",

  data() {
    return {
      loginForm:{
        username:'admin',
        password:'123456'
      },
      loginRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 17, message: '长度在 2 到 17 个字符', trigger: 'blur' }
        ],
        password:[
           { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6 到 21 个字符', trigger: 'blur' }
        ]
      }
    };
  },

  methods: {
    resetLoginFrom(){
      //element里面的formmethods的方法,进行重置
      this.$refs.loginFormRefs.resetFields()
    },
    login(){
     //element里面的formmethods的方法进行登录前预校验
     this.$refs.loginFormRefs.validate(async valid=>{
       if(! valid) return ;
       const {data:res}=await this.$http.post('login',this.loginForm)
       if(res.meta.status!==200) return this.$message.error('登录失败!')
       this.$message.success('登录成功')
       //储存token
       window.sessionStorage.token=res.data.token
       this.$router.push('/home')
     })
    }
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
};
.form_box{
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
 
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
