<template>
  <!-- 按钮组容器 -->
  <div :class="classes">
    <slot />
  </div>
</template>
<script>
import { oneOf } from '../utils/assist'

const prefixCls = 'ivu-btn-group'

/**
 * 按钮组组件
 * 将多个按钮组合在一起，支持不同尺寸、形状和布局方向
 */
export default {
  name: 'ButtonGroup',
  props: {
    // 按钮组尺寸
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default () {
        return 'default'
      }
    },
    // 按钮组形状
    shape: {
      validator (value) {
        return oneOf(value, ['circle', 'circle-outline'])
      }
    },
    // 是否垂直排列
    vertical: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 组件CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-${this.size}`]: !!this.size,
                      [`${prefixCls}-${this.shape}`]: !!this.shape,
                      [`${prefixCls}-vertical`]: this.vertical
                    }
      ]
    }
  }
}
</script>
