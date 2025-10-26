/**
 * 弹出框指令模块
 * 提供动态创建和管理弹出框的功能
 */

import { createApp, h } from 'vue'

import mountWithContext from '../utils/mount-with-context'
import Popper from 'popper.js/dist/umd/popper.js'
import Popover from '../components/popover'
import DynamicPopover from '../plugins/dynamic-popover'

// 当前弹出框实例
let currentPopover
// 当前观察器实例
let currentObserver

/**
 * 移除当前弹出框
 * 清理当前显示的弹出框实例和相关观察器
 */
function removeCurrentPopover () {
  if (currentPopover) {
    currentPopover.destroy()
    currentPopover.popper.remove()
    currentObserver.unobserve(currentPopover.popper)
  }
}

// 监听全局点击事件，实现点击外部关闭弹出框
document.addEventListener('click', (e) => {
  if (currentPopover && !currentPopover.popper.contains(event.target)) {
    removeCurrentPopover()
  }
})

// 监听DOM加载完成事件，设置路由变化监听
document.addEventListener('DOMContentLoaded', () => {
  if (DynamicPopover.app.config.globalProperties.$router) {
    DynamicPopover.app.config.globalProperties.$router.afterEach(() => {
      removeCurrentPopover()
    })
  }
})

export default {
  // 导出移除弹出框函数，供外部使用
  removeCurrentPopover,
  
  /**
   * 指令挂载时执行
   * 绑定触发事件并创建弹出框
   * @param {Element} el - 指令绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Object} binding.value - 弹出框配置
   * @param {boolean} binding.value.disabled - 是否禁用
   * @param {string} binding.value.trigger - 触发方式（click、mouseenter等）
   * @param {string} binding.value.placement - 弹出位置
   */
  mounted (el, binding) {
    // 如果禁用，直接返回
    if (binding.value.disabled) return

    // 绑定触发事件
    el.addEventListener(binding.value.trigger || 'click', () => {
      // 先移除当前弹出框
      removeCurrentPopover()

      // 创建弹出框Vue实例
      const instance = createApp({
        render () {
          return h(Popover, binding.value)
        }
      })

      // 使用上下文挂载
      const elem = mountWithContext(instance, DynamicPopover.app)

      // 如果是鼠标悬停触发，添加鼠标离开事件
      if (binding.value.trigger === 'mouseenter') {
        elem.addEventListener('mouseleave', (event) => {
          if (!elem.contains(event.toElement)) {
            removeCurrentPopover()
          }
        })
      }

      // 创建或获取弹出框容器
      const parentElem = document.querySelector('[data-popover-container]') || document.createElement('div')
      parentElem.setAttribute('data-popover-container', 'true')
      parentElem.classList.add('mdm')
      parentElem.appendChild(elem)
      document.body.appendChild(parentElem)

      // 判断是否需要反向Y轴位置（当元素靠近底部时）
      const isInverseYPlacement = document.body.getBoundingClientRect().height - el.getBoundingClientRect().y < 200

      // 创建Popper实例
      currentPopover = new Popper(el, elem, { 
        placement: (isInverseYPlacement ? 'right-end' : binding.value.placement) || 'top'
      })

      // 保存触发方式
      currentPopover.trigger = binding.value.trigger

      // 创建ResizeObserver监听尺寸变化
      currentObserver = new ResizeObserver(() => {
        currentPopover.update()
      })

      // 如果是反向位置，开始观察元素尺寸变化
      if (isInverseYPlacement) {
        currentObserver.observe(elem)
      }
    })

    // 如果是鼠标悬停触发，添加元素鼠标离开事件
    if (binding.value.trigger === 'mouseenter') {
      el.addEventListener('mouseleave', (event) => {
        if (!currentPopover.popper.contains(event.toElement)) {
          removeCurrentPopover()
        }
      })
    }
  }
}
