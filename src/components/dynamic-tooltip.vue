<template>
  <!-- 动态提示框容器 -->
  <div
    :class="[prefixCls]"
  >
    <!-- 提示框过渡动画 -->
    <transition name="fade">
      <div
        ref="popper"
        :class="dropdownCls"
        :style="dropStyles"
      >
        <!-- 提示框内容 -->
        <div :class="[prefixCls + '-content']">
          <!-- 提示框箭头 -->
          <div :class="[prefixCls + '-arrow']" />
          <!-- 提示框内部内容 -->
          <div
            :class="innerClasses"
            :style="innerStyles"
          >
            <slot name="content">
              {{ content }}
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const prefixCls = 'ivu-tooltip'

/**
 * 动态提示框组件
 * 用于显示动态内容的提示框
 */
export default {
  name: 'DynamicTooltip',
  props: {
    // 提示框内容
    content: {
      type: [String, Number],
      default: ''
    },
    // 提示框主题
    theme: {
      validator (value) {
        return ['dark', 'light'].includes(value)
      },
      default: 'dark'
    },
    // 最大宽度
    maxWidth: {
      type: [String, Number]
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      prefixCls: prefixCls
    }
  },
  computed: {
    innerStyles () {
      const styles = {}

      if (this.maxWidth) styles['max-width'] = `${this.maxWidth}px`

      return styles
    },
    innerClasses () {
      return [
                    `${prefixCls}-inner`,
                    {
                      [`${prefixCls}-inner-with-width`]: !!this.maxWidth
                    }
      ]
    },
    dropStyles () {
      const styles = {}

      styles['z-index'] = 1060

      return styles
    },
    dropdownCls () {
      return [
                    `${prefixCls}-popper`,
                    `${prefixCls}-${this.theme}`
      ]
    }
  }
}
</script>
