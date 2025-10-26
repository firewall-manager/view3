/**
 * 颜色选择器HSA混入模块
 * 提供颜色选择器相关的交互功能，包括鼠标拖拽、键盘导航等
 */

import Emitter from './emitter'
import handleEscapeMixin from './handle-escape-mixin'
import { getTouches } from '../utils/color'
import { on, off } from '../utils/dom'

export default {
  mixins: [Emitter, handleEscapeMixin],

  props: {
    // 是否获得焦点
    focused: {
      type: Boolean,
      default: false
    },
    // 颜色值对象
    modelValue: {
      type: Object,
      default: undefined
    }
  },

  // 组件卸载前清理事件监听器
  beforeUnmount () {
    this.unbindEventListeners()
  },

  // 组件创建后处理焦点
  created () {
    if (this.focused) {
      setTimeout(() => this.$el.focus(), 1)
    }
  },

  methods: {
    /**
     * 处理左方向键
     * @param {Event} e - 键盘事件
     */
    handleLeft (e) {
      this.handleSlide(e, this.left, 'left')
    },
    
    /**
     * 处理右方向键
     * @param {Event} e - 键盘事件
     */
    handleRight (e) {
      this.handleSlide(e, this.right, 'right')
    },
    
    /**
     * 处理上方向键
     * @param {Event} e - 键盘事件
     */
    handleUp (e) {
      this.handleSlide(e, this.up, 'up')
    },
    
    /**
     * 处理下方向键
     * @param {Event} e - 键盘事件
     */
    handleDown (e) {
      this.handleSlide(e, this.down, 'down')
    },
    /**
     * 处理鼠标按下事件
     * 开始拖拽操作，绑定全局鼠标事件
     * @param {Event} e - 鼠标事件
     */
    handleMouseDown (e) {
      this.dispatch('ColorPicker', 'on-dragging', true)
      this.handleChange(e, true)
      // 绑定全局鼠标移动和释放事件
      on(window, 'mousemove', this.handleChange)
      on(window, 'mouseup', this.handleMouseUp)
    },
    
    /**
     * 处理鼠标释放事件
     * 结束拖拽操作
     */
    handleMouseUp () {
      this.unbindEventListeners()
    },
    
    /**
     * 解绑事件监听器
     * 清理全局鼠标事件，并通知颜色选择器结束拖拽状态
     */
    unbindEventListeners () {
      // 移除全局鼠标事件监听器
      off(window, 'mousemove', this.handleChange)
      off(window, 'mouseup', this.handleMouseUp)
      // 这个延时是必需的，确保点击外部处理程序有机会在mouseup移除拖拽标志之前运行
      setTimeout(() => this.dispatch('ColorPicker', 'on-dragging', false), 1)
    },
    /**
     * 获取鼠标相对于容器的水平位置
     * @param {Event} e - 鼠标或触摸事件
     * @returns {number} 相对水平位置
     */
    getLeft (e) {
      const { container } = this.$refs
      const xOffset = container.getBoundingClientRect().left + window.pageXOffset
      const pageX = e.pageX || getTouches(e, 'PageX')

      return pageX - xOffset
    },
    
    /**
     * 获取鼠标相对于容器的垂直位置
     * @param {Event} e - 鼠标或触摸事件
     * @returns {number} 相对垂直位置
     */
    getTop (e) {
      const { container } = this.$refs
      const yOffset = container.getBoundingClientRect().top + window.pageYOffset
      const pageY = e.pageY || getTouches(e, 'PageY')

      return pageY - yOffset
    }
  }
}
