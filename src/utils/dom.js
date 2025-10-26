/**
 * DOM操作工具模块
 * 提供跨浏览器兼容的事件监听和移除功能
 */

// 服务端渲染标识
const isServer = false

/**
 * 添加事件监听器
 * 提供跨浏览器兼容的事件绑定功能
 * @param {Element} element - DOM元素
 * @param {string} event - 事件名称
 * @param {Function} handler - 事件处理函数
 * @param {boolean} useCapture - 是否使用捕获阶段，默认为false
 */
/* istanbul ignore next */
export const on = (function () {
  // 现代浏览器使用addEventListener
  if (!isServer && document.addEventListener) {
    return function (element, event, handler, useCapture = false) {
      if (element && event && handler) {
        element.addEventListener(event, handler, useCapture)
      }
    }
  } else {
    // 旧版IE使用attachEvent
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 移除事件监听器
 * 提供跨浏览器兼容的事件解绑功能
 * @param {Element} element - DOM元素
 * @param {string} event - 事件名称
 * @param {Function} handler - 事件处理函数
 * @param {boolean} useCapture - 是否使用捕获阶段，默认为false
 */
/* istanbul ignore next */
export const off = (function () {
  // 现代浏览器使用removeEventListener
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler, useCapture = false) {
      if (element && event) {
        element.removeEventListener(event, handler, useCapture)
      }
    }
  } else {
    // 旧版IE使用detachEvent
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()
