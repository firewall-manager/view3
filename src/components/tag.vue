<template>
  <!-- 带淡入淡出效果的标签 -->
  <transition
    v-if="fade"
    name="fade"
  >
    <div
      :class="classes"
      :style="wraperStyles"
      @click="check"
    >
      <!-- 圆点 -->
      <span
        v-if="showDot"
        :class="dotClasses"
        :style="bgColorStyle"
      />
      <!-- 标签文本 -->
      <span
        :class="textClasses"
        :style="textColorStyle"
      ><slot /></span>
      <!-- 关闭按钮 -->
      <Icon
        v-if="closable"
        :class="iconClass"
        :color="lineColor"
        type="ios-close"
        @click.stop="close"
      />
    </div>
  </transition>
  <!-- 普通标签 -->
  <div
    v-else
    :class="classes"
    :style="wraperStyles"
    @click="check"
  >
    <!-- 圆点 -->
    <span
      v-if="showDot"
      :class="dotClasses"
      :style="bgColorStyle"
    />
    <!-- 标签文本 -->
    <span
      :class="textClasses"
      :style="textColorStyle"
    ><slot /></span>
    <!-- 关闭按钮 -->
    <Icon
      v-if="closable"
      :class="iconClass"
      :color="lineColor"
      type="ios-close"
      @click.stop="close"
    />
  </div>
</template>
<script>
import Icon from './icon'
import { oneOf } from '../utils/assist'
const prefixCls = 'ivu-tag'
// 预设颜色列表
const initColorList = ['default', 'primary', 'success', 'warning', 'error', 'blue', 'green', 'red', 'yellow', 'pink', 'magenta', 'volcano', 'orange', 'gold', 'lime', 'cyan', 'geekblue', 'purple']
// 自定义颜色列表
const colorList = ['pink', 'magenta', 'volcano', 'orange', 'gold', 'lime', 'cyan', 'geekblue', 'purple']

/**
 * 标签组件
 * 用于显示标签信息，支持多种颜色和样式
 */
export default {
  name: 'Tag',
  components: { Icon },
  props: {
    // 是否可关闭
    closable: {
      type: Boolean,
      default: false
    },
    // 是否可选择
    checkable: {
      type: Boolean,
      default: false
    },
    // 是否选中
    checked: {
      type: Boolean,
      default: true
    },
    // 颜色
    color: {
      type: String,
      default: 'default'
    },
    // 类型
    type: {
      validator (value) {
        return oneOf(value, ['border', 'dot'])
      }
    },
    // 名称
    name: {
      type: [String, Number]
    },
    // 是否淡入淡出
    fade: {
      type: Boolean,
      default: true
    },
    // 尺寸
    size: {
      validator (value) {
        return oneOf(value, ['default', 'medium', 'large'])
      },
      default: 'default'
    }
  },
  data () {
    return {
      // 是否选中
      isChecked: this.checked
    }
  },
  computed: {
    // 标签CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    `${prefixCls}-size-${this.size}`,
                    {
                      [`${prefixCls}-${this.color}`]: !!this.color && oneOf(this.color, initColorList),
                      [`${prefixCls}-${this.type}`]: !!this.type,
                      [`${prefixCls}-closable`]: this.closable,
                      [`${prefixCls}-checked`]: this.isChecked
                    }
      ]
    },
    // 包装器样式
    wraperStyles () {
      return oneOf(this.color, initColorList) ? {} : { background: this.isChecked ? this.defaultTypeColor : 'transparent', borderWidth: '1px', borderStyle: 'solid', borderColor: ((this.type !== 'dot' && this.type !== 'border' && this.isChecked) ? this.borderColor : this.lineColor), color: this.lineColor }
    },
    // 文本CSS类名
    textClasses () {
      return [
                    `${prefixCls}-text`,
                    this.type === 'border' ? (oneOf(this.color, initColorList) ? `${prefixCls}-color-${this.color}` : '') : '',
                    (this.type !== 'dot' && this.type !== 'border' && this.color !== 'default') ? (this.isChecked && colorList.indexOf(this.color) < 0 ? `${prefixCls}-color-white` : '') : ''
      ]
    },
    // 圆点CSS类名
    dotClasses () {
      return `${prefixCls}-dot-inner`
    },
    // 图标CSS类名
    iconClass () {
      if (this.type === 'dot') {
        return ''
      } else if (this.type === 'border') {
        return oneOf(this.color, initColorList) ? `${prefixCls}-color-${this.color}` : ''
      } else {
        return this.color !== undefined ? (this.color === 'default' ? '' : 'rgb(255, 255, 255)') : ''
      }
    },
    // 是否显示圆点
    showDot () {
      return !!this.type && this.type === 'dot'
    },
    // 线条颜色
    lineColor () {
      if (this.type === 'dot') {
        return ''
      } else if (this.type === 'border') {
        return this.color !== undefined ? (oneOf(this.color, initColorList) ? '' : this.color) : ''
      } else {
        return this.color !== undefined ? (this.color === 'default' ? '' : 'rgb(255, 255, 255)') : ''
      }
    },
    // 边框颜色
    borderColor () {
      return this.color !== undefined ? (this.color === 'default' ? '' : this.color) : ''
    },
    // 圆点颜色
    dotColor () {
      return this.color !== undefined ? (oneOf(this.color, initColorList) ? '' : this.color) : ''
    },
    // 文本颜色样式
    textColorStyle () {
      return oneOf(this.color, initColorList) ? {} : ((this.type !== 'dot' && this.type !== 'border') ? (this.isChecked ? { color: this.lineColor } : {}) : { color: this.lineColor })
    },
    // 背景颜色样式
    bgColorStyle () {
      return oneOf(this.color, initColorList) ? {} : { background: this.dotColor }
    },
    // 默认类型颜色
    defaultTypeColor () {
      return (this.type !== 'dot' && this.type !== 'border') ? (this.color !== undefined ? (oneOf(this.color, initColorList) ? '' : this.color) : '') : ''
    }
  },
  watch: {
    checked (val) {
      this.isChecked = val
    }
  },
  methods: {
    // 关闭标签
    close (event) {
      if (this.name === undefined) {
        this.$emit('on-close', event)
      } else {
        this.$emit('on-close', event, this.name)
      }
    },
    // 切换选中状态
    check () {
      if (!this.checkable) return
      const checked = !this.isChecked
      this.isChecked = checked
      if (this.name === undefined) {
        this.$emit('on-change', checked)
      } else {
        this.$emit('on-change', checked, this.name)
      }
    }
  }
}
</script>
