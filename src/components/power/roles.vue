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
          <el-button type="primary" @click="showAddRolesDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限渲染 -->
            <el-row :class="['dbbottom', i1 === 0 ? 'dbtop' : '', 'vconter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeTag(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级和三级渲染 -->
                <el-row :class="[i2 == 0 ? '' : 'dbtop', 'vconter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeTag(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeTag(scope.row, item3.id)">
                      {{ item2.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="getEditRoleDialogVisible(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="RightDialogVisible" width="50%" @close="setRightDialogClose">
        <!-- 树形控件 -->
        <el-tree :data="rightList" :props="treetProps" ref="rightRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="RightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allRights">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加角色的对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleDialogClose">
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog title="编辑" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleDialogClose">
        <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="70px">
          <el-form-item label="角色名称">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "roles",

  data() {
    return {
      rolesList: null,
      // 控制分配权限对话框的显示与隐藏
      RightDialogVisible: false,
      // 权限列表
      rightList: null,
      treetProps: {
        label: "authName",
        children: "children",
      },
      //树形控件的默认选择的id数组集合
      defkeys: [],
      roleId: "",
      //控制添加角色的对话框的显示与隐藏
      addRoleDialogVisible: false,
      //添加角色
      addRoleForm: {},
      //角色规则
      addRoleFormRules: {
        roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
      // 控制编辑对话框
      editRoleDialogVisible: false,
      //编辑用户
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
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
    // 根据id删除对应的权限
    removeTag(roles, id) {
      this.$confirm("此操作将永久删除权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        async (resolve) => {
          const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }

          roles.children = res.data;
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
    // 获取所有权限
    async showSetRightDialog(node) {
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error("获取权限列表失败!");
      this.rightList = res.data;
      // console.log(this.rightList);
      this.getLeafKeys(node, this.defkeys);
      this.RightDialogVisible = true;
      this.roleId = node.id;
    },
    // 获取所有三级权限的id,用递归push到defkeys里面
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    //关闭弹框清空defkeys
    setRightDialogClose() {
      this.defkeys = [];
    },
    //分配权限
    async allRights() {
      const keys = [...this.$refs.rightRef.getCheckedKeys(), ...this.$refs.rightRef.getHalfCheckedKeys()];
      const idStrs = keys.join(",");
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStrs });
      if (res.meta.status !== 200) return this.$message.error("分配权限失败!");
      this.getRolesList();
      this.$message.success("分配权限成功!");
      this.RightDialogVisible = false;
    },
    //显示添加角色对话框
    showAddRolesDialog() {
      this.addRoleDialogVisible = true;
    },
    //设置关闭重置对话框
    addRoleDialogClose() {
      this.$refs.addFormRef.resetFields();
      this.addRoleForm.roleDesc = "";
    },
    //添加角色
    addRoles() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败!");
        this.$message.success("添加角色成功");
        this.getRolesList();
        this.addRoleDialogVisible = false;
      });
    },
    //根据id获得角色信息
    async getEditRoleDialogVisible(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色失败!");
      }
      this.editRoleForm = res.data;
       this.editRoleDialogVisible = true;
    },
    //更新角色信息
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put("roles/" + this.editRoleForm.roleId, { roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc });
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新角色失败!");
        }
        this.getRolesList();
        this.editRoleDialogVisible = false;
        this.$message.success("更新角色成功!");
      });
    },
    editRoleDialogClose() {
      this.$refs.editRoleFormRef.resetFields();
    },
    //根据id删除角色
    deleteRole(id) {
      this.$confirm("此操作将永久删除角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(
        async (resolve) => {
          const { data: res } = await this.$http.delete("roles/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getRolesList();
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

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
.vconter {
  display: flex;
  align-items: center;
}
</style>
