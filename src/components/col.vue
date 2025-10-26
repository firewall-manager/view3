<template>
  <!-- 栅格列容器 -->
  <div
    :class="classes"
    :style="styles"
  >
    <slot />
  </div>
</template>
<script>
import { findComponentUpward } from '../utils/assist'
const prefixCls = 'ivu-col'

/**
 * 解析flex属性值
 * @param {Number|String} flex - flex值
 * @returns {String} 解析后的flex值
 */
function parseFlex (flex) {
  if (typeof flex === 'number') {
    return `${flex} ${flex} auto`
  }

  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`
  }

  return flex
}

/**
 * 栅格列组件
 * 基于24栅格系统的列组件，支持响应式布局和flex布局
 */
export default {
  name: 'Col',
  props: {
    // 栅格占据的列数
    span: [Number, String],
    // 栅格顺序
    order: [Number, String],
    // 栅格左侧的间隔格数
    offset: [Number, String],
    // 栅格向右移动格数
    push: [Number, String],
    // 栅格向左移动格数
    pull: [Number, String],
    // 自定义类名
    className: String,
    // 屏幕 < 576px 响应式栅格
    xs: [Number, Object],
    // 屏幕 ≥ 576px 响应式栅格
    sm: [Number, Object],
    // 屏幕 ≥ 768px 响应式栅格
    md: [Number, Object],
    // 屏幕 ≥ 992px 响应式栅格
    lg: [Number, Object],
    // 屏幕 ≥ 1200px 响应式栅格
    xl: [Number, Object],
    // 屏幕 ≥ 1600px 响应式栅格
    xxl: [Number, Object],
    // flex布局属性
    flex: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      // 栅格间隔
      gutter: 0
    }
  },
  computed: {
    // 栅格列CSS类名
    classes () {
      const classList = [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-span-${this.span}`]: this.span,
                      [`${prefixCls}-order-${this.order}`]: this.order,
                      [`${prefixCls}-offset-${this.offset}`]: this.offset,
                      [`${prefixCls}-push-${this.push}`]: this.push,
                      [`${prefixCls}-pull-${this.pull}`]: this.pull,
                      [`${this.className}`]: !!this.className
                    }
      ];

      // 处理响应式栅格类名
      ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
        if (typeof this[size] === 'number') {
          classList.push(`${prefixCls}-span-${size}-${this[size]}`)
        } else if (typeof this[size] === 'object') {
          const props = this[size]
          Object.keys(props).forEach(prop => {
            classList.push(
              prop !== 'span'
                ? `${prefixCls}-${size}-${prop}-${props[prop]}`
                : `${prefixCls}-span-${size}-${props[prop]}`
            )
          })
        }
      })

      return classList
    },
    // 栅格列样式
    styles () {
      let style = {}
      // 处理栅格间隔
      if (this.gutter !== 0) {
        style = {
          paddingLeft: this.gutter / 2 + 'px',
          paddingRight: this.gutter / 2 + 'px'
        }
      }

      // 处理flex布局
      if (this.flex) {
        style.flex = parseFlex(this.flex)
      }

      return style
    }
  },
  mounted () {
    // 组件挂载后更新栅格间隔
    this.updateGutter()
  },
  beforeUnmount () {
    // 组件卸载前更新栅格间隔
    this.updateGutter()
  },
  methods: {
    /**
     * 更新栅格间隔
     */
    updateGutter () {
      const Row = findComponentUpward(this, 'Row')
      if (Row) {
        Row.updateGutter(Row.gutter)
      }
    }
  }
}
</script>
