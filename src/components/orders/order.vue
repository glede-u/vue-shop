<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input placeholder="请输入内容" v-model="queryList.query" clearable @clear="getOrderList()"> <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button> </el-input
        ></el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="95px"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="70px"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showAddress"></el-button>
            <!-- 删除按钮 -->
            <el-button type="primary" icon="el-icon-location" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryList.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryList.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
    </el-card>
    <!-- 修改地址 对话框 -->
    <el-dialog title="修改地址" :visible.sync="orderDialogVisible" width="50%" @close="addressDialogClose">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "./citydata";
export default {
  name: "",

  data() {
    return {
      orderList: [],
      queryList: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      orderDialogVisible: false,
      citydata,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", { params: this.queryList });
      if (res.meta.status !== 200) return this.$message.error("获取订单列表失败!");
      console.log(res);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryList.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPagenum) {
      this.queryList.pagenum = newPagenum;
      this.getOrderList();
    },
    showAddress() {
      this.orderDialogVisible = true;
    },
    addressDialogClose(){
      this.$refs.addressFormRef.resetFields();
    }
  },
};
</script>

<style lang="less" scoped></style>
