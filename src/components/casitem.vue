<template>
  <!-- 级联选择器菜单项 -->
  <li :class="classes">
    {{ data.label }}
    <!-- 箭头图标（有子项时显示） -->
    <Icon
      v-if="showArrow"
      :type="arrowType"
      :custom="customArrowType"
      :size="arrowSize"
    />
    <!-- 加载图标（异步加载时显示） -->
    <i
      v-if="showLoading"
      class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-cascader-menu-item-loading"
    />
  </li>
</template>
<script>
import Icon from './icon.vue'

/**
 * 级联选择器菜单项组件
 * 级联选择器面板中的单个选项项
 */
export default {
  name: 'Casitem',
  components: { Icon },
  props: {
    // 选项数据
    data: Object,
    // CSS类名前缀
    prefixCls: String,
    // 临时选中项
    tmpItem: Object
  },
  computed: {
    // 菜单项CSS类名
    classes () {
      return [
                    `${this.prefixCls}-menu-item`,
                    {
                      [`${this.prefixCls}-menu-item-active`]: this.tmpItem.value === this.data.value,
                      [`${this.prefixCls}-menu-item-disabled`]: this.data.disabled
                    }
      ]
    },
    // 是否显示箭头：有子项或非加载状态
    showArrow () {
      return (this.data.children && this.data.children.length) || ('loading' in this.data && !this.data.loading)
    },
    // 是否显示加载图标
    showLoading () {
      return 'loading' in this.data && this.data.loading
    },
    // 箭头图标类型
    arrowType () {
      return 'ios-arrow-forward'
    },
    // 自定义箭头图标类型
    customArrowType () {
      return ''
    },
    // 箭头图标尺寸
    arrowSize () {
      return ''
    }
  }
}
</script>
