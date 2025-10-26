<template>
  <!-- 时间轴项 -->
  <li :class="itemClasses">
    <!-- 连接线 -->
    <div :class="tailClasses" />
    <!-- 时间点 -->
    <div
      ref="dot"
      :class="headClasses"
      :style="customColor"
    >
      <slot name="dot" />
    </div>
    <!-- 内容区域 -->
    <div :class="contentClasses">
      <slot />
    </div>
  </li>
</template>
<script>
const prefixCls = 'ivu-timeline'

/**
 * 时间轴项组件
 * 时间轴中的单个时间项组件
 */
export default {
  name: 'TimelineItem',
  props: {
    // 颜色
    color: {
      type: String,
      default: 'blue'
    }
  },
  data () {
    return {
      // 是否有自定义点
      dot: false
    }
  },
  computed: {
    // 时间轴项CSS类名
    itemClasses () {
      return `${prefixCls}-item`
    },
    // 连接线CSS类名
    tailClasses () {
      return `${prefixCls}-item-tail`
    },
    // 时间点头部CSS类名
    headClasses () {
      return [
                    `${prefixCls}-item-head`,
                    {
                      [`${prefixCls}-item-head-custom`]: this.dot,
                      [`${prefixCls}-item-head-${this.color}`]: this.headColorShow
                    }
      ]
    },
    // 是否显示预设颜色
    headColorShow () {
      return this.color == 'blue' || this.color == 'red' || this.color == 'green'
    },
    // 自定义颜色样式
    customColor () {
      let style = {}
      if (this.color) {
        if (!this.headColorShow) {
          style = {
            color: this.color,
            'border-color': this.color
          }
        }
      }

      return style
    },
    // 内容区域CSS类名
    contentClasses () {
      return `${prefixCls}-item-content`
    }
  },
  mounted () {
    this.dot = !!this.$refs.dot.innerHTML.length
  }
}
</script>
