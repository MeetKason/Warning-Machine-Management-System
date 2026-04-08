import { tableData } from "../../data";
import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import ThumbUp from "~icons/ri/thumb-up-line";
import Hearts from "~icons/ri/hearts-line";
import Empty from "./empty.svg?component";

export function useColumns() {
  const dataList = ref([]);
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      sortable: true,
      label: "序号",
      prop: "id"
    },
    {
      sortable: true,
      label: "在线设备数",
      prop: "deviceOnline",
      filterMultiple: false,
      filterClassName: "pure-table-filter",
      filters: [
        { text: "≥3200", value: "more" },
        { text: "<3200", value: "less" }
      ],
      filterMethod: (value, { deviceOnline }) => {
        return value === "more" ? deviceOnline >= 3200 : deviceOnline < 3200;
      }
    },
    {
      sortable: true,
      label: "预警上报量",
      prop: "warningCount"
    },
    {
      sortable: true,
      label: "已处置量",
      prop: "handledCount"
    },
    {
      sortable: true,
      label: "用户满意度",
      minWidth: 100,
      prop: "satisfaction",
      cellRenderer: ({ row }) => (
        <div class="flex justify-center w-full">
          <span class="flex items-center w-15">
            <span class="ml-auto mr-2">{row.satisfaction}%</span>
            <iconify-icon-offline
              icon={row.satisfaction > 98 ? Hearts : ThumbUp}
              color="#e85f33"
            />
          </span>
        </div>
      )
    },
    {
      sortable: true,
      label: "统计日期",
      prop: "date"
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    layout: "prev, pager, next",
    total: 0,
    align: "center"
  });

  function onCurrentChange(page: number) {
    console.log("onCurrentChange", page);
    loading.value = true;
    delay(300).then(() => {
      loading.value = false;
    });
  }

  onMounted(() => {
    dataList.value = tableData;
    pagination.total = dataList.value.length;
    loading.value = false;
  });

  return {
    Empty,
    loading,
    columns,
    dataList,
    pagination,
    onCurrentChange
  };
}
