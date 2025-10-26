<template>
  <!-- 布局底部区域 -->
  <div :class="wrapClasses">
    <slot />
  </div>
</template>
<script>
const prefixCls = 'ivu-layout'

/**
 * 布局底部组件
 * 布局系统中的底部区域组件
 */
export default {
  name: 'Footer',
  computed: {
    // 底部区域CSS类名
    wrapClasses () {
      return `${prefixCls}-footer`
    }
  }
}
</script>
