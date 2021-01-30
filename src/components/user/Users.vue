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
          ><el-input placeholder="请输入内容"> <el-button slot="append" icon="el-icon-search"></el-button> </el-input
        ></el-col>
        <el-col :span="6">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#" > </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
           <template >
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import hub from '../../utils/hub'
export default {
  name: "",

  data() {
    return {
      userList: [],
      queryList: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      total: 0,
    };
  },
  created() {
    this.getUserList();
     hub.$emit('saveNavActive', '/users')
  },

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", { params: this.queryList });
      if (res.meta.status !== 200) return this.$message.error("获取用户列表失败!");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
  },
};
</script>

<style lang="less" scoped></style>
