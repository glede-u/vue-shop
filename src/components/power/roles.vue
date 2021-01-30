<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand" > </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" > </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" > </el-table-column>
        <el-table-column  label="操作" width="300px"> 
           <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "roles",

  data() {
    return {
      rolesList: null,
    };
  },
  created() {
    this.getRolesList();
  },

  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("获取角色列表失败!");
      this.rolesList = res.data;
    },
  },
};
</script>

<style lang="less" scoped></style>
