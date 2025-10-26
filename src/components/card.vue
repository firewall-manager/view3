<template>
  <!-- 卡片组件，支持动态标签 -->
  <component
    :is="tagName"
    :class="classes"
    v-bind="tagProps"
    @click="handleClickLink"
  >
    <!-- 卡片头部 -->
    <div
      v-if="showHead"
      :class="headClasses"
    >
      <slot name="title">
        <p v-if="title">
          <Icon
            v-if="icon"
            :type="icon"
          />
          <span>{{ title }}</span>
        </p>
      </slot>
    </div>
    <!-- 卡片额外内容 -->
    <div
      v-if="showExtra"
      :class="extraClasses"
    >
      <slot name="extra" />
    </div>
    <!-- 卡片主体内容 -->
    <div
      :class="bodyClasses"
      :style="bodyStyles"
    >
      <slot />
    </div>
  </component>
</template>
<script>
import Icon from './icon'
import mixinsLink from '../mixins/link'
const prefixCls = 'ivu-card'
// 默认内边距
const defaultPadding = 16

/**
 * 卡片组件
 * 用于展示内容块，支持标题、图标、边框、阴影等样式
 */
export default {
  name: 'Card',
  components: { Icon },
  mixins: [mixinsLink],
  props: {
    // 是否显示边框
    bordered: {
      type: Boolean,
      default: true
    },
    // 是否禁用悬停效果
    disHover: {
      type: Boolean,
      default: false
    },
    // 是否显示阴影
    shadow: {
      type: Boolean,
      default: false
    },
    // 内边距
    padding: {
      type: Number,
      default: defaultPadding
    },
    // 卡片标题
    title: {
      type: String,
      required: false,
      default: ''
    },
    // 标题图标
    icon: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      // 是否显示头部
      showHead: true,
      // 是否显示额外内容
      showExtra: true
    }
  },
  computed: {
    // 卡片CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-bordered`]: this.bordered && !this.shadow,
                      [`${prefixCls}-dis-hover`]: this.disHover || this.shadow,
                      [`${prefixCls}-shadow`]: this.shadow
                    }
      ]
    },
    // 头部CSS类名
    headClasses () {
      return `${prefixCls}-head`
    },
    // 额外内容CSS类名
    extraClasses () {
      return `${prefixCls}-extra`
    },
    // 主体CSS类名
    bodyClasses () {
      return `${prefixCls}-body`
    },
    // 主体样式：处理自定义内边距
    bodyStyles () {
      if (this.padding !== defaultPadding) {
        return {
          padding: `${this.padding}px`
        }
      } else {
        return ''
      }
    },
    // 是否为链接模式
    isHrefPattern () {
      const { to } = this
      return !!to
    },
    // 动态标签名：链接或div
    tagName () {
      const { isHrefPattern } = this
      return isHrefPattern ? 'a' : 'div'
    },
    // 标签属性：根据模式设置不同属性
    tagProps () {
      const { isHrefPattern } = this
      if (isHrefPattern) {
        const { linkUrl, target } = this
        return { href: linkUrl, target }
      } else {
        return {}
      }
    }
  },
  mounted () {
    // 检查是否显示头部和额外内容
    this.showHead = this.title || this.$slots.title !== undefined
    this.showExtra = this.$slots.extra !== undefined
  },
  methods: {
    /**
     * 处理点击链接事件
     * @param {Event} event - 点击事件
     */
    handleClickLink (event) {
      if (!this.isHrefPattern) return
      const openInNewWindow = event.ctrlKey || event.metaKey
      this.handleCheckClick(event, openInNewWindow)
    }
  }
}
</script>
