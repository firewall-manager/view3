<template>
  <!-- 圆形进度条容器 -->
  <div
    :style="circleSize"
    :class="wrapClasses"
  >
    <!-- SVG圆形进度条 -->
    <svg viewBox="0 0 100 100">
      <!-- 渐变定义：当strokeColor为数组时使用 -->
      <defs v-if="showDefs">
        <linearGradient
          :id="id"
          x1="100%"
          y1="0%"
          x2="0%"
          y2="0%"
        >
          <stop
            offset="0%"
            :stop-color="strokeColor[0]"
          />
          <stop
            offset="100%"
            :stop-color="strokeColor[1]"
          />
        </linearGradient>
      </defs>
      <!-- 背景轨道 -->
      <path
        :d="pathString"
        :stroke="trailColor"
        :stroke-width="trailWidth"
        :fill-opacity="0"
        :style="trailStyle"
        :stroke-linecap="strokeLinecap"
      />
      <!-- 进度条 -->
      <path
        :d="pathString"
        :stroke-linecap="strokeLinecap"
        :stroke="strokeValue"
        :stroke-width="computedStrokeWidth"
        fill-opacity="0"
        :style="pathStyle"
      />
    </svg>
    <!-- 内部内容区域 -->
    <div :class="innerClasses">
      <slot />
    </div>
  </div>
</template>
<script>
import { oneOf } from '../../utils/assist'
import random from '../../utils/random_str'

const prefixCls = 'ivu-chart-circle'

/**
 * 圆形进度条组件
 * 使用SVG绘制圆形进度条，支持渐变色彩和仪表盘模式
 */
export default {
  name: 'ICircle',
  props: {
    // 进度百分比
    percent: {
      type: Number,
      default: 0
    },
    // 圆形尺寸
    size: {
      type: Number,
      default: 120
    },
    // 进度条宽度
    strokeWidth: {
      type: Number,
      default: 6
    },
    // 进度条颜色（支持字符串或数组渐变）
    strokeColor: {
      type: [String, Array],
      default: '#2d8cf0'
    },
    // 进度条端点样式
    strokeLinecap: {
      validator (value) {
        return oneOf(value, ['square', 'round'])
      },
      default: 'round'
    },
    // 背景轨道宽度
    trailWidth: {
      type: Number,
      default: 5
    },
    // 背景轨道颜色
    trailColor: {
      type: String,
      default: '#eaeef2'
    },
    // 是否仪表盘模式
    dashboard: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 渐变ID（用于SVG渐变）
      id: `ivu-chart-circle-${random(3)}`
    }
  },
  computed: {
    // 圆形尺寸样式
    circleSize () {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      }
    },
    // 计算后的进度条宽度（仪表盘模式且进度为0时隐藏）
    computedStrokeWidth () {
      return this.percent === 0 && this.dashboard ? 0 : this.strokeWidth
    },
    // 圆形半径
    radius () {
      return 50 - this.strokeWidth / 2
    },
    // SVG路径字符串
    pathString () {
      if (this.dashboard) {
        // 仪表盘模式：从底部开始的半圆
        return `M 50,50 m 0,${this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}`
      } else {
        // 普通模式：完整的圆
        return `M 50,50 m 0,-${this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}
                    a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}`
      }
    },
    // 圆形周长
    len () {
      return Math.PI * 2 * this.radius
    },
    // 背景轨道样式
    trailStyle () {
      let style = {}
      if (this.dashboard) {
        // 仪表盘模式：留出缺口
        style = {
          'stroke-dasharray': `${this.len - 75}px ${this.len}px`,
          'stroke-dashoffset': `-${75 / 2}px`,
          transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s'
        }
      }
      return style
    },
    // 进度条样式
    pathStyle () {
      let style = {}
      if (this.dashboard) {
        // 仪表盘模式：根据百分比计算进度
        style = {
          'stroke-dasharray': `${(this.percent / 100) * (this.len - 75)}px ${this.len}px`,
          'stroke-dashoffset': `-${75 / 2}px`,
          transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .6s ease 0s, stroke .6s, stroke-width .06s ease .6s'
        }
      } else {
        // 普通模式：从顶部开始的圆形进度
        style = {
          'stroke-dasharray': `${this.len}px ${this.len}px`,
          'stroke-dashoffset': `${((100 - this.percent) / 100 * this.len)}px`,
          transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
        }
      }
      return style
    },
    // 包装器CSS类名
    wrapClasses () {
      return `${prefixCls}`
    },
    // 内部内容CSS类名
    innerClasses () {
      return `${prefixCls}-inner`
    },
    // 进度条颜色值（支持渐变）
    strokeValue () {
      let color = this.strokeColor
      if (typeof this.strokeColor !== 'string') {
        color = `url(#${this.id})`
      }
      return color
    },
    // 是否显示渐变定义
    showDefs () {
      return typeof this.strokeColor !== 'string'
    }
  }
}
</script>
