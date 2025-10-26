<template>
  <!-- 按钮组件，支持动态标签 -->
  <component
    :is="tagName"
    :class="classes"
    v-bind="tagProps"
    @click="handleClickLink"
  >
    <!-- 加载状态图标 -->
    <Icon
      v-if="loading"
      class="ivu-load-loop"
      type="ios-loading"
    />
    <!-- 普通状态图标 -->
    <Icon
      v-if="(icon || customIcon) && !loading"
      :type="icon"
      :custom="customIcon"
    />
    {{ ' ' }}
    <!-- 按钮文本内容 -->
    <span
      v-if="showSlot"
      ref="slot"
    ><slot /></span>
  </component>
</template>

<script>
import Icon from './icon'
import { oneOf } from '../utils/assist'
import mixinsLink from '../mixins/link'
import mixinsForm from '../mixins/form'

const prefixCls = 'ivu-btn'

/**
 * 按钮组件
 * 提供多种样式和功能的按钮，支持链接、图标、加载状态等
 */
export default {
  name: 'VButton',
  components: { Icon },
  mixins: [mixinsLink, mixinsForm],
  props: {
    // 按钮类型
    type: {
      validator (value) {
        return oneOf(value, ['default', 'primary', 'dashed', 'text', 'info', 'success', 'warning', 'error'])
      },
      default: 'default'
    },
    // 按钮形状
    shape: {
      validator (value) {
        return oneOf(value, ['circle', 'circle-outline'])
      },
      required: false,
      default: null
    },
    // 按钮尺寸
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      required: false,
      default () {
        return 'default'
      }
    },
    // 是否显示加载状态
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    // HTML按钮类型
    htmlType: {
      default: 'button',
      validator (value) {
        return oneOf(value, ['button', 'submit', 'reset'])
      }
    },
    // 图标类型
    icon: {
      type: String,
      default: ''
    },
    // 自定义图标
    customIcon: {
      type: String,
      default: ''
    },
    // 是否长按钮
    long: {
      type: Boolean,
      default: false
    },
    // 是否幽灵按钮
    ghost: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  computed: {
    // 是否显示插槽内容
    showSlot () {
      return !!this.$slots.default
    },
    // 按钮CSS类名
    classes () {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-long`]: this.long,
          [`${prefixCls}-${this.shape}`]: !!this.shape,
          [`${prefixCls}-${this.size}`]: this.size !== 'default',
          [`${prefixCls}-loading`]: this.loading != null && this.loading,
          [`${prefixCls}-icon-only`]: !this.showSlot && (!!this.icon || !!this.customIcon || this.loading),
          [`${prefixCls}-ghost`]: this.ghost
        }
      ]
    },
    // 是否为链接模式
    isHrefPattern () {
      return !!this.to
    },
    // 动态标签名：链接或按钮
    tagName () {
      const { isHrefPattern } = this
      return isHrefPattern ? 'a' : 'button'
    },
    // 标签属性：根据模式设置不同属性
    tagProps () {
      const { isHrefPattern } = this
      let props = {}

      if (isHrefPattern) {
        const { linkUrl, target } = this
        props = { href: linkUrl, target }
      } else {
        const { htmlType } = this
        props = { type: htmlType }
      }

      if (this.itemDisabled) {
        props.disabled = true
      }

      return props
    }
  },
  methods: {
    /**
     * 处理点击事件
     * @param {Event} event - 点击事件
     */
    handleClickLink (event) {
      this.$emit('click', event)
      const openInNewWindow = event.ctrlKey || event.metaKey

      this.handleCheckClick(event, openInNewWindow)
    }
  }
}
</script>
