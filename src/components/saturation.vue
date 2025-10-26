<template>
  <!-- 饱和度选择器容器 -->
  <div
    :class="[prefixCls + '-saturation-wrapper']"
    tabindex="0"
    @keydown.esc="handleEscape"
    @click="$el.focus()"
    @keydown.left="handleLeft"
    @keydown.right="handleRight"
    @keydown.up="handleUp"
    @keydown.down="handleDown"
  >
    <!-- 饱和度选择区域 -->
    <div
      ref="container"
      :style="bgColorStyle"
      :class="[prefixCls + '-saturation']"
      @mousedown="handleMouseDown"
    >
      <!-- 白色渐变层 -->
      <div :class="[prefixCls + '-saturation--white']" />
      <!-- 黑色渐变层 -->
      <div :class="[prefixCls + '-saturation--black']" />
      <!-- 选择指针 -->
      <div
        :style="pointerStyle"
        :class="[prefixCls + '-saturation-pointer']"
      >
        <div :class="[prefixCls + '-saturation-circle']" />
      </div>
    </div>
  </div>
</template>

<script>
import HSAMixin from '../mixins/color-hsa'
import Prefixes from '../mixins/color-prefix'
import { clamp, getIncrement } from '../utils/color'
import { on, off } from '../utils/dom'

/**
 * 饱和度选择器组件
 * 用于选择颜色的饱和度和亮度
 */
export default {
  name: 'Saturation',

  mixins: [HSAMixin, Prefixes],

  emits: ['change'],

  data () {
    const normalStep = 0.01

    return {
      // 左移步长
      left: -normalStep,
      // 右移步长
      right: normalStep,
      // 上移步长
      up: normalStep,
      // 下移步长
      down: -normalStep,
      // 倍数
      multiplier: 10,
      // 功能键
      powerKey: 'shiftKey'
    }
  },

  computed: {
    // 背景颜色样式
    bgColorStyle () {
      return { background: `hsl(${this.modelValue.hsv.h}, 100%, 50%)` }
    },
    // 指针样式
    pointerStyle () {
      return { top: `${-(this.modelValue.hsv.v * 100) + 1 + 100}%`, left: `${this.modelValue.hsv.s * 100}%` }
    }
  },

  methods: {
    // 改变颜色值
    change (h, s, v, a) {
      this.$emit('change', { h, s, v, a, source: 'hsva' })
    },
    // 处理滑动
    handleSlide (e, direction, key) {
      e.preventDefault()
      e.stopPropagation()

      const isPowerKey = e[this.powerKey]
      const increment = isPowerKey ? direction * this.multiplier : direction
      const { h, s, v, a } = this.modelValue.hsv
      const saturation = clamp(s + getIncrement(key, ['left', 'right'], increment), 0, 1)
      const bright = clamp(v + getIncrement(key, ['up', 'down'], increment), 0, 1)

      this.change(h, saturation, bright, a)
    },
    // 处理改变
    handleChange (e) {
      e.preventDefault()
      e.stopPropagation()

      const { clientWidth, clientHeight } = this.$refs.container
      const left = clamp(this.getLeft(e), 0, clientWidth)
      const top = clamp(this.getTop(e), 0, clientHeight)
      const saturation = left / clientWidth
      const bright = clamp(1 - top / clientHeight, 0, 1)

      this.change(this.modelValue.hsv.h, saturation, bright, this.modelValue.hsv.a)
    },
    // 处理鼠标按下
    handleMouseDown (e) {
      HSAMixin.methods.handleMouseDown.call(this, e)
      //            window.addEventListener('mouseup', this.handleChange, false);
      on(window, 'mouseup', this.handleChange)
    },
    // 解绑事件监听器
    unbindEventListeners (e) {
      HSAMixin.methods.unbindEventListeners.call(this, e)
      //            window.removeEventListener('mouseup', this.handleChange);
      off(window, 'mouseup', this.handleChange)
    }
  }
}
</script>
