<template>
  <!-- 头像组件容器 -->
  <span
    :class="classes"
    :style="styles"
  >
    <!-- 图片头像 -->
    <img
      v-if="src"
      :src="src"
      @error="handleError"
    >
    <!-- 图标头像 -->
    <Icon
      v-else-if="icon || customIcon"
      :type="icon"
      :custom="customIcon"
    />
    <!-- 文字头像 -->
    <span
      v-else
      ref="children"
      :class="[prefixCls + '-string']"
      :style="childrenStyle"
    ><slot /></span>
  </span>
</template>
<script>
import Icon from './icon'
import { oneOf } from '../utils/assist'

const prefixCls = 'ivu-avatar'

// 预定义尺寸列表
const sizeList = ['small', 'large', 'default']

/**
 * 头像组件
 * 支持图片、图标和文字三种显示方式，可自定义形状和尺寸
 */
export default {
  name: 'Avatar',
  components: { Icon },
  props: {
    // 头像形状：圆形或方形
    shape: {
      validator (value) {
        return oneOf(value, ['circle', 'square'])
      },
      default: 'circle'
    },
    // 头像尺寸：预定义尺寸或自定义数值
    size: {
      type: [String, Number],
      default () {
        return 'default'
      }
    },
    // 图片地址
    src: {
      type: String
    },
    // 图标类型
    icon: {
      type: String
    },
    // 自定义图标
    customIcon: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // CSS类名前缀
      prefixCls: prefixCls,
      // 文字缩放比例
      scale: 1,
      // 子元素宽度
      childrenWidth: 0,
      // 是否显示插槽内容
      isSlotShow: false,
      // 插槽临时存储
      slotTemp: null
    }
  },
  computed: {
    // 组件CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.shape}`,
                    {
                      [`${prefixCls}-image`]: !!this.src,
                      [`${prefixCls}-icon`]: !!this.icon || !!this.customIcon,
                      [`${prefixCls}-${this.size}`]: oneOf(this.size, sizeList)
                    }
      ]
    },
    // 组件样式：处理自定义尺寸
    styles () {
      const style = {}
      if (this.size && !oneOf(this.size, sizeList)) {
        style.width = `${this.size}px`
        style.height = `${this.size}px`
        style.lineHeight = `${this.size}px`
        style.fontSize = `${this.size / 2}px`
      }
      return style
    },
    // 子元素样式：处理文字缩放和居中
    childrenStyle () {
      let style = {}
      if (this.isSlotShow) {
        style = {
          msTransform: `scale(${this.scale})`,
          WebkitTransform: `scale(${this.scale})`,
          transform: `scale(${this.scale})`,
          position: 'absolute',
          display: 'inline-block',
          left: `calc(50% - ${Math.round(this.childrenWidth / 2)}px)`
        }
      }
      return style
    }
  },
  watch: {
    // 监听尺寸变化，重新计算缩放
    size (val, oldVal) {
      if (val !== oldVal) this.setScale()
    }
  },
  beforeCreate () {
    // 创建前保存插槽引用
    this.slotTemp = this.$slots.default
  },
  mounted () {
    // 组件挂载后计算缩放
    this.setScale()
  },
  updated () {
    // 插槽内容更新时重新计算缩放
    if (this.$slots.default !== this.slotTemp) {
      this.slotTemp = this.$slots.default
      this.setScale()
    }
  },
  methods: {
    /**
     * 设置文字缩放比例
     * 当文字内容超出头像宽度时进行缩放
     */
    setScale () {
      this.isSlotShow = !this.src && !this.icon
      if (this.$refs.children) {
        // 重新设置子元素宽度以确保插槽居中
        this.childrenWidth = this.$refs.children.offsetWidth
        const avatarWidth = this.$el.getBoundingClientRect().width
        // 每边添加4px间隙以获得更好的性能
        if (avatarWidth - 8 < this.childrenWidth) {
          this.scale = (avatarWidth - 8) / this.childrenWidth
        } else {
          this.scale = 1
        }
      }
    },
    /**
     * 处理图片加载错误
     * @param {Event} e - 错误事件
     */
    handleError (e) {
      this.$emit('on-error', e)
    }
  }
}
</script>
