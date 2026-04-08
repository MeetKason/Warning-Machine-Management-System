<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Amap } from "@/components/ReMap";

defineOptions({
  name: "WarningMachineList"
});

type SourceType = "墨迹" | "彩云";

interface WarningMachineItem {
  id: string;
  address: string;
  areaCode: string;
  title: string;
  factory: string;
  onlineTime: string;
  source: SourceType;
  coordinate: string;
}

const factoryOptions = ["YJJ-1", "YJJ-2", "YJJ-3"];
const sourceOptions: SourceType[] = ["墨迹", "彩云"];

const tableData = ref<WarningMachineItem[]>([
  {
    id: "0001",
    address: "深圳市南山区科技园南区",
    areaCode: "440305",
    title: "南山科技园预警点",
    factory: "YJJ-2",
    onlineTime: "2026-04-01 08:00:00",
    source: "彩云",
    coordinate: "113.9304,22.5333"
  },
  {
    id: "0002",
    address: "深圳市福田区市民中心",
    areaCode: "440304",
    title: "福田中心预警点",
    factory: "YJJ-1",
    onlineTime: "2026-04-02 09:30:00",
    source: "墨迹",
    coordinate: "114.0646,22.5431"
  },
  {
    id: "0003",
    address: "深圳市宝安区西乡大道",
    areaCode: "440306",
    title: "宝安西乡预警点",
    factory: "YJJ-3",
    onlineTime: "2026-04-03 10:20:00",
    source: "彩云",
    coordinate: "113.8842,22.5537"
  }
]);

const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const mapDialogVisible = ref(false);
const isEdit = ref(false);

const formRef = ref();
const formData = reactive<WarningMachineItem>({
  id: "",
  address: "",
  areaCode: "",
  title: "",
  factory: "YJJ-2",
  onlineTime: "",
  source: "彩云",
  coordinate: ""
});

const formRules = {
  id: [
    { required: true, message: "请输入设备ID", trigger: "blur" },
    {
      pattern: /^\d{4}$/,
      message: "设备ID需为4位数字，例如0001",
      trigger: "blur"
    }
  ],
  address: [{ required: true, message: "请输入地址", trigger: "blur" }],
  areaCode: [{ required: true, message: "请输入地区代码", trigger: "blur" }],
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  coordinate: [
    { required: true, message: "请输入坐标", trigger: "blur" },
    {
      pattern: /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/,
      message: "坐标格式应为 经度,纬度",
      trigger: "blur"
    }
  ]
};

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

function onPageSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
}

function getNextId() {
  return String(tableData.value.length + 1).padStart(4, "0");
}

function resetForm() {
  formData.id = "";
  formData.address = "";
  formData.areaCode = "";
  formData.title = "";
  formData.factory = "YJJ-2";
  formData.onlineTime = "";
  formData.source = "彩云";
  formData.coordinate = "";
}

function openAddDialog() {
  isEdit.value = false;
  resetForm();
  formData.id = getNextId();
  dialogVisible.value = true;
}

function openEditDialog(row: WarningMachineItem) {
  isEdit.value = true;
  Object.assign(formData, row);
  dialogVisible.value = true;
}

function openDetail(row: WarningMachineItem) {
  ElMessage.info(`显示设备 ${row.id} 详情`);
}

async function removeRow(row: WarningMachineItem) {
  await ElMessageBox.confirm(`确认删除设备 ${row.id} 吗？`, "提示", {
    type: "warning"
  });
  tableData.value = tableData.value.filter(item => item.id !== row.id);
  const maxPage = Math.max(
    1,
    Math.ceil(tableData.value.length / pageSize.value)
  );
  currentPage.value = Math.min(currentPage.value, maxPage);
  ElMessage.success("删除成功");
}

function pickSource(source: SourceType) {
  formData.source = source;
}

function pickCoordinateByMap() {
  mapDialogVisible.value = true;
}

function onMapClick() {
  formData.coordinate = "113.9304,22.5333";
  mapDialogVisible.value = false;
  ElMessage.success("已回填坐标");
}

function onMapSelect(payload: { coordinate: string }) {
  formData.coordinate = payload.coordinate;
  mapDialogVisible.value = false;
  ElMessage.success("已回填坐标");
}

function submitForm() {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return;

    if (isEdit.value) {
      const index = tableData.value.findIndex(item => item.id === formData.id);
      if (index > -1) {
        tableData.value[index] = { ...formData };
      }
      ElMessage.success("编辑成功");
    } else {
      if (tableData.value.some(item => item.id === formData.id)) {
        ElMessage.warning("设备ID已存在，请更换后重试");
        return;
      }
      const now = new Date();
      const onlineTime = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(
        2,
        "0"
      )}:${String(now.getSeconds()).padStart(2, "0")}`;
      tableData.value.unshift({
        ...formData,
        onlineTime
      });
      currentPage.value = 1;
      ElMessage.success("新增成功");
    }

    dialogVisible.value = false;
  });
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="flex-bc">
          <span>预警机列表</span>
          <el-button type="primary" @click="openAddDialog"
            >添加预警机</el-button
          >
        </div>
      </template>

      <el-table :data="pagedTableData" border>
        <el-table-column prop="id" label="设备ID" width="100" />
        <el-table-column prop="address" label="地址" min-width="180" />
        <el-table-column
          prop="areaCode"
          label="地区代码（行政区）"
          width="150"
        />
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="factory" label="厂家" width="120" />
        <el-table-column prop="onlineTime" label="在线时间" width="180" />
        <el-table-column prop="source" label="数据来源" width="100" />
        <el-table-column prop="coordinate" label="坐标" min-width="150" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)">
              编辑
            </el-button>
            <el-button link type="success" @click="openDetail(row)">
              显示
            </el-button>
            <el-button link type="danger" @click="removeRow(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="tableData.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onPageSizeChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑预警机设备' : '添加预警机设备'"
      width="640px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="110px"
      >
        <el-form-item label="设备ID" prop="id">
          <el-input v-model="formData.id" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" />
        </el-form-item>
        <el-form-item label="地区代码" prop="areaCode">
          <el-input v-model="formData.areaCode" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item label="厂家">
          <el-select v-model="formData.factory" class="w-full">
            <el-option
              v-for="factory in factoryOptions"
              :key="factory"
              :label="factory"
              :value="factory"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源">
          <div class="flex gap-3">
            <el-check-tag
              v-for="source in sourceOptions"
              :key="source"
              :checked="formData.source === source"
              @change="pickSource(source)"
            >
              {{ source }}
            </el-check-tag>
          </div>
        </el-form-item>
        <el-form-item label="坐标" prop="coordinate">
          <el-input
            v-model="formData.coordinate"
            placeholder="例如：113.9304,22.5333"
          >
            <template #append>
              <el-button @click="pickCoordinateByMap">地图点选</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="mapDialogVisible" title="地图点选坐标" width="760px">
      <Amap height="360px" selectable @select="onMapSelect" />
      <div class="mt-2 text-sm text-text_color_secondary">
        点击地图任意位置可自动回填经纬度
      </div>
    </el-dialog>
  </div>
</template>
