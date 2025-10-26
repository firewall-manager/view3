<template>
  <!-- 警告提示组件，带淡入淡出动画 -->
  <transition name="fade">
    <div
      v-if="!closed"
      :class="wrapClasses"
    >
      <!-- 图标区域 -->
      <span
        v-if="showIcon"
        :class="iconClasses"
      >
        <slot name="icon">
          <Icon :type="iconType" />
        </slot>
      </span>
      <!-- 消息内容 -->
      <span :class="messageClasses"><slot /></span>
      <!-- 描述内容 -->
      <span :class="descClasses"><slot name="desc" /></span>
      <!-- 关闭按钮 -->
      <a
        v-if="closable"
        :class="closeClasses"
        @click="close"
      >
        <slot name="close">
          <Icon type="ios-close" />
        </slot>
      </a>
    </div>
  </transition>
</template>
<script>
import Icon from './icon'
import { oneOf } from '../utils/assist'

const prefixCls = 'ivu-alert'

/**
 * 警告提示组件
 * 用于显示重要的提示信息，支持不同类型和可关闭功能
 */
export default {
  name: 'Alert',
  components: { Icon },
  props: {
    // 警告类型：success、info、warning、error
    type: {
      validator (value) {
        return oneOf(value, ['success', 'info', 'warning', 'error'])
      },
      default: 'info'
    },
    // 是否显示关闭按钮
    closable: {
      type: Boolean,
      default: false
    },
    // 是否显示图标
    showIcon: {
      type: Boolean,
      default: false
    },
    // 是否作为顶部公告
    banner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 是否已关闭
      closed: false,
      // 是否有描述内容
      desc: false
    }
  },
  computed: {
    // 组件包装器CSS类名
    wrapClasses () {
      return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.type}`,
                    {
                      [`${prefixCls}-with-icon`]: this.showIcon,
                      [`${prefixCls}-with-desc`]: this.desc,
                      [`${prefixCls}-with-banner`]: this.banner
                    }
      ]
    },
    // 消息内容CSS类名
    messageClasses () {
      return `${prefixCls}-message`
    },
    // 描述内容CSS类名
    descClasses () {
      return `${prefixCls}-desc`
    },
    // 关闭按钮CSS类名
    closeClasses () {
      return `${prefixCls}-close`
    },
    // 图标CSS类名
    iconClasses () {
      return `${prefixCls}-icon`
    },
    // 根据类型获取图标类型
    iconType () {
      let type = ''

      switch (this.type) {
        case 'success':
          type = 'ios-checkmark-circle'
          break
        case 'info':
          type = 'ios-information-circle'
          break
        case 'warning':
          type = 'ios-alert'
          break
        case 'error':
          type = 'ios-close-circle'
          break
      }

      // 如果有描述内容，使用轮廓图标
      if (this.desc) type += '-outline'
      return type
    }
  },
  mounted () {
    // 检查是否有描述内容插槽
    this.desc = this.$slots.desc !== undefined
  },
  methods: {
    /**
     * 关闭警告提示
     * @param {Event} e - 点击事件
     */
    close (e) {
      this.closed = true
      this.$emit('on-close', e)
    }
  }
}
</script>
