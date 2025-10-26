<template>
  <!-- 时间轴容器 -->
  <ul :class="classes">
    <slot />
  </ul>
</template>
<script>
const prefixCls = 'ivu-timeline'

/**
 * 时间轴组件
 * 用于显示时间轴信息
 */
export default {
  name: 'Timeline',
  props: {
    // 是否显示待处理状态
    pending: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 时间轴CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-pending`]: this.pending
                    }
      ]
    }
  }
}
</script>
