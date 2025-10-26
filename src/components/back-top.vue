<template>
  <!-- 回到顶部组件 -->
  <div
    :class="classes"
    :style="styles"
    @click="back"
  >
    <!-- 自定义内容插槽 -->
    <slot>
      <!-- 默认箭头图标 -->
      <div :class="innerClasses">
        <i class="ivu-icon ivu-icon-ios-arrow-up" />
      </div>
    </slot>
  </div>
</template>
<script>
import { scrollTop } from '../../utils/assist'
import { on, off } from '../../utils/dom'
const prefixCls = 'ivu-back-top'

/**
 * 回到顶部组件
 * 当页面滚动超过指定高度时显示，点击可平滑滚动到页面顶部
 */
export default {
  props: {
    // 显示回到顶部按钮的滚动高度阈值
    height: {
      type: Number,
      default: 400
    },
    // 距离底部的距离
    bottom: {
      type: Number,
      default: 30
    },
    // 距离右侧的距离
    right: {
      type: Number,
      default: 30
    },
    // 滚动动画持续时间（毫秒）
    duration: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      // 是否显示回到顶部按钮
      backTop: false
    }
  },
  computed: {
    // 组件CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-show`]: this.backTop
                    }
      ]
    },
    // 组件样式：设置位置
    styles () {
      return {
        bottom: `${this.bottom}px`,
        right: `${this.right}px`
      }
    },
    // 内部内容CSS类名
    innerClasses () {
      return `${prefixCls}-inner`
    }
  },
  mounted () {
    // 监听滚动和窗口大小变化事件
    on(window, 'scroll', this.handleScroll)
    on(window, 'resize', this.handleScroll)
  },
  beforeUnmount () {
    // 组件销毁前移除事件监听
    off(window, 'scroll', this.handleScroll)
    off(window, 'resize', this.handleScroll)
  },
  methods: {
    /**
     * 处理滚动事件
     * 根据滚动位置决定是否显示回到顶部按钮
     */
    handleScroll () {
      this.backTop = window.pageYOffset >= this.height
    },
    /**
     * 回到顶部
     * 平滑滚动到页面顶部并触发点击事件
     */
    back () {
      const sTop = document.documentElement.scrollTop || document.body.scrollTop
      scrollTop(window, sTop, 0, this.duration)
      this.$emit('on-click')
    }
  }
}
</script>
