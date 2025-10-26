<template>
  <!-- 点状徽章 -->
  <span
    v-if="dot"
    ref="badge"
    :class="classes"
  >
    <slot />
    <sup
      v-show="badge"
      :class="dotClasses"
      :style="styles"
    />
  </span>
  <!-- 状态徽章 -->
  <span
    v-else-if="status || color"
    ref="badge"
    :class="classes"
    class="ivu-badge-status"
  >
    <span
      :class="statusClasses"
      :style="statusStyles"
    />
    <span class="ivu-badge-status-text"><slot name="text">{{ text }}</slot></span>
  </span>
  <!-- 数字徽章 -->
  <span
    v-else
    ref="badge"
    :class="classes"
  >
    <slot />
    <!-- 自定义计数插槽 -->
    <sup
      v-if="$slots.count"
      :style="styles"
      :class="customCountClasses"
    ><slot name="count" /></sup>
    <!-- 默认计数显示 -->
    <sup
      v-else-if="hasCount"
      v-show="badge"
      :style="styles"
      :class="countClasses"
    ><slot name="text">{{ finalCount }}</slot></sup>
  </span>
</template>
<script>
import { oneOf } from '../utils/assist'
// 预定义颜色列表
const initColorList = ['blue', 'green', 'red', 'yellow', 'pink', 'magenta', 'volcano', 'orange', 'gold', 'lime', 'cyan', 'geekblue', 'purple']
const prefixCls = 'ivu-badge'

/**
 * 徽章组件
 * 用于显示数字、状态或点状提示信息，支持多种显示模式
 */
export default {
  name: 'Badge',
  props: {
    // 显示的数字
    count: Number,
    // 是否显示为点状
    dot: {
      type: Boolean,
      default: false
    },
    // 数字溢出时的显示值
    overflowCount: {
      type: [Number, String],
      default: 99
    },
    // 自定义CSS类名
    className: String,
    // 是否显示零值
    showZero: {
      type: Boolean,
      default: false
    },
    // 状态文本
    text: {
      type: String,
      default: ''
    },
    // 状态类型
    status: {
      validator (value) {
        return oneOf(value, ['success', 'processing', 'default', 'error', 'warning'])
      }
    },
    // 徽章类型
    type: {
      validator (value) {
        return oneOf(value, ['success', 'primary', 'normal', 'error', 'warning', 'info'])
      }
    },
    // 偏移量数组 [top, right]
    offset: {
      type: Array
    },
    // 自定义颜色
    color: {
      type: String
    }
  },
  computed: {
    // 基础CSS类名
    classes () {
      return `${prefixCls}`
    },
    // 点状徽章CSS类名
    dotClasses () {
      return `${prefixCls}-dot`
    },
    // 数字徽章CSS类名
    countClasses () {
      return [
                    `${prefixCls}-count`,
                    {
                      [`${this.className}`]: !!this.className,
                      [`${prefixCls}-count-alone`]: this.alone,
                      [`${prefixCls}-count-${this.type}`]: !!this.type
                    }
      ]
    },
    // 自定义计数CSS类名
    customCountClasses () {
      return [
                    `${prefixCls}-count`,
                    `${prefixCls}-count-custom`,
                    {
                      [`${this.className}`]: !!this.className
                    }
      ]
    },
    // 状态徽章CSS类名
    statusClasses () {
      return [
                    `${prefixCls}-status-dot`,
                    {
                      [`${prefixCls}-status-${this.status}`]: !!this.status,
                      [`${prefixCls}-status-${this.color}`]: !!this.color && oneOf(this.color, initColorList)
                    }
      ]
    },
    // 状态徽章样式：处理自定义颜色
    statusStyles () {
      return oneOf(this.color, initColorList) ? {} : { backgroundColor: this.color }
    },
    // 徽章样式：处理偏移量
    styles () {
      const style = {}
      if (this.offset && this.offset.length === 2) {
        style['margin-top'] = `${this.offset[0]}px`
        style['margin-right'] = `${this.offset[1]}px`
      }
      return style
    },
    // 最终显示的数字：处理溢出和文本
    finalCount () {
      if (this.text !== '') return this.text
      return parseInt(this.count) >= parseInt(this.overflowCount) ? `${this.overflowCount}+` : this.count
    },
    // 是否显示徽章
    badge () {
      let status = false

      if (this.count) {
        status = !(parseInt(this.count) === 0)
      }

      if (this.dot) {
        status = true
        if (this.count !== null) {
          if (parseInt(this.count) === 0) {
            status = false
          }
        }
      }

      if (this.text !== '') status = true

      return status || this.showZero
    },
    // 是否有计数内容
    hasCount () {
      if (this.count || this.text !== '') return true
      if (this.showZero && parseInt(this.count) === 0) return true
      else return false
    },
    // 是否独立显示（无子内容）
    alone () {
      return this.$slots.default === undefined
    }
  }
}
</script>
