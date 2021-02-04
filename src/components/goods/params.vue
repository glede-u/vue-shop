<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意: 只允许为等三级分类设置相关参数!" type="warning" :closable="false" show-icon> </el-alert>
      <!-- 商品选择 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 级联选择框 -->
          <el-cascader v-model="selectedCatekeys" :options="cateList" :props="cascaderProps" @change="selectedCateChange" clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" type="primary" :disabled="isDisabled" @click="addParamsDialogVisible = true">添加参数 </el-button>
          <!-- 动态栏 -->
          <el-table :data="manyCateList" border stripe label-width="100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close='handleClosed(scope.row,i)'>{{ item }} </el-tag>

                <!-- 动态输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <!-- 输入按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button size="mini" type="primary" :disabled="isDisabled" @click="addParamsDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyCateList" border stripe label-width="100%">
            <!-- 静态栏 -->
              <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close='handleClosed(scope.row,i)'>{{ item }} </el-tag>

                <!-- 动态输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <!-- 输入按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数对话框 -->
      <el-dialog :title="'添加' + titleText" :visible.sync="addParamsDialogVisible" width="50%" @close="addParamsClosed">
        <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑参数对话框 -->
      <el-dialog :title="'编辑' + titleText" :visible.sync="editParamsDialogVisible" width="50%" @close="editParamsClosed">
        <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",

  data() {
    return {
      // 商品分类
      cateList: [],
      //级联选择框数据绑定
      selectedCatekeys: [],
      //级联选择框配置
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: false,
      },
      activeName: "many",
      //动态参数列表
      manyCateList: [],
      //静态属性列表
      onlyCateList: [],
      // 控制添加参数对话框
      addParamsDialogVisible: false,
      //添加参数数据
      addParamsForm: {
        attr_name: "",
      },
      //添加参数规则
      addParamsRules: {
        attr_name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
      },
      // 控制编辑对话框的显示与隐藏
      editParamsDialogVisible: false,
      // 编辑参数列表
      editParamsForm: {},
      // 编辑规则
      editParamsRules: {
        attr_name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
      },
    };
  },
  computed: {
    isDisabled() {
      return this.selectedCatekeys.length !== 3;
    },
    cateId() {
      if (this.selectedCatekeys.length === 3) {
        return this.selectedCatekeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  created() {
    this.getCateList();
  },

  methods: {
    // 获取商品列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error("获取商品分类失败!");
      this.cateList = res.data;
    },
    //监听级联选择框的变化事件
    selectedCateChange() {
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectedCatekeys.length !== 3) {
        this.selectedCatekeys = [];
        this.onlyCateList=[]
        this.manyCateList=[]
        return;
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } });
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.length>0 ? item.attr_vals.split(",") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });   
      if (this.activeName === "many") {
        this.manyCateList = res.data;
      } else {
        this.onlyCateList = res.data;
      }
    },
    handleTabClick() {
      this.getParamsData();
    },
    //关闭重置添加对话框
    addParamsClosed() {
      this.$refs.addParamsRef.resetFields();
    },
    //添加参数
    addParams() {
      this.$refs.addParamsRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addParamsForm.attr_name, attr_sel: this.activeName });
        if (res.meta.status !== 201) return this.$message.error("添加参数失败!");
        this.$message.success("添加参数成功");
        this.getParamsData();
        this.addParamsDialogVisible = false;
      });
    },
    // 点击按钮，展示修改的对话框
    async showEditDialog(attr_id) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
        params: { attr_sel: this.activeName },
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败！");
      }

      this.editParamsForm = res.data;
      this.editParamsDialogVisible = true;
    },
    //编辑参数
    editParams() {
      this.$refs.editParamsRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, { attr_name: this.editParamsForm.attr_name, attr_sel: this.editParamsForm.attr_sel, attr_vals: this.editParamsForm.attr_vals });
        if (res.meta.status !== 200) {
          return this.$message.error("更新参数失败!");
        }
        this.getParamsData();
        this.editParamsDialogVisible = false;
        this.$message.success("更新参数成功!");
      });
    },

    // 关闭编辑对话框重置
    editParamsClosed() {
      this.$refs.editParamsRef.resetFields();
    },
    //删除参数
    deleteParams(id) {
      this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        async (resolve) => {
          const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/` + id);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getParamsData();
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
    //监听动态标签
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //监听动态标签的离开和enter事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row)
    },
    //抽离编辑请求方式
  async saveAttrVals(row){
       const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(',') });
        if (res.meta.status !== 200) {
          return this.$message.error("更新参数失败!");
        }
        this.$message.success("更新参数成功!");
    },
    //删除展开行的参数
    handleClosed(row,i){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    }
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 100px;
}
</style>
