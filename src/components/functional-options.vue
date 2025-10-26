<script>
import { h } from 'vue'

/**
 * 功能选项组件
 * 用于动态渲染选项列表的功能组件
 */
export default {
  props: {
    // 选项数组
    options: {
      type: Array,
      default: []
    },
    // 插槽选项
    slotOptions: {
      type: Array,
      default: []
    },
    // 插槽更新钩子
    slotUpdateHook: {
      type: Function,
      default: () => {}
    }
  },
  render () {
    // 检查插槽内容是否发生变化
    if (this.$parent.$parent.$parent.$slots.default) {
      const slotKeys = this.slotOptions[0]?.children?.map && this.slotOptions[0]?.children?.map((e) => e.props) || []
      const newSlotKeys = this.$parent.$parent.$parent.$slots.default()[0].children[0]?.children?.map && this.$parent.$parent.$parent.$slots.default()[0].children[0]?.children.map((e) => e.props) || []

      if (JSON.stringify(slotKeys) !== JSON.stringify(newSlotKeys)) {
        this.slotUpdateHook()
      }
    }

    // 渲染选项列表
    return h('ul', {}, [this.$slots.default(), this.options])
  }
}
</script>
