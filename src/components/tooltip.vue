<template>
  <!-- 提示框容器 -->
  <div
    :class="[prefixCls]"
    @mouseenter="handleShowPopper"
    @mouseleave="handleClosePopper"
  >
    <!-- 触发元素 -->
    <div
      ref="reference"
      :class="[prefixCls + '-rel']"
    >
      <slot />
    </div>
    <!-- 提示框内容 -->
    <transition name="fade">
      <div
        v-show="!disabled && (visible || always)"
        ref="popper"
        v-transfer-dom
        :class="dropdownCls"
        :style="dropStyles"
        :data-transfer="transfer"
        @mouseenter="handleShowPopper"
        @mouseleave="handleClosePopper"
      >
        <div :class="[prefixCls + '-content']">
          <!-- 箭头 -->
          <div :class="[prefixCls + '-arrow']" />
          <!-- 内容区域 -->
          <div
            :class="innerClasses"
            :style="innerStyles"
          >
            <slot name="content">
              {{ content }}
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Popper from './popper'
import TransferDom from '../directives/transfer-dom'
import { oneOf } from '../utils/assist'
import { transferIndex, transferIncrease } from '../utils/transfer-queue'

const prefixCls = 'ivu-tooltip'

/**
 * 提示框组件
 * 用于显示提示信息的浮动组件
 */
export default {
  name: 'Tooltip',
  directives: { TransferDom },
  mixins: [Popper],
  props: {
    // 显示位置
    placement: {
      validator (value) {
        return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'])
      },
      default: 'bottom'
    },
    // 提示内容
    content: {
      type: [String, Number],
      default: ''
    },
    // 延迟时间
    delay: {
      type: Number,
      default: 100
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否受控（在此属性下，提示框在鼠标离开时不会关闭）
    controlled: { // under this prop,Tooltip will not close when mouseleave
      type: Boolean,
      default: false
    },
    // 是否总是显示
    always: {
      type: Boolean,
      default: false
    },
    // 是否转移到body
    transfer: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 主题
    theme: {
      validator (value) {
        return oneOf(value, ['dark', 'light'])
      },
      default: 'dark'
    },
    // 最大宽度
    maxWidth: {
      type: [String, Number]
    },
    // 转移类名
    transferClassName: {
      type: String
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      // 样式前缀
      prefixCls: prefixCls,
      // 转移索引
      tIndex: this.handleGetIndex()
    }
  },
  computed: {
    // 内部样式
    innerStyles () {
      const styles = {}
      if (this.maxWidth) styles['max-width'] = `${this.maxWidth}px`
      return styles
    },
    // 内部CSS类名
    innerClasses () {
      return [
                    `${prefixCls}-inner`,
                    {
                      [`${prefixCls}-inner-with-width`]: !!this.maxWidth
                    }
      ]
    },
    // 下拉样式
    dropStyles () {
      const styles = {}
      if (this.transfer) styles['z-index'] = 1060 + this.tIndex

      return styles
    },
    // 下拉CSS类名
    dropdownCls () {
      return [
                    `${prefixCls}-popper`,
                    `${prefixCls}-${this.theme}`,
                    {
                      [prefixCls + '-transfer']: this.transfer,
                      [this.transferClassName]: this.transferClassName
                    }
      ]
    }
  },
  watch: {
    content () {
      this.updatePopper()
    }
  },
  mounted () {
    if (this.always) {
      this.updatePopper()
    }
  },
  methods: {
    // 处理显示提示框
    handleShowPopper () {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.visible = true
      }, this.delay)
      this.tIndex = this.handleGetIndex()
    },
    // 处理关闭提示框
    handleClosePopper () {
      if (this.timeout) {
        clearTimeout(this.timeout)
        if (!this.controlled) {
          this.timeout = setTimeout(() => {
            this.visible = false
          }, 100)
        }
      }
    },
    // 获取转移索引
    handleGetIndex () {
      transferIncrease()
      return transferIndex
    }
  }
}
</script>
