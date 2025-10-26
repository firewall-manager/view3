<template>
  <!-- 侧边栏容器 -->
  <div
    :class="wrapClasses"
    :style="wrapStyles"
  >
    <!-- 零宽度触发器 -->
    <span
      v-show="showZeroTrigger"
      :class="zeroWidthTriggerClasses"
      @click="toggleCollapse"
    >
      <i class="ivu-icon ivu-icon-ios-menu" />
    </span>
    <!-- 侧边栏内容 -->
    <div :class="childClasses">
      <slot />
    </div>
    <!-- 底部触发器插槽 -->
    <slot name="trigger">
      <div
        v-show="showBottomTrigger"
        :class="triggerClasses"
        :style="{width: siderWidth + 'px'}"
        @click="toggleCollapse"
      >
        <i :class="triggerIconClasses" />
      </div>
    </slot>
  </div>
</template>
<script>
import { on, off } from '../utils/dom'
import { oneOf, dimensionMap, setMatchMedia } from '../utils/assist'
const prefixCls = 'ivu-layout-sider'
setMatchMedia()

/**
 * 侧边栏组件
 * 布局系统中的侧边栏组件
 */
export default {
  name: 'Sider',
  props: {
    // 是否折叠
    modelValue: { // if it's collpased now
      type: Boolean,
      default: false
    },
    // 侧边栏宽度
    width: {
      type: [Number, String],
      default: 200
    },
    // 折叠时宽度
    collapsedWidth: {
      type: [Number, String],
      default: 64
    },
    // 是否隐藏触发器
    hideTrigger: {
      type: Boolean,
      default: false
    },
    // 断点
    breakpoint: {
      type: String,
      validator (val) {
        return oneOf(val, ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'])
      }
    },
    // 是否可折叠
    collapsible: {
      type: Boolean,
      default: false
    },
    // 默认是否折叠
    defaultCollapsed: {
      type: Boolean,
      default: false
    },
    // 是否反向箭头
    reverseArrow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      // 媒体匹配状态
      mediaMatched: false
    }
  },
  computed: {
    // 侧边栏包装器CSS类名
    wrapClasses () {
      return [
                    `${prefixCls}`,
                    this.siderWidth ? '' : `${prefixCls}-zero-width`,
                    this.modelValue ? `${prefixCls}-collapsed` : ''
      ]
    },
    // 侧边栏包装器样式
    wrapStyles () {
      return {
        width: `${this.siderWidth}px`,
        minWidth: `${this.siderWidth}px`,
        maxWidth: `${this.siderWidth}px`,
        flex: `0 0 ${this.siderWidth}px`
      }
    },
    // 触发器CSS类名
    triggerClasses () {
      return [
                    `${prefixCls}-trigger`,
                    this.modelValue ? `${prefixCls}-trigger-collapsed` : ''
      ]
    },
    // 子元素CSS类名
    childClasses () {
      return `${this.prefixCls}-children`
    },
    // 零宽度触发器CSS类名
    zeroWidthTriggerClasses () {
      return [
                    `${prefixCls}-zero-width-trigger`,
                    this.reverseArrow ? `${prefixCls}-zero-width-trigger-left` : ''
      ]
    },
    // 触发器图标CSS类名
    triggerIconClasses () {
      return [
        'ivu-icon',
                    `ivu-icon-ios-arrow-${this.reverseArrow ? 'forward' : 'back'}`,
                    `${prefixCls}-trigger-icon`
      ]
    },
    // 侧边栏宽度
    siderWidth () {
      return this.collapsible ? (this.modelValue ? (this.mediaMatched ? 0 : parseInt(this.collapsedWidth)) : parseInt(this.width)) : this.width
    },
    // 是否显示零宽度触发器
    showZeroTrigger () {
      return this.collapsible ? (this.mediaMatched && !this.hideTrigger || (parseInt(this.collapsedWidth) === 0) && this.modelValue && !this.hideTrigger) : false
    },
    // 是否显示底部触发器
    showBottomTrigger () {
      return this.collapsible ? !this.mediaMatched && !this.hideTrigger : false
    }
  },
  watch: {
    // 监听折叠状态变化
    modelValue (stat) {
      this.$emit('on-collapse', stat)
    }
  },
  mounted () {
    if (this.defaultCollapsed) {
      this.$emit('input', this.defaultCollapsed)
    }
    if (this.breakpoint !== undefined) {
      on(window, 'resize', this.onWindowResize)
      this.matchMedia()
    }
  },
  beforeUnmount () {
    if (this.breakpoint !== undefined) {
      off(window, 'resize', this.onWindowResize)
    }
  },
  methods: {
    // 切换折叠状态
    toggleCollapse () {
      const modelValue = this.collapsible ? !this.modelValue : false
      this.$emit('update:modelValue', modelValue)
    },
    // 匹配媒体查询
    matchMedia () {
      let matchMedia
      if (window.matchMedia) {
        matchMedia = window.matchMedia
      }
      const mediaMatched = this.mediaMatched
      this.mediaMatched = matchMedia(`(max-width: ${dimensionMap[this.breakpoint]})`).matches

      if (this.mediaMatched !== mediaMatched) {
        this.$emit('input', this.mediaMatched)
      }
    },
    // 窗口大小变化处理
    onWindowResize () {
      this.matchMedia()
    }
  }
}
</script>
