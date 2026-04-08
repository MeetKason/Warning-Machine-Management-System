<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

defineOptions({
  name: "VideoLibrary"
});

interface VideoItem {
  id: string;
  mediaType: "视频" | "音频";
  url: string;
  warningType: string;
  warningLevel: string;
  tag: string;
}

const tableData = ref<VideoItem[]>([
  {
    id: "V001",
    mediaType: "视频",
    url: "https://example.com/media/warn-001.mp4",
    warningType: "大风",
    warningLevel: "黄色",
    tag: "沿海设备"
  },
  {
    id: "V002",
    mediaType: "音频",
    url: "https://example.com/media/warn-002.mp3",
    warningType: "暴雨",
    warningLevel: "橙色",
    tag: "城市设备"
  },
  {
    id: "V003",
    mediaType: "视频",
    url: "https://example.com/media/warn-003.mp4",
    warningType: "雷电",
    warningLevel: "红色",
    tag: "山区设备"
  }
]);

const keyword = ref("");
const filterType = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const isEdit = ref(false);
const selectedIds = ref<string[]>([]);
const formRef = ref();

const formData = reactive<VideoItem>({
  id: "",
  mediaType: "视频",
  url: "",
  warningType: "",
  warningLevel: "黄色",
  tag: ""
});

const formRules = {
  url: [{ required: true, message: "请输入地址", trigger: "blur" }],
  warningType: [{ required: true, message: "请输入预警类型", trigger: "blur" }],
  warningLevel: [
    { required: true, message: "请选择预警等级", trigger: "change" }
  ]
};

const filteredData = computed(() =>
  tableData.value.filter(item => {
    const hitKeyword =
      !keyword.value ||
      [item.url, item.warningType, item.tag].some(field =>
        field.includes(keyword.value)
      );
    const hitType = !filterType.value || item.warningType === filterType.value;
    return hitKeyword && hitType;
  })
);

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});

function onSelectionChange(rows: VideoItem[]) {
  selectedIds.value = rows.map(item => item.id);
}

function getNextId() {
  return `V${String(tableData.value.length + 1).padStart(3, "0")}`;
}

function onSearch() {
  currentPage.value = 1;
}

function onReset() {
  keyword.value = "";
  filterType.value = "";
  currentPage.value = 1;
}

function openAddDialog() {
  isEdit.value = false;
  formData.id = "";
  formData.mediaType = "视频";
  formData.url = "";
  formData.warningType = "";
  formData.warningLevel = "黄色";
  formData.tag = "";
  dialogVisible.value = true;
}

function openEditDialog(row: VideoItem) {
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

async function removeOne(row: VideoItem) {
  await ElMessageBox.confirm(`确认删除 ${row.id} 吗？`, "提示", {
    type: "warning"
  });
  tableData.value = tableData.value.filter(item => item.id !== row.id);
  ElMessage.success("删除成功");
}

async function batchRemove() {
  if (!selectedIds.value.length) {
    ElMessage.warning("请先选择要删除的记录");
    return;
  }
  await ElMessageBox.confirm(
    `确认批量删除 ${selectedIds.value.length} 条记录吗？`,
    "提示",
    { type: "warning" }
  );
  tableData.value = tableData.value.filter(
    item => !selectedIds.value.includes(item.id)
  );
  selectedIds.value = [];
  ElMessage.success("批量删除成功");
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span>视频展示</span>
      </template>

      <div class="mb-4 flex flex-wrap gap-2">
        <el-input
          v-model="keyword"
          placeholder="地址/预警类型/设备标签"
          class="w-64"
        />
        <el-select
          v-model="filterType"
          clearable
          placeholder="预警类型"
          class="w-44"
        >
          <el-option label="大风" value="大风" />
          <el-option label="暴雨" value="暴雨" />
          <el-option label="雷电" value="雷电" />
        </el-select>
        <el-button type="primary" @click="onSearch">筛选</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button type="success" @click="openAddDialog">新增</el-button>
        <el-button type="danger" @click="batchRemove">批量删除</el-button>
      </div>

      <el-table :data="pagedData" border @selection-change="onSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="mediaType" label="类型" width="80" />
        <el-table-column prop="url" label="地址" min-width="280" />
        <el-table-column prop="warningType" label="预警类型" width="120" />
        <el-table-column prop="warningLevel" label="预警等级" width="100" />
        <el-table-column prop="tag" label="设备标签" width="140" />
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
          :total="filteredData.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑视频库记录' : '新增视频库记录'"
      width="580px"
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
        <el-form-item label="类型">
          <el-radio-group v-model="formData.mediaType">
            <el-radio-button label="视频" value="视频" />
            <el-radio-button label="音频" value="音频" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址" prop="url">
          <el-input v-model="formData.url" />
        </el-form-item>
        <el-form-item label="预警类型" prop="warningType">
          <el-input v-model="formData.warningType" />
        </el-form-item>
        <el-form-item label="预警等级" prop="warningLevel">
          <el-select v-model="formData.warningLevel" class="w-full">
            <el-option label="黄色" value="黄色" />
            <el-option label="橙色" value="橙色" />
            <el-option label="红色" value="红色" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备标签">
          <el-input v-model="formData.tag" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
