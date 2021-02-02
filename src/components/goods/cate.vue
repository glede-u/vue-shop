<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="showAddCateDialog">添加商品</el-button>
        </el-col>
      </el-row>
      <tree-table show-index index-text="#" border :selection-type="false" :expand-type="false" :data="cateList" :columns="columns">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:#67c23a" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level == 2">三级</el-tag>
        </template>
        <template slot="operation">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryList.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryList.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      <!-- 添加商品的对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
          <el-form-item label="分类名称: " prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类: ">
            <el-cascader v-model="parentId" :options="parentCatelist" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "cate",

  data() {
    return {
      //自定义查询条件
      queryList: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //定义商品列表
      cateList: [],
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
        },
      ],
      //控制添加商品的对话框显示与隐藏
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateRules: {
        cat_name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      parentCatelist: [],
      //父级id
      parentId: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
    };
  },
  created() {
    this.getCateList();
  },

  methods: {
    // 获取商品列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories", { params: this.queryList });
      if (res.meta.status !== 200) return this.$message.error("获取用户列表失败!");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryList.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPagenum) {
      this.queryList.pagenum = newPagenum;
      this.getCateList();
    },
    //显示添加分类的对话框
    showAddCateDialog() {
      this.getParentCatelist();
      this.addCateDialogVisible = true;
    },
    //获取父级分类列表
    async getParentCatelist() {
      const { data: res } = await this.$http.get("categories", { params: { type: 2 } });
      if (res.meta.status !== 200) return this.$message.error("获取父级分类失败!");
      this.parentCatelist = res.data;
      console.log(res.data);
    },
    parentCateChange() {
      if (this.parentId.length > 0) {
        //  父级分类id
        this.addCateForm.cat_pid = this.parentId[this.parentId.length - 1];
        //分层等级
        this.addCateForm.cat_level = this.parentId.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
      console.log(this.addCateForm);
    },
    //添加分类
    addCate() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addCateForm);
        if (res.meta.status !== 201) return this.$message.error("添加分类失败!");
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    //关闭添加分类对话框重置
    addCateDialogClosed() {
      this.$refs.addCateRef.resetFields();
      this.parentId = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
