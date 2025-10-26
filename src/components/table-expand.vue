<script>
import { h } from 'vue'

/**
 * 表格展开组件
 * 用于渲染表格展开行的功能组件
 */
export default {
  name: 'TableExpand',
  functional: true,
  props: {
    // 行数据
    row: Object,
    // 渲染函数
    render: Function,
    // 索引
    index: Number,
    // 列配置
    column: {
      type: Object,
      default: null
    }
  },
  render ({ $props }) {
    const params = {
      row: $props.row,
      index: $props.index
    }

    if ($props.column) params.column = $props.column

    return $props.render(h, params)
  }
}
</script>
