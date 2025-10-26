<template>
  <!-- 布局头部区域 -->
  <div :class="wrapClasses">
    <slot />
  </div>
</template>
<script>
const prefixCls = 'ivu-layout'

/**
 * 布局头部组件
 * 布局系统中的头部区域组件
 */
export default {
  name: 'Header',
  computed: {
    // 头部区域CSS类名
    wrapClasses () {
      return `${prefixCls}-header`
    }
  }
}
</script>
