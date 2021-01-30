<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input placeholder="请输入内容" v-model="queryList.query" clearable @clear="getUserList()"> <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button> </el-input
        ></el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="getEditUser(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryList.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryList.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      <!-- 添加用户添加弹框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户弹框 -->
      <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import hub from "../../utils/hub";
export default {
  name: "user",

  data() {
    //验证邮箱规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regEmail.test(value)) return callback();
      callback(new Error("邮箱验证失败"));
    };
    // 验证手机号
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (regMobile.test(value)) return callback();
      callback(new Error("手机号验证失败"));
    };

    return {
      userList: [],
      queryList: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      //添加用户数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户数据的校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //编辑用户的数据
      editForm: {},
      //编辑用户规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
    hub.$emit("saveNavActive", "/users");
  },

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", { params: this.queryList });
      if (res.meta.status !== 200) return this.$message.error("获取用户列表失败!");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryList.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPagenum) {
      this.queryList.pagenum = newPagenum;
      this.getUserList();
    },
    //监听el-switch 的change事件
    async userStateChange(userInfo) {
      // console.log(userInfo);
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      // console.log(res);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败!");
      }
      this.$message.success("更新用户状态成功");
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) return this.$message.error("登录失败!");
        this.$message.success("登录成功");
        this.getUserList();
        this.dialogVisible = false;
      });
    },
    // 编辑用户获得数据
    async getEditUser(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户失败!");
      }
      this.editForm = res.data;
    },
    //重置编辑弹出框
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //提交修改后的事件
    editUser(id) {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put("users/" + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile });
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户失败!");
        }
        this.getUserList();
        this.editDialogVisible = false;
        this.$message.success("更新用户成功!");
      });
    },
    //删除用户
    deleteUser(id) {
      this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        async (resolve) => {
          const { data: res } = await this.$http.delete("users/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
           //解决跳转删除bug
          if(document.querySelectorAll('.el-card tbody tr').length===1){
            this.queryList.pagenum=this.queryList.pagenum>1 ? this.queryList.pagenum-1:1
          }
          this.getUserList();
          this.$message.success("删除用户成功!");
         
        },
        (reject) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        }
      );
    },
  },
};
</script>

<style lang="less" scoped></style>
