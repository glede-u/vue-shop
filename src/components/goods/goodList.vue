<template>
  <div>
    <!-- 面包屑导航 -->
     <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
     <el-card class="box-card">
       <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input placeholder="请输入内容" v-model="queryList.query"  clearable @clear="getGoodList()"> <el-button slot="append" icon="el-icon-search"  @click="getGoodList()" ></el-button> </el-input
        ></el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goodsAdd" >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
       <el-table :data="goodlist" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" > </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryList.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryList.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
     </el-card>
  </div>
</template>

<script>
export default {
  name: '',

  data () {
    return {
      goodlist:[],
       queryList: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
    }
  },
  created(){
     this.getGoodList()
  },

  methods: {
    async getGoodList(){
       const { data: res } = await this.$http.get("goods", { params: this.queryList });
      if (res.meta.status !== 200) return this.$message.error("获取用户列表失败!");
      this.goodlist = res.data.goods;
      this.total = res.data.total;
     },
      handleSizeChange(newSize) {
      this.queryList.pagesize = newSize;
      this.getGoodList();
    },
    handleCurrentChange(newPagenum) {
      this.queryList.pagenum = newPagenum;
      this.getGoodList();
    },
    // 添加商品
    goodsAdd(){
      this.$router.push('goods/add')
    },
     //删除
      deleteGoods(id) {
      this.$confirm("此操作将永久删除商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        async (resolve) => {
          const { data: res } = await this.$http.delete("goods/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getGoodList();
          this.$message.success("删除商品成功!");
        },
        (reject) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        }
      );
    },
  }
}
</script>

<style lang='less' scoped>

</style>
