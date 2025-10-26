<template>
  <!-- 表格汇总容器 -->
  <div style="overflow:hidden;">
    <!-- 汇总表格 -->
    <table
      class="ivu-table-summary"
      cellspacing="0"
      cellpadding="0"
      border="0"
      :style="styleObject"
    >
      <!-- 列组 -->
      <colgroup>
        <col
          v-for="(column, index) in columns"
          :width="setCellWidth(column)"
        >
      </colgroup>
      <!-- 表格主体 -->
      <tbody :class="[prefixCls + '-tbody']">
        <!-- 汇总行 -->
        <tr class="ivu-table-row">
          <td
            v-for="(column, index) in columns"
            :class="alignCls(column)"
          >
            <!-- 单元格 -->
            <div
              class="ivu-table-cell"
              :class="cellCls(column)"
            >
              <span>{{ data[column.key].value }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Mixin from '../mixins/table'

/**
 * 表格汇总组件
 * 用于显示表格的汇总行
 */
export default {
  name: 'TableSummary',
  mixins: [Mixin],
  props: {
    // 样式前缀
    prefixCls: String,
    // 样式对象
    styleObject: Object,
    // 列配置
    columns: Array,
    // 汇总数据
    data: Object, // rebuildData
    // 列宽度
    columnsWidth: Object,
    // 是否固定
    fixed: {
      type: [Boolean, String],
      default: false
    }
  },
  methods: {
    // 单元格CSS类名
    cellCls (column) {
      return [
        {
          'ivu-table-hidden': (this.fixed === 'left' && column.fixed !== 'left') || (this.fixed === 'right' && column.fixed !== 'right') || (!this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'))
        }
      ]
    }
  }
}
</script>
