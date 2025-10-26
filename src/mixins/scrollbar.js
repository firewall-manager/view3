/**
 * 滚动条混入模块
 * 用于Modal、$Spin、Drawer等组件，提供滚动条锁定和恢复功能
 */

import { getScrollBarSize } from '../utils/assist'

export default {
  props: {
    // 是否锁定滚动
    lockScroll: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * 检查滚动条状态
     * 检测页面是否有垂直滚动条，并计算滚动条宽度
     */
    checkScrollBar () {
      let fullWindowWidth = window.innerWidth
      if (!fullWindowWidth) { 
        // IE8兼容性处理：当window.innerWidth不可用时使用getBoundingClientRect
        const documentElementRect = document.documentElement.getBoundingClientRect()
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
      }
      this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
      if (this.bodyIsOverflowing) {
        this.scrollBarWidth = getScrollBarSize()
      }
    },
    
    /**
     * 检查遮罩层是否不可见
     * 检查所有模态框遮罩层是否都已隐藏
     * @returns {boolean} 所有遮罩层是否都不可见
     */
    checkMaskInVisible () {
      const masks = document.getElementsByClassName('ivu-modal-mask') || []
      return Array.from(masks).every(m => m.style.display === 'none' || m.classList.contains('fade-leave-to'))
    },
    
    /**
     * 设置滚动条补偿
     * 为body添加右边距以补偿滚动条宽度，防止页面跳动
     */
    setScrollBar () {
      if (this.bodyIsOverflowing && this.scrollBarWidth !== undefined) {
        document.body.style.paddingRight = `${this.scrollBarWidth}px`
      }
    },
    
    /**
     * 重置滚动条补偿
     * 移除body的右边距
     */
    resetScrollBar () {
      document.body.style.paddingRight = ''
    },
    
    /**
     * 添加滚动锁定效果
     * 锁定页面滚动并设置滚动条补偿
     */
    addScrollEffect () {
      if (!this.lockScroll) return
      this.checkScrollBar()
      this.setScrollBar()
      document.body.style.overflow = 'hidden'
    },
    
    /**
     * 移除滚动锁定效果
     * 恢复页面滚动并重置滚动条补偿
     */
    removeScrollEffect () {
      if (!this.lockScroll) return
      if (this.checkMaskInVisible()) {
        document.body.style.overflow = ''
        this.resetScrollBar()
      }
    }
  }
}
