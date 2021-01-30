<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input placeholder="请输入内容"> <el-button slot="append" icon="el-icon-search"></el-button> </el-input
        ></el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="RightList" style="width: 100%" border stripe>
        <el-table-column prop="authName" label="权限名称" > </el-table-column>
        <el-table-column prop="path" label="路径" > </el-table-column>
        <el-table-column prop="level" label="权限等级"> 
          <template slot-scope="scope">
           <el-tag v-if="scope.row.level==='0'" >一级权限</el-tag>
          <el-tag type="success" v-else-if="scope.row.level==='1'">二级权限</el-tag>
          <el-tag type="warning" v-else-if="scope.row.level=='2'">三级权限</el-tag>
          </template>

        </el-table-column>
         
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",

  data() {
    return {
      RightList: null,
    };
  },
  created() {
    this.getRigthsList();
  },

  methods: {
    async getRigthsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) return this.$message.error("获取权限列表失败!");
      // console.log(res);
      this.RightList = res.data
    },
  },
};
</script>

<style lang="less" scoped></style>
