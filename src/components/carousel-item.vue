<template>
  <!-- 轮播项组件容器 -->
  <div
    :class="prefixCls"
    :style="styles"
  >
    <slot />
  </div>
</template>
<script>
const prefixCls = 'ivu-carousel-item'

/**
 * 轮播项组件
 * 轮播图中的单个项目，负责管理自身的位置和尺寸
 */
export default {
  componentName: 'carousel-item',
  name: 'CarouselItem',
  data () {
    return {
      // CSS类名前缀
      prefixCls: prefixCls,
      // 项目宽度
      width: 0,
      // 项目高度
      height: 'auto',
      // 项目左边距
      left: 0
    }
  },
  computed: {
    // 项目样式：设置位置和尺寸
    styles () {
      return {
        width: `${this.width}px`,
        height: `${this.height}`,
        left: `${this.left}px`
      }
    }
  },
  watch: {
    // 监听宽度变化，更新父组件的循环轨道
    width (val) {
      if (val && this.$parent.loop) {
        this.$nextTick(() => {
          this.$parent.initCopyTrackDom()
        })
      }
    },
    // 监听高度变化，更新父组件的循环轨道
    height (val) {
      if (val && this.$parent.loop) {
        this.$nextTick(() => {
          this.$parent.initCopyTrackDom()
        })
      }
    }
  },
  mounted () {
    // 组件挂载后通知父组件插槽变化
    this.$parent.slotChange()
  },
  beforeUnmont () {
    // 组件销毁前通知父组件插槽变化
    this.$parent.slotChange()
  }
}
</script>
