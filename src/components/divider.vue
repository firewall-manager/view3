<template>
  <!-- 分割线容器 -->
  <div :class="classes">
    <!-- 分割线文本内容 -->
    <span
      v-if="hasSlot"
      :class="slotClasses"
    >
      <slot />
    </span>
  </div>
</template>

<script>
import { oneOf } from '../utils/assist'

const prefixCls = 'ivu-divider'

/**
 * 分割线组件
 * 用于分隔内容的分割线，支持水平和垂直方向
 */
export default {
  name: 'Divider',
  props: {
    // 分割线类型
    type: {
      type: String,
      default: 'horizontal',
      validator (value) {
        return oneOf(value, ['horizontal', 'vertical'])
      }
    },
    // 文本位置
    orientation: {
      type: String,
      default: 'center',
      validator (value) {
        return oneOf(value, ['left', 'right', 'center'])
      }
    },
    // 是否虚线
    dashed: {
      type: Boolean,
      default: false
    },
    // 分割线尺寸
    size: {
      validator (value) {
        return oneOf(value, ['small', 'default'])
      },
      default: 'default'
    },
    // 是否纯文本样式
    plain: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 是否有插槽内容
    hasSlot () {
      return !!this.$slots.default
    },
    // 分割线CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.type}`,
                    `${prefixCls}-${this.size}`,
                    {
                      [`${prefixCls}-with-text`]: this.hasSlot && this.orientation === 'center',
                      [`${prefixCls}-with-text-${this.orientation}`]: this.hasSlot,
                      [`${prefixCls}-dashed`]: !!this.dashed,
                      [`${prefixCls}-plain`]: this.plain
                    }
      ]
    },
    // 文本内容CSS类名
    slotClasses () {
      return [
                    `${prefixCls}-inner-text`
      ]
    }
  }
}
</script>
