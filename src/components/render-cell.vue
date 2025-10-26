<script>
import { h } from 'vue'

/**
 * 渲染单元格组件
 * 用于动态渲染单元格内容的功能组件
 */
export default {
  name: 'RenderCell',
  functional: true,
  props: {
    // 渲染函数
    render: Function
  },
  render ({ $props }) {
    return $props.render(h)
  }
}
</script>
