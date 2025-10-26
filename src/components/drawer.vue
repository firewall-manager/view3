<template>
  <!-- 抽屉组件容器 -->
  <div
    v-transfer-dom
    :data-transfer="transfer"
  >
    <!-- 遮罩层 -->
    <transition name="fade">
      <div
        v-show="visible"
        v-if="mask"
        :class="maskClasses"
        :style="maskStyle"
        @click="handleMask"
      />
    </transition>
    <!-- 抽屉包装器 -->
    <div
      :class="wrapClasses"
      @click="handleWrapClick"
    >
      <!-- 抽屉主体 -->
      <transition :name="'move-' + placement">
        <div
          v-show="visible"
          :class="classes"
          :style="mainStyles"
        >
          <!-- 抽屉内容 -->
          <div
            ref="content"
            :class="contentClasses"
          >
            <!-- 关闭按钮 -->
            <a
              v-if="closable"
              class="ivu-drawer-close"
              @click="close"
            >
              <slot name="close">
                <Icon type="ios-close" />
              </slot>
            </a>
            <!-- 抽屉头部 -->
            <div
              v-if="showHead"
              :class="[prefixCls + '-header']"
            >
              <slot name="header">
                <div :class="[prefixCls + '-header-inner']">
                  {{ dataTitle || title }}
                </div>
              </slot>
            </div>
            <!-- 抽屉主体内容 -->
            <div
              :class="[prefixCls + '-body']"
              :style="styles"
            >
              <slot />
            </div>
          </div>
          <!-- 拖拽调整宽度触发器 -->
          <div
            v-if="draggable"
            class="ivu-drawer-drag"
            :class="{ 'ivu-drawer-drag-left': placement === 'left' }"
            @mousedown="handleTriggerMousedown"
          >
            <slot name="trigger">
              <div class="ivu-drawer-drag-move-trigger">
                <div class="ivu-drawer-drag-move-trigger-point">
                  <i /><i /><i /><i /><i />
                </div>
              </div>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import Icon from './icon'
import { oneOf, findBrothersComponents, findComponentsUpward } from '../utils/assist'
import TransferDom from '../directives/transfer-dom'
import Emitter from '../mixins/emitter'
import ScrollbarMixins from '../mixins/scrollbar'

import { on, off } from '../utils/dom'

const prefixCls = 'ivu-drawer'

/**
 * 抽屉组件
 * 从页面边缘滑出的面板，支持拖拽调整宽度
 */
