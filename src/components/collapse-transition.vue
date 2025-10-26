<template>
  <!-- 折叠过渡动画容器 -->
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot />
  </transition>
</template>

<script>
import { addClass, removeClass } from '../utils/assist'

/**
 * 折叠过渡动画组件
 * 提供高度变化的折叠展开动画效果
 */
export default {
  name: 'CollapseTransition',
  props: {
    // 是否在初始渲染时应用过渡
    appear: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 进入动画开始前
     * @param {HTMLElement} el - 目标元素
     */
    beforeEnter (el) {
      addClass(el, 'collapse-transition')
      if (!el.dataset) el.dataset = {}

      // 保存原始内边距
      el.dataset.oldPaddingTop = el.style.paddingTop
      el.dataset.oldPaddingBottom = el.style.paddingBottom

      // 设置初始状态：高度为0，内边距为0
      el.style.height = '0'
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    },

    /**
     * 进入动画进行中
     * @param {HTMLElement} el - 目标元素
     */
    enter (el) {
      el.dataset.oldOverflow = el.style.overflow
      if (el.scrollHeight !== 0) {
        // 设置目标高度和内边距
        el.style.height = el.scrollHeight + 'px'
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
      } else {
        // 如果内容高度为0，恢复原始内边距
        el.style.height = ''
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
      }

      el.style.overflow = 'hidden'
    },

    /**
     * 进入动画完成后
     * @param {HTMLElement} el - 目标元素
     */
    afterEnter (el) {
      // Safari需要先移除类再重置高度
      removeClass(el, 'collapse-transition')
      el.style.height = ''
      el.style.overflow = el.dataset.oldOverflow
    },

    /**
     * 离开动画开始前
     * @param {HTMLElement} el - 目标元素
     */
    beforeLeave (el) {
      if (!el.dataset) el.dataset = {}
      // 保存当前样式
      el.dataset.oldPaddingTop = el.style.paddingTop
      el.dataset.oldPaddingBottom = el.style.paddingBottom
      el.dataset.oldOverflow = el.style.overflow

      // 设置当前高度
      el.style.height = el.scrollHeight + 'px'
      el.style.overflow = 'hidden'
    },

    /**
     * 离开动画进行中
     * @param {HTMLElement} el - 目标元素
     */
    leave (el) {
      if (el.scrollHeight !== 0) {
        addClass(el, 'collapse-transition')
        // 设置目标状态：高度为0，内边距为0
        el.style.height = 0
        el.style.paddingTop = 0
        el.style.paddingBottom = 0
      }
    },

    /**
     * 离开动画完成后
     * @param {HTMLElement} el - 目标元素
     */
    afterLeave (el) {
      // 恢复原始样式
      removeClass(el, 'collapse-transition')
      el.style.height = ''
      el.style.overflow = el.dataset.oldOverflow
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    }
  }
}
</script>
