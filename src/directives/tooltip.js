/**
 * 工具提示指令模块
 * 提供动态创建和管理工具提示的功能
 */

import { createApp, h } from 'vue'

import Popper from 'popper.js/dist/umd/popper.js'
import Tooltip from '../components/dynamic-tooltip'

// 当前工具提示实例
let currentTooltip

/**
 * 移除当前工具提示
 * 清理当前显示的工具提示实例
 */
function removeCurrentTooltip () {
  if (currentTooltip) {
    currentTooltip.destroy()
    currentTooltip.popper.remove()
  }
}

// 监听全局点击事件，点击时关闭工具提示
document.addEventListener('click', (e) => {
  if (currentTooltip) {
    removeCurrentTooltip()
  }
})

export default {
  /**
   * 指令挂载时执行
   * 绑定鼠标事件并创建工具提示
   * @param {Element} el - 指令绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Object} binding.value - 工具提示配置
   * @param {boolean} binding.value.disabled - 是否禁用
   * @param {string} binding.value.trigger - 触发方式（mouseenter等）
   * @param {string} binding.value.placement - 提示位置
   */
  mounted (el, binding) {
    // 如果禁用，直接返回
    if (binding.value.disabled) return

    // 绑定鼠标进入事件
    el.addEventListener(binding.value.trigger || 'mouseenter', () => {
      // 先移除当前工具提示
      removeCurrentTooltip()

      // 创建工具提示Vue实例
      const instance = createApp({
        render () {
          return h(Tooltip, binding.value)
        }
      })

      // 创建DOM节点并挂载
      const node = document.createElement('div')
      const elem = instance.mount(node).$el

      // 添加到body
      document.body.appendChild(elem)

      // 创建Popper实例进行定位
      currentTooltip = new Popper(el, elem, {
        placement: binding.value.placement || 'top'
      })
    })

    // 绑定鼠标离开事件
    el.addEventListener('mouseleave', (event) => {
      // 如果鼠标离开到工具提示外部，则关闭工具提示
      if (!currentTooltip.popper.contains(event.toElement)) {
        removeCurrentTooltip()
      }
    })
  }
}
