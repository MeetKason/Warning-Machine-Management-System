<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

defineOptions({
  name: "WarningMachineFactory"
});

interface FactoryItem {
  id: string;
  name: string;
  model: string;
  contact: string;
  deviceType: string;
}

const tableData = ref<FactoryItem[]>([
  {
    id: "F001",
    name: "聚彩云",
    model: "YJJ-2",
    contact: "张工",
    deviceType: "固定式预警机"
  },
  {
    id: "F002",
    name: "德善互动",
    model: "YJJ-1",
    contact: "李工",
    deviceType: "移动式预警机"
  },
  {
    id: "F003",
    name: "卫慧科技",
    model: "YJJ-3",
    contact: "王工",
    deviceType: "一体式预警机"
  }
]);

const keyword = ref("");
const filterModel = ref("");
const selectionIds = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formData = reactive<FactoryItem>({
  id: "",
  name: "",
  model: "YJJ-2",
  contact: "",
  deviceType: ""
});

const formRules = {
  name: [{ required: true, message: "请输入厂家名称", trigger: "blur" }],
  contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  deviceType: [{ required: true, message: "请输入设备类型", trigger: "blur" }]
};

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const hitKeyword =
      !keyword.value ||
      [item.name, item.contact, item.deviceType].some(field =>
        field.includes(keyword.value)
      );
    const hitModel = !filterModel.value || item.model === filterModel.value;
    return hitKeyword && hitModel;
  });
});

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});

function onFilter() {
  currentPage.value = 1;
}

function onReset() {
  keyword.value = "";
  filterModel.value = "";
  currentPage.value = 1;
}

function onSelectionChange(rows: FactoryItem[]) {
  selectionIds.value = rows.map(item => item.id);
}

function getNextId() {
  return `F${String(tableData.value.length + 1).padStart(3, "0")}`;
}

function openAddDialog() {
  isEdit.value = false;
  formData.id = "";
  formData.name = "";
  formData.model = "YJJ-2";
  formData.contact = "";
  formData.deviceType = "";
  dialogVisible.value = true;
}

function openEditDialog(row: FactoryItem) {
  isEdit.value = true;
  Object.assign(formData, row);
  dialogVisible.value = true;
}

function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return;
    if (isEdit.value) {
      const index = tableData.value.findIndex(item => item.id === formData.id);
      if (index > -1) tableData.value[index] = { ...formData };
      ElMessage.success("编辑成功");
    } else {
      tableData.value.unshift({
        ...formData,
        id: getNextId()
      });
      currentPage.value = 1;
      ElMessage.success("新增成功");
    }
    dialogVisible.value = false;
  });
}

async function removeOne(row: FactoryItem) {
  await ElMessageBox.confirm(`确认删除厂家 ${row.name} 吗？`, "提示", {
    type: "warning"
  });
  tableData.value = tableData.value.filter(item => item.id !== row.id);
  ElMessage.success("删除成功");
}

async function batchRemove() {
  if (!selectionIds.value.length) {
    ElMessage.warning("请先选择要删除的数据");
    return;
  }
  await ElMessageBox.confirm(
    `确认批量删除 ${selectionIds.value.length} 条厂家数据吗？`,
    "提示",
    { type: "warning" }
  );
  tableData.value = tableData.value.filter(
    item => !selectionIds.value.includes(item.id)
  );
  selectionIds.value = [];
  ElMessage.success("批量删除成功");
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span>厂家管理</span>
      </template>

      <div class="mb-4 flex flex-wrap gap-2">
        <el-input
          v-model="keyword"
          placeholder="厂家/联系人/设备类型"
          class="w-60"
        />
        <el-select
          v-model="filterModel"
          clearable
          placeholder="型号筛选"
          class="w-40"
        >
          <el-option label="YJJ-1" value="YJJ-1" />
          <el-option label="YJJ-2" value="YJJ-2" />
          <el-option label="YJJ-3" value="YJJ-3" />
        </el-select>
        <el-button type="primary" @click="onFilter">筛选</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="success" @click="openAddDialog">新增厂家</el-button>
        <el-button type="danger" @click="batchRemove">批量删除</el-button>
      </div>

      <el-table :data="pagedData" border @selection-change="onSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="厂家名称" min-width="160" />
        <el-table-column prop="model" label="型号" width="120" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="deviceType" label="设备类型" min-width="160" />
        <el-table-column label="操作" width="170">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)"
              >编辑</el-button
            >
            <el-button link type="danger" @click="removeOne(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredData.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑厂家' : '新增厂家'"
      width="560px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="90px"
      >
        <el-form-item v-if="isEdit" label="ID">
          <el-input v-model="formData.id" disabled />
        </el-form-item>
        <el-form-item label="厂家名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="型号">
          <el-select v-model="formData.model" class="w-full">
            <el-option label="YJJ-1" value="YJJ-1" />
            <el-option label="YJJ-2" value="YJJ-2" />
            <el-option label="YJJ-3" value="YJJ-3" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="formData.contact" />
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-input v-model="formData.deviceType" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
