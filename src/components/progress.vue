<template>
  <!-- 进度条容器 -->
  <div :class="wrapClasses">
    <!-- 进度条外层 -->
    <div :class="outerClasses">
      <!-- 进度条内层 -->
      <div :class="innerClasses">
        <!-- 进度条背景 -->
        <div
          :class="bgClasses"
          :style="bgStyle"
        >
          <!-- 内部文本 -->
          <div
            v-if="textInside"
            class="ivu-progress-inner-text"
          >
            {{ percent }}%
          </div>
        </div>
        <!-- 成功进度条背景 -->
        <div
          :class="successBgClasses"
          :style="successBgStyle"
        />
      </div>
    </div>
    <!-- 外部文本信息 -->
    <span
      v-if="!hideInfo && !textInside"
      :class="textClasses"
    >
      <slot>
        <!-- 状态图标 -->
        <span
          v-if="isStatus"
          :class="textInnerClasses"
        >
          <Icon :type="statusIcon" />
        </span>
        <!-- 百分比文本 -->
        <span
          v-else
          :class="textInnerClasses"
        >
          {{ percent }}%
        </span>
      </slot>
    </span>
  </div>
</template>
<script>
import Icon from './icon'
import { oneOf } from '../utils/assist'

const prefixCls = 'ivu-progress'

/**
 * 进度条组件
 * 用于显示任务进度的条状组件
 */
export default {
  name: 'Progress',
  components: { Icon },
  props: {
    // 进度百分比
    percent: {
      type: Number,
      default: 0
    },
    // 成功进度百分比
    successPercent: {
      type: Number,
      default: 0
    },
    // 进度条状态
    status: {
      validator (value) {
        return oneOf(value, ['normal', 'active', 'wrong', 'success'])
      },
      default: 'normal'
    },
    // 是否隐藏信息
    hideInfo: {
      type: Boolean,
      default: false
    },
    // 进度条宽度
    strokeWidth: {
      type: Number,
      default: 10
    },
    // 是否垂直显示
    vertical: {
      type: Boolean,
      default: false
    },
    // 进度条颜色
    strokeColor: {
      type: [String, Array]
    },
    // 文本是否在内部
    textInside: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 当前状态
      currentStatus: this.status
    }
  },
  computed: {
    // 是否为状态模式
    isStatus () {
      return this.currentStatus == 'wrong' || this.currentStatus == 'success'
    },
    // 状态图标
    statusIcon () {
      let type = ''
      switch (this.currentStatus) {
        case 'wrong':
          type = 'ios-close-circle'
          break
        case 'success':
          type = 'ios-checkmark-circle'
          break
      }

      return type
    },
    // 进度条背景样式
    bgStyle () {
      const style = this.vertical
        ? {
            height: `${this.percent}%`,
            width: `${this.strokeWidth}px`
          }
        : {
            width: `${this.percent}%`,
            height: `${this.strokeWidth}px`
          }

      if (this.strokeColor) {
        if (typeof this.strokeColor === 'string') {
          style['background-color'] = this.strokeColor
        } else {
          style['background-image'] = `linear-gradient(to right, ${this.strokeColor[0]} 0%, ${this.strokeColor[1]} 100%)`
        }
      }

      return style
    },
    // 成功进度条背景样式
    successBgStyle () {
      return this.vertical
        ? {
            height: `${this.successPercent}%`,
            width: `${this.strokeWidth}px`
          }
        : {
            width: `${this.successPercent}%`,
            height: `${this.strokeWidth}px`
          }
    },
    // 包装器CSS类名
    wrapClasses () {
      return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.currentStatus}`,
                    {
                      [`${prefixCls}-show-info`]: !this.hideInfo && !this.textInside,
                      [`${prefixCls}-vertical`]: this.vertical

                    }
      ]
    },
    // 文本CSS类名
    textClasses () {
      return `${prefixCls}-text`
    },
    // 内部文本CSS类名
    textInnerClasses () {
      return `${prefixCls}-text-inner`
    },
    // 外层CSS类名
    outerClasses () {
      return `${prefixCls}-outer`
    },
    // 内层CSS类名
    innerClasses () {
      return `${prefixCls}-inner`
    },
    // 背景CSS类名
    bgClasses () {
      return `${prefixCls}-bg`
    },
    // 成功背景CSS类名
    successBgClasses () {
      return `${prefixCls}-success-bg`
    }
  },
  watch: {
    // 监听进度变化
    percent (val, oldVal) {
      if (val < oldVal) {
        this.handleStatus(true)
      } else {
        this.handleStatus()
      }
    },
    // 监听状态变化
    status (val) {
      this.currentStatus = val
    }
  },
  created () {
    this.handleStatus()
  },
  methods: {
    // 处理状态变化
    handleStatus (isDown) {
      if (isDown) {
        this.currentStatus = 'normal'
        this.$emit('on-status-change', 'normal')
      } else {
        if (parseInt(this.percent, 10) == 100) {
          this.currentStatus = 'success'
          this.$emit('on-status-change', 'success')
        }
      }
    }
  }
}
</script>
