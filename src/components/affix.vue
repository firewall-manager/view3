<template>
  <!-- 固钉组件容器 -->
  <div ref="affix">
    <!-- 固钉内容区域 -->
    <div
      ref="point"
      :class="classes"
      :style="styles"
    >
      <slot />
    </div>
    <!-- 占位元素：当固钉激活时保持原位置 -->
    <div
      v-show="slot"
      :style="slotStyle"
    />
  </div>
</template>
<script>
import { on, off } from '../utils/dom'
const prefixCls = 'ivu-affix'

/**
 * 获取滚动位置
 * @param {Window|Element} target - 滚动目标元素
 * @param {Boolean} top - 是否获取垂直滚动位置
 * @return {Number} 滚动位置值
 */
function getScroll (target, top) {
  const prop = top ? 'pageYOffset' : 'pageXOffset'
  const method = top ? 'scrollTop' : 'scrollLeft'

  let ret = target[prop]

  // 如果目标元素没有滚动属性，使用文档元素
  if (typeof ret !== 'number') {
    ret = window.document.documentElement[method]
  }

  return ret
}

/**
 * 获取元素相对于文档的偏移位置
 * @param {Element} element - 目标元素
 * @return {Object} 包含top和left的偏移对象
 */
function getOffset (element) {
  const rect = element.getBoundingClientRect()

  const scrollTop = getScroll(window, true)
  const scrollLeft = getScroll(window)

  const docEl = window.document.body
  const clientTop = docEl.clientTop || 0
  const clientLeft = docEl.clientLeft || 0

  return {
    top: rect.top + scrollTop - clientTop,
    left: rect.left + scrollLeft - clientLeft
  }
}

/**
 * 固钉组件
 * 将页面元素固定在指定位置，支持顶部和底部固定
 */
export default {
  name: 'Affix',
  props: {
    // 距离顶部的偏移量
    offsetTop: {
      type: Number,
      default: 0
    },
    // 距离底部的偏移量
    offsetBottom: {
      type: Number
    },
    // 是否使用捕获模式监听事件
    useCapture: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 是否处于固钉状态
      affix: false,
      // 固钉时的样式
      styles: {},
      // 是否显示占位元素
      slot: false,
      // 占位元素样式
      slotStyle: {}
    }
  },
  computed: {
    // 固钉类型：top或bottom
    offsetType () {
      let type = 'top'
      if (this.offsetBottom >= 0) {
        type = 'bottom'
      }

      return type
    },
    // 组件CSS类名
    classes () {
      return [
        {
          [`${prefixCls}`]: this.affix
        }
      ]
    }
  },
  mounted () {
    // 监听滚动和窗口大小变化事件
    on(window, 'scroll', this.handleScroll, this.useCapture)
    on(window, 'resize', this.handleScroll, this.useCapture)
    // 组件挂载后立即检查固钉状态
    this.$nextTick(() => {
      this.handleScroll()
    })
  },
  beforeUnmount () {
    // 组件销毁前移除事件监听
    off(window, 'scroll', this.handleScroll, this.useCapture)
    off(window, 'resize', this.handleScroll, this.useCapture)
  },
  methods: {
    /**
     * 处理滚动事件
     * 根据滚动位置判断是否需要固钉
     */
    handleScroll () {
      const affix = this.affix
      const scrollTop = getScroll(window, true)
      const elOffset = getOffset(this.$refs.affix)
      const windowHeight = window.innerHeight
      const elHeight = this.$refs.affix.getElementsByTagName('div')[0].offsetHeight

      // 顶部固钉逻辑
      if ((elOffset.top - this.offsetTop) < scrollTop && this.offsetType == 'top' && !affix) {
        // 激活固钉状态
        this.affix = true
        // 设置占位元素尺寸
        this.slotStyle = {
          width: this.$refs.point.clientWidth + 'px',
          height: this.$refs.point.clientHeight + 'px'
        }
        this.slot = true
        // 设置固钉样式
        this.styles = {
          top: `${this.offsetTop}px`,
          left: `${elOffset.left}px`,
          width: `${this.$refs.affix.offsetWidth}px`
        }

        this.$emit('on-change', true)
      } else if ((elOffset.top - this.offsetTop) > scrollTop && this.offsetType == 'top' && affix) {
        // 取消固钉状态
        this.slot = false
        this.slotStyle = {}
        this.affix = false
        this.styles = null

        this.$emit('on-change', false)
      }

      // 底部固钉逻辑
      if ((elOffset.top + this.offsetBottom + elHeight) > (scrollTop + windowHeight) && this.offsetType == 'bottom' && !affix) {
        // 激活固钉状态
        this.affix = true
        // 设置固钉样式
        this.styles = {
          bottom: `${this.offsetBottom}px`,
          left: `${elOffset.left}px`,
          width: `${this.$refs.affix.offsetWidth}px`
        }

        this.$emit('on-change', true)
      } else if ((elOffset.top + this.offsetBottom + elHeight) < (scrollTop + windowHeight) && this.offsetType == 'bottom' && affix) {
        // 取消固钉状态
        this.affix = false
        this.styles = null

        this.$emit('on-change', false)
      }
    }
  }
}
</script>