export default {
  name: 'Drawer',
  components: { Icon },
  directives: { TransferDom },
  mixins: [Emitter, ScrollbarMixins],
  props: {
    // 是否显示抽屉
    modelValue: {
      type: Boolean,
      default: false
    },
    // 抽屉标题
    title: {
      type: String
    },
    // 抽屉宽度
    width: {
      type: [Number, String],
      default: 256
    },
    // 是否显示关闭按钮
    closable: {
      type: Boolean,
      default: true
    },
    // 点击遮罩是否关闭
    maskClosable: {
      type: Boolean,
      default: true
    },
    // 是否显示遮罩
    mask: {
      type: Boolean,
      default: true
    },
    // 遮罩样式
    maskStyle: {
      type: Object
    },
    // 抽屉内容样式
    styles: {
      type: Object
    },
    // 是否可滚动
    scrollable: {
      type: Boolean,
      default: false
    },
    // 点击外部处理函数
    handleClickOutside: {
      type: Function,
      default () {
        this.close()
      }
    },
    // 抽屉位置
    placement: {
      validator (value) {
        return oneOf(value, ['left', 'right'])
      },
      default: 'right'
    },
    // 层级
    zIndex: {
      type: Number,
      default: 1000
    },
    // 是否转移到body
    transfer: {
      type: Boolean,
      default () {
        return true
      }
    },
    // 自定义类名
    className: {
      type: String
    },
    // 是否内嵌模式
    inner: {
      type: Boolean,
      default: false
    },
    // 是否可拖拽调整宽度
    draggable: {
      type: Boolean,
      default: false
    },
    // 关闭前回调
    beforeClose: Function
  },
  emits: ['visible-change', 'close', 'update:modelValue'],
  data () {
    return {
      prefixCls: prefixCls,
      visible: this.modelValue,
      wrapShow: false,
      showHead: true,
      canMove: false,
      dragWidth: this.width,
      wrapperWidth: this.width,
      wrapperLeft: 0,
      minWidth: 256,
      dataTitle: ''
    }
  },
  computed: {
    wrapClasses () {
      return [
                    `${prefixCls}-wrap`,
                    {
                      [`${prefixCls}-hidden`]: !this.wrapShow,
                      [`${this.className}`]: !!this.className,
                      [`${prefixCls}-no-mask`]: !this.mask,
                      [`${prefixCls}-wrap-inner`]: this.inner,
                      [`${prefixCls}-wrap-dragging`]: this.canMove
                    }
      ]
    },
    mainStyles () {
      const style = {}

      const width = parseInt(this.dragWidth)

      const styleWidth = {
        width: width <= 100 ? `${width}%` : `${width}px`
      }

      Object.assign(style, styleWidth)

      return style
    },
    contentClasses () {
      return [
                    `${prefixCls}-content`,
                    {
                      [`${prefixCls}-content-no-mask`]: !this.mask
                    }
      ]
    },
    classes () {
      return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.placement}`,
                    {
                      [`${prefixCls}-no-header`]: !this.showHead,
                      [`${prefixCls}-inner`]: this.inner
                    }
      ]
    },
    maskClasses () {
      return [
                    `${prefixCls}-mask`,
                    {
                      [`${prefixCls}-mask-inner`]: this.inner
                    }
      ]
    }
  },
  watch: {
    modelValue (val) {
      this.visible = val
    },
    visible (val) {
      if (val === false) {
        this.timer = setTimeout(() => {
          this.wrapShow = false
          // #4831 Check if there are any drawers left at the parent level
          const brotherDrawers = findBrothersComponents(this, 'Drawer') || []
          const parentDrawers = findComponentsUpward(this, 'Drawer') || []

          const otherDrawers = [].concat(brotherDrawers).concat(parentDrawers)

          const isScrollDrawer = otherDrawers.some(item => item.visible && !item.scrollable)

          if (!isScrollDrawer) {
            this.removeScrollEffect()
          }
        }, 300)
      } else {
        if (this.timer) clearTimeout(this.timer)
        this.wrapShow = true
        if (!this.scrollable) {
          this.addScrollEffect()
        }
      }
      this.broadcast('Table', 'on-visible-change', val)
      this.broadcast('Slider', 'on-visible-change', val) // #2852
      this.$emit('visible-change', val)
    },
    scrollable (val) {
      if (!val) {
        this.addScrollEffect()
      } else {
        this.removeScrollEffect()
      }
    },
    title (val) {
      if (this.$slots.header === undefined) {
        this.showHead = !!val
      }
    },
    width (val) {
      this.dragWidth = val
    }
  },
  mounted () {
    if (this.visible) {
      this.wrapShow = true
    }

    let showHead = true

    if (this.$slots.header === undefined && !this.title) {
      showHead = false
    }

    this.showHead = showHead

    on(document, 'mousemove', this.handleMousemove)
    on(document, 'mouseup', this.handleMouseup)
    this.handleSetWrapperWidth()

    document.addEventListener('keydown', this.EscClose)
  },
  beforeUnmount () {
    off(document, 'mousemove', this.handleMousemove)
    off(document, 'mouseup', this.handleMouseup)
    document.removeEventListener('keydown', this.EscClose)
    this.removeScrollEffect()
  },
  methods: {
    setTitle (value) {
      this.dataTitle = value
      this.showHead = !!value
    },
    EscClose (e) {
      if (this.visible) {
        if (e.keyCode === 27) {
          this.handleClickOutside()
        }
      }
    },
    close () {
      if (!this.beforeClose) {
        return this.handleClose()
      }

      const before = this.beforeClose()

      if (before && before.then) {
        before.then(() => {
          this.handleClose()
        })
      } else {
        this.handleClose()
      }
    },
    handleClose () {
      this.visible = false
      this.$emit('update:modelValue', false)
      this.$emit('close')
    },
    handleMask () {
      if (this.maskClosable && this.mask && !window.getSelection().toString()) {
        this.handleClickOutside()
      }
    },
    handleWrapClick (event) {
      // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
      const className = event.target.getAttribute('class')
      if (className && className.indexOf(`${prefixCls}-wrap`) > -1) this.handleMask()
    },
    handleMousemove (event) {
      if (!this.canMove || !this.draggable) return
      // 更新容器宽度和距离左侧页面距离，如果是window则距左侧距离为0
      this.handleSetWrapperWidth()
      const left = event.pageX - this.wrapperLeft
      // 如果抽屉方向为右边，宽度计算需用容器宽度减去left
      let width = this.placement === 'right' ? this.wrapperWidth - left : left
      // 限定最小宽度
      width = Math.max(width, parseFloat(this.minWidth))
      event.atMin = width === parseFloat(this.minWidth)
      // 如果当前width不大于100，视为百分比
      if (width <= 100) width = (width / this.wrapperWidth) * 100
      this.dragWidth = width
      this.$emit('on-resize-width', parseInt(this.dragWidth))
    },
    handleSetWrapperWidth () {
      const {
        width,
        left
      } = this.$el.getBoundingClientRect()
      this.wrapperWidth = width
      this.wrapperLeft = left
    },
    handleMouseup () {
      if (!this.draggable) return
      this.canMove = false
    },
    handleTriggerMousedown () {
      this.canMove = true
      // 防止鼠标选中抽屉中文字，造成拖动trigger触发浏览器原生拖动行为
      window.getSelection().removeAllRanges()
    }
  }
}
</script>
