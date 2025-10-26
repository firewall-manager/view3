<template>
  <!-- 分割面板容器 -->
  <div
    ref="outerWrapper"
    :class="wrapperClasses"
  >
    <!-- 水平分割 -->
    <div
      v-if="isHorizontal"
      :class="`${prefix}-horizontal`"
    >
      <!-- 左面板 -->
      <div
        :style="{right: `${anotherOffset}%`}"
        class="left-pane"
        :class="paneClasses"
      >
        <slot name="left" />
      </div>
      <!-- 分割触发器 -->
      <div
        :class="`${prefix}-trigger-con`"
        :style="{left: `${offset}%`}"
        @mousedown="handleMousedown"
      >
        <slot name="trigger">
          <trigger mode="vertical" />
        </slot>
      </div>
      <!-- 右面板 -->
      <div
        :style="{left: `${offset}%`}"
        class="right-pane"
        :class="paneClasses"
      >
        <slot name="right" />
      </div>
    </div>
    <!-- 垂直分割 -->
    <div
      v-else
      :class="`${prefix}-vertical`"
    >
      <!-- 上面板 -->
      <div
        :style="{bottom: `${anotherOffset}%`}"
        class="top-pane"
        :class="paneClasses"
      >
        <slot name="top" />
      </div>
      <!-- 分割触发器 -->
      <div
        :class="`${prefix}-trigger-con`"
        :style="{top: `${offset}%`}"
        @mousedown="handleMousedown"
      >
        <slot name="trigger">
          <trigger mode="horizontal" />
        </slot>
      </div>
      <!-- 下面板 -->
      <div
        :style="{top: `${offset}%`}"
        class="bottom-pane"
        :class="paneClasses"
      >
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>

<script>
import { oneOf } from '../utils/assist'
import { on, off } from '../utils/dom'
import Trigger from './trigger.vue'

/**
 * 分割面板组件
 * 用于创建可调整大小的分割面板布局
 */
