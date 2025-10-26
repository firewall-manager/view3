<template>
  <!-- 加载动画过渡 -->
  <transition name="fade">
    <div
      v-if="fullscreenVisible"
      :class="classes"
    >
      <!-- 加载主体 -->
      <div :class="mainClasses">
        <!-- 加载点 -->
        <span :class="dotClasses" />
        <!-- 加载文本 -->
        <div :class="textClasses">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { oneOf } from '../utils/assist'
import ScrollbarMixins from '../mixins/scrollbar'

const prefixCls = 'ivu-spin'

/**
 * 加载组件
 * 用于显示加载状态的旋转动画组件
 */
export default {
  name: 'Spin',
  mixins: [ScrollbarMixins],
  props: {
    // 尺寸
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default () {
        return 'default'
      }
    },
    // 是否固定定位
    fix: {
      type: Boolean,
      default: false
    },
    // 是否全屏显示
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 是否显示文本
      showText: false,
      // 是否可见
      visible: false
    }
  },
  computed: {
    // 加载组件CSS类名
    classes () {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-fix`]: this.fix,
          [`${prefixCls}-show-text`]: this.showText,
          [`${prefixCls}-fullscreen`]: this.fullscreen
        }
      ]
    },
    // 主体CSS类名
    mainClasses () {
      return `${prefixCls}-main`
    },
    // 加载点CSS类名
    dotClasses () {
      return `${prefixCls}-dot`
    },
    // 文本CSS类名
    textClasses () {
      return `${prefixCls}-text`
    },
    // 全屏可见性
    fullscreenVisible () {
      if (this.fullscreen) {
        return this.visible
      } else {
        return true
      }
    }
  },
  watch: {
    // 监听可见性变化
    visible (val) {
      if (val) {
        this.addScrollEffect()
      } else {
        this.removeScrollEffect()
      }
    }
  },
  mounted () {
    this.showText = this.$slots.default !== undefined
  }
}
</script>
