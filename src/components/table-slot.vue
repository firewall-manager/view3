<script>
import { h } from 'vue'

/**
 * 表格插槽组件
 * 用于渲染表格单元格中的插槽内容
 */
export default {
  name: 'TableSlot',
  functional: true,
  inject: ['tableRoot'],
  props: {
    // 行数据
    row: Object,
    // 索引
    index: Number,
    // 列配置
    column: {
      type: Object,
      default: null
    },
    // 显示方式
    display: {
      type: String,
      default: 'block'
    }
  },
  render: ({ $props }) => {
    return h('div', {
      class: {
        'ivu-table-cell-slot': true,
        'ivu-table-cell-slot-inline': $props.display === 'inline',
        'ivu-table-cell-slot-inline-block': $props.display === 'inline-block'
      }
    }, $props.tableRoot.$scopedSlots[$props.column.slot]({
      row: $props.row,
      column: $props.column,
      index: $props.index
    }))
  }
}
</script>