export default {
  name: 'Split',
  components: {
    Trigger
  },
  props: {
    // 分割位置
    modelValue: {
      type: [Number, String],
      default: 0.5
    },
    // 分割模式
    mode: {
      validator (value) {
        return oneOf(value, ['horizontal', 'vertical'])
      },
      default: 'horizontal'
    },
    // 最小尺寸
    min: {
      type: [Number, String],
      default: '40px'
    },
    // 最大尺寸
    max: {
      type: [Number, String],
      default: '40px'
    }
  },
  emits: ['update:modelValue', 'on-moving', 'on-move-end', 'on-move-start'],
  /**
         * Events
         * @on-move-start 开始拖拽
         * @on-moving 拖拽中 返回值：事件对象，但是在事件对象中加入了两个参数：atMin(当前是否在最小值处), atMax(当前是否在最大值处)
         * @on-move-end 拖拽结束
         */
  data () {
    return {
      prefix: 'ivu-split',
      // 当前偏移量
      offset: 0,
      // 旧偏移量
      oldOffset: 0,
      // 是否正在拖拽
      isMoving: false,
      // 计算后的最小值
      computedMin: 0,
      // 计算后的最大值
      computedMax: 0,
      // 当前值
      currentValue: 0.5
    }
  },
  computed: {
    // 包装器CSS类名
    wrapperClasses () {
      return [
                    `${this.prefix}-wrapper`,
                    this.isMoving ? 'no-select' : ''
      ]
    },
    // 面板CSS类名
    paneClasses () {
      return [
                    `${this.prefix}-pane`,
                    {
                      [`${this.prefix}-pane-moving`]: this.isMoving
                    }
      ]
    },
    // 是否为水平分割
    isHorizontal () {
      return this.mode === 'horizontal'
    },
    // 另一个面板的偏移量
    anotherOffset () {
      return 100 - this.offset
    },
    // 值是否为像素单位
    valueIsPx () {
      return typeof this.modelValue === 'string'
    },
    // 偏移尺寸属性名
    offsetSize () {
      return this.isHorizontal ? 'offsetWidth' : 'offsetHeight'
    }
  },
  watch: {
    // 监听分割位置变化
    modelValue (val) {
      if (val !== this.currentValue) {
        this.currentValue = val
        this.computeOffset()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.computeOffset()
    })

    on(window, 'resize', this.computeOffset)
  },
  beforeUnmount () {
    off(window, 'resize', this.computeOffset)
  },
  methods: {
    // 像素转百分比
    px2percent (numerator, denominator) {
      return parseFloat(numerator) / parseFloat(denominator)
    },
    // 获取计算后的阈值
    getComputedThresholdValue (type) {
      const size = this.$refs.outerWrapper[this.offsetSize]
      if (this.valueIsPx) return typeof this[type] === 'string' ? this[type] : size * this[type]
      else return typeof this[type] === 'string' ? this.px2percent(this[type], size) : this[type]
    },
    // 获取最小值
    getMin (value1, value2) {
      if (this.valueIsPx) return `${Math.min(parseFloat(value1), parseFloat(value2))}px`
      else return Math.min(value1, value2)
    },
    // 获取最大值
    getMax (value1, value2) {
      if (this.valueIsPx) return `${Math.max(parseFloat(value1), parseFloat(value2))}px`
      else return Math.max(value1, value2)
    },
    // 获取另一个面板偏移量
    getAnotherOffset (value) {
      let res = 0
      if (this.valueIsPx) res = `${this.$refs.outerWrapper[this.offsetSize] - parseFloat(value)}px`
      else res = 1 - value
      return res
    },
    // 处理拖拽移动
    handleMove (e) {
      const pageOffset = this.isHorizontal ? e.pageX : e.pageY
      const offset = pageOffset - this.initOffset
      const outerWidth = this.$refs.outerWrapper[this.offsetSize]
      let value = this.valueIsPx ? `${parseFloat(this.oldOffset) + offset}px` : (this.px2percent(outerWidth * this.oldOffset + offset, outerWidth))
      const anotherValue = this.getAnotherOffset(value)
      if (parseFloat(value) <= parseFloat(this.computedMin)) value = this.getMax(value, this.computedMin)
      if (parseFloat(anotherValue) <= parseFloat(this.computedMax)) value = this.getAnotherOffset(this.getMax(anotherValue, this.computedMax))
      e.atMin = this.modelValue === this.computedMin
      e.atMax = this.valueIsPx ? this.getAnotherOffset(this.modelValue) === this.computedMax : this.getAnotherOffset(this.modelValue).toFixed(5) === this.computedMax.toFixed(5)

      this.$emit('update:modelValue', value)
      this.$emit('on-moving', e)
    },
    // 处理拖拽结束
    handleUp () {
      this.isMoving = false
      off(document, 'mousemove', this.handleMove)
      off(document, 'mouseup', this.handleUp)
      this.$emit('on-move-end')
    },
    // 处理鼠标按下
    handleMousedown (e) {
      this.initOffset = this.isHorizontal ? e.pageX : e.pageY
      this.oldOffset = this.modelValue
      this.isMoving = true
      on(document, 'mousemove', this.handleMove)
      on(document, 'mouseup', this.handleUp)
      this.$emit('on-move-start')
    },
    // 计算偏移量
    computeOffset () {
      this.$nextTick(() => {
        this.computedMin = this.getComputedThresholdValue('min')
        this.computedMax = this.getComputedThresholdValue('max')
        // https://github.com/view-design/ViewUI/commit/d827b6405c365b9b7c130448f509724564cad8c1
        // todo 这里对 px 没有适配，先还原
        this.offset = (this.valueIsPx ? this.px2percent(this.modelValue, this.$refs.outerWrapper[this.offsetSize]) : this.modelValue) * 10000 / 100
      })
    }
  }
}
</script>
