<template>
  <!-- 图标元素 -->
  <i
    :class="classes"
    :style="styles"
  />
</template>
<script>
const prefixCls = 'ion'

/**
 * 图标组件
 * 用于显示各种图标
 */
export default {
  name: 'Icon',
  props: {
    // 图标类型
    type: {
      type: String,
      default: ''
    },
    // 图标大小
    size: {
      type: [Number, String],
      required: false,
      default: ''
    },
    // 图标颜色
    color: {
      type: String,
      default: ''
    },
    // 自定义图标类名
    custom: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 图标CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-${this.type}`]: this.type !== '',
                      [`${this.custom}`]: this.custom !== ''
                    }
      ]
    },
    // 图标样式
    styles () {
      const style = {}

      if (this.size) {
        style['font-size'] = `${this.size}px`
      }

      if (this.color) {
        style.color = this.color
      }

      return style
    }
  }
}
</script>
