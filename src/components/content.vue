<template>
  <!-- 布局内容区域 -->
  <div :class="wrapClasses">
    <slot />
  </div>
</template>
<script>
const prefixCls = 'ivu-layout'

/**
 * 布局内容组件
 * 布局系统中的内容区域组件
 */
export default {
  name: 'Content',
  computed: {
    // 内容区域CSS类名
    wrapClasses () {
      return `${prefixCls}-content`
    }
  }
}
</script>
