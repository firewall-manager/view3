<template>
  <!-- 行容器 -->
  <div
    :class="classes"
    :style="styles"
  >
    <slot />
  </div>
</template>
<script>
import { oneOf, findComponentDownward, findBrothersComponents } from '../utils/assist'

const prefixCls = 'ivu-row'

/**
 * 行组件
 * 栅格布局中的行容器组件
 */
export default {
  name: 'Row',
  props: {
    // 布局类型（已无效，强制flex）
    type: {
      validator (value) {
        return oneOf(value, ['flex'])
      }
    },
    // 垂直对齐方式
    align: {
      validator (value) {
        return oneOf(value, ['top', 'middle', 'bottom'])
      }
    },
    // 水平排列方式
    justify: {
      validator (value) {
        return oneOf(value, ['start', 'end', 'center', 'space-around', 'space-between'])
      }
    },
    // 栅格间隔
    gutter: {
      type: Number,
      default: 0
    },
    // 自定义类名
    className: String,
    // 是否换行
    wrap: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 行CSS类名
    classes () {
      return [
                    // todo 4.5.0 已无效，强制 flex
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-${this.type}`]: !!this.type,
                      [`${prefixCls}-${this.type}-${this.align}`]: !!this.align,
                      [`${prefixCls}-${this.type}-${this.justify}`]: !!this.justify,
                      [`${prefixCls}-${this.align}`]: !!this.align,
                      [`${prefixCls}-${this.justify}`]: !!this.justify,
                      [`${this.className}`]: !!this.className,
                      [`${prefixCls}-no-wrap`]: !this.wrap
                    }
      ]
    },
    // 行样式
    styles () {
      let style = {}
      if (this.gutter !== 0) {
        style = {
          marginLeft: this.gutter / -2 + 'px',
          marginRight: this.gutter / -2 + 'px'
        }
      }

      return style
    }
  },
  watch: {
    // 监听栅格间隔变化
    gutter (val) {
      this.updateGutter(val)
    }
  },
  methods: {
    // 更新栅格间隔
    updateGutter (val) {
      // 这里会嵌套寻找，把 Col 里的 Row 里的 Col 也找到，所以用 兄弟找
      //                const Cols = findComponentsDownward(this, 'iCol');
      const Col = findComponentDownward(this, 'Col')
      const Cols = findBrothersComponents(Col, 'Col', false)
      if (Cols.length) {
        Cols.forEach((child) => {
          if (val !== 0) {
            child.gutter = val
          }
        })
      }
    }
  }
}
</script>
