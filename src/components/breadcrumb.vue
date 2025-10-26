<template>
  <!-- 面包屑导航组件容器 -->
  <div :class="classes">
    <slot />
  </div>
</template>
<script>
import { findComponentsDownward } from '../utils/assist'

const prefixCls = 'ivu-breadcrumb'

/**
 * 面包屑导航组件
 * 显示当前页面在网站中的位置，支持自定义分隔符
 */
export default {
  name: 'Breadcrumb',
  props: {
    // 分隔符，默认为斜杠
    separator: {
      type: String,
      default: '/'
    }
  },
  computed: {
    // 组件CSS类名
    classes () {
      return `${prefixCls}`
    }
  },
  watch: {
    // 监听分隔符变化，更新子组件
    separator () {
      this.updateChildren()
    }
  },
  mounted () {
    // 组件挂载后更新子组件
    this.updateChildren()
  },
  updated () {
    // 组件更新后更新子组件
    this.$nextTick(() => {
      this.updateChildren()
    })
  },
  methods: {
    /**
     * 更新子组件分隔符
     * 将所有子面包屑项的分隔符设置为当前值
     */
    updateChildren () {
      findComponentsDownward(this, 'BreadcrumbItem').forEach((child) => {
        child.separator = this.separator
      })
    }
  }
}
</script>
