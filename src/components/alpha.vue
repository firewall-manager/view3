<template>
  <!-- 透明度选择器组件 -->
  <div
    :class="[prefixCls + '-alpha']"
    tabindex="0"
    @click="$el.focus()"
    @keydown.esc="handleEscape"
    @keydown.left="handleLeft"
    @keydown.right="handleRight"
    @keydown.up="handleUp"
    @keydown.down="handleDown"
  >
    <!-- 棋盘格背景 -->
    <div :class="[prefixCls + '-alpha-checkboard-wrap']">
      <div :class="[prefixCls + '-alpha-checkerboard']" />
    </div>
    <!-- 透明度渐变背景 -->
    <div
      :style="gradientStyle"
      :class="[prefixCls + '-alpha-gradient']"
    />
    <!-- 交互容器 -->
    <div
      ref="container"
      :class="[prefixCls + '-alpha-container']"
      @mousedown="handleMouseDown"
      @touchmove="handleChange"
      @touchstart="handleChange"
    >
      <!-- 透明度指针 -->
      <div
        :style="{top: 0, left: `${value.a * 100}%`}"
        :class="[prefixCls + '-alpha-pointer']"
      >
        <div :class="[prefixCls + '-alpha-picker']" />
      </div>
    </div>
  </div>
</template>

<script>
import HSAMixin from '../mixins/color-hsa'
import Prefixes from '../mixins/color-prefix'
import { clamp, toRGBAString } from '../utils/color'

/**
 * 透明度选择器组件
 * 用于颜色选择器中选择颜色的透明度值
 */
export default {
  name: 'Alpha',

  mixins: [HSAMixin, Prefixes],

  data () {
    const normalStep = 1
    const jumpStep = 10

    return {
      // 键盘导航步长设置
      left: -normalStep,    // 左箭头：减少1%
      right: normalStep,    // 右箭头：增加1%
      up: jumpStep,         // 上箭头：增加10%
      down: -jumpStep,      // 下箭头：减少10%
      powerKey: 'shiftKey'  // 加速键：Shift键
    }
  },

  computed: {
    // 透明度渐变背景样式
    gradientStyle () {
      const { r, g, b } = this.value.rgba
      const start = toRGBAString({ r, g, b, a: 0 })
      const finish = toRGBAString({ r, g, b, a: 1 })

      return { background: `linear-gradient(to right, ${start} 0%, ${finish} 100%)` }
    }
  },

  methods: {
    /**
     * 改变透明度值
     * @param {Number} newAlpha - 新的透明度值（0-1）
     */
    change (newAlpha) {
      const { h, s, l } = this.value.hsl
      const { a } = this.value

      if (a !== newAlpha) {
        this.$emit('change', { h, s, l, a: newAlpha, source: 'rgba' })
      }
    },
    /**
     * 处理键盘滑动
     * @param {Event} e - 键盘事件
     * @param {Number} direction - 滑动方向
     */
    handleSlide (e, direction) {
      e.preventDefault()
      e.stopPropagation()

      // 按住Shift键时使用大步长，否则使用小步长
      this.change(clamp(e[this.powerKey] ? direction : Math.round(this.value.hsl.a * 100 + direction) / 100, 0, 1))
    },
    /**
     * 处理鼠标/触摸变化
     * @param {Event} e - 鼠标或触摸事件
     */
    handleChange (e) {
      e.preventDefault()
      e.stopPropagation()

      const left = this.getLeft(e)

      // 边界处理
      if (left < 0) {
        this.change(0)
        return
      }

      const { clientWidth } = this.$refs.container

      if (left > clientWidth) {
        this.change(1)
        return
      }

      // 根据鼠标位置计算透明度值
      this.change(Math.round(left * 100 / clientWidth) / 100)
    }
  }
}
</script>
