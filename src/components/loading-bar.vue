<template>
  <!-- 加载条过渡动画 -->
  <transition name="fade">
    <div
      v-show="show"
      :class="classes"
      :style="outerStyles"
    >
      <!-- 加载条内部进度 -->
      <div
        :class="innerClasses"
        :style="styles"
      />
    </div>
  </transition>
</template>
<script>
//    import { oneOf } from '../../utils/assist';

const prefixCls = 'ivu-loading-bar'

/**
 * 加载条组件
 * 用于显示页面加载进度的条状组件
 */
export default {
  name: 'LoadingBar',
  props: {
    // 进度条颜色
    color: {
      type: String,
      default: 'primary'
    },
    // 失败状态颜色
    failedColor: {
      type: String,
      default: 'error'
    },
    // 进度条高度
    height: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      percent: 0,
      //                color: 'primary',
      //                failedColor: 'error',
      //                height: 2,
      status: 'success',
      show: false
    }
  },
  computed: {
    classes () {
      return `${prefixCls}`
    },
    innerClasses () {
      return [
                    `${prefixCls}-inner`,
                    {
                      [`${prefixCls}-inner-color-primary`]: this.color === 'primary' && this.status === 'success',
                      [`${prefixCls}-inner-failed-color-error`]: this.failedColor === 'error' && this.status === 'error'
                    }
      ]
    },
    outerStyles () {
      return {
        height: `${this.height}px`
      }
    },
    styles () {
      const style = {
        width: `${this.percent}%`,
        height: `${this.height}px`
      }

      if (this.color !== 'primary' && this.status === 'success') {
        style.backgroundColor = this.color
      }

      if (this.failedColor !== 'error' && this.status === 'error') {
        style.backgroundColor = this.failedColor
      }

      return style
    }
  }
}
</script>
