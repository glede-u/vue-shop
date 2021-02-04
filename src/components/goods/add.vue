<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 警示框 -->
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tan栏 -->
      <el-form :model="addform" :rules="addformRules" ref="addformRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addform.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addform.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addform.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addform.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择框 -->
              <el-cascader v-model="addform.goods_cat" :options="cateList" :props="cascaderProps" @change="selectedCateChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload  :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"  list-type="picture" :headers='headersObj'>
              <el-button size="small" type="primary">点击上传</el-button>
              
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "add",

  data() {
    return {
      activeIndex: "0",
      //表单数据
      addform: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
      },
      //验证规则
      addformRules: {
        goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
        goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
        goods_cat: [{ required: true, message: "请选择商品分类", trigger: "blur" }],
      },
      //商品列表
      cateList: [],
      //级联选择框配置
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: false,
      },
      //动态参数列表
      manyTableData: [],
      // /静态属性列表
      onlyTableData: [],
      //图片上传地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      //设置图片请求头参数
      headersObj:{
          Authorization:window.sessionStorage.token
      }
    };
  },
  created() {
    this.getCateList();
  },

  methods: {
    // 获取商品列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories", { params: { type: 3 } });
      if (res.meta.status !== 200) return this.$message.error("获取商品列表失败!");
      this.cateList = res.data;
    },
    //监听级联选择框事件
    selectedCateChange() {
      if (this.addform.goods_cat.length !== 3) {
        return (this.addform.goods_cat = []);
      }
    },
    //切换tan栏前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addform.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类!");
        return false;
      }
    },
    //tan栏点击事件
    async tabClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(`categories/${this.addform.goods_cat[2]}/attributes`, { params: { sel: "many" } });
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败!");
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(",") : [];
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(`categories/${this.addform.goods_cat[2]}/attributes`, { params: { sel: "only" } });
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性列表失败!");
        }
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    //处理图片预览
    handlePreview(){},
    //处理图片删除的操作
    handleRemove(){}
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
