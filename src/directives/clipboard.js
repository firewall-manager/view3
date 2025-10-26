/**
 * 剪贴板指令模块
 * 提供复制和剪切文本到剪贴板的功能
 */

import Clipboard from 'clipboard/dist/clipboard'

// Vue剪贴板配置
const VueClipboardConfig = {
  autoSetContainer: false,  // 是否自动设置容器
  appendToBody: true        // 是否添加到body
}

const VueClipboard = {
  /**
   * 指令挂载时执行
   * 根据指令参数创建剪贴板实例或设置回调函数
   * @param {Element} el - 指令绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {string} binding.arg - 指令参数（success、error、cut等）
   * @param {*} binding.value - 指令值（要复制的文本或回调函数）
   * @param {Object} vnode - Vue虚拟节点
   */
  mounted (el, binding, vnode) {
    if (binding.arg === 'success') {
      // 设置成功回调函数
      el._vClipboard_success = binding.value
    } else if (binding.arg === 'error') {
      // 设置错误回调函数
      el._vClipboard_error = binding.value
    } else {
      // 创建剪贴板实例
      const clipboard = new Clipboard(el, {
        text () { return binding.value },  // 要复制的文本
        action () { return binding.arg === 'cut' ? 'cut' : 'copy' },  // 操作类型
        container: VueClipboardConfig.autoSetContainer ? el : undefined  // 容器
      })
      
      // 绑定成功事件
      clipboard.on('success', (e) => {
        const callback = el._vClipboard_success
        callback && callback(e)
      })
      
      // 绑定错误事件
      clipboard.on('error', (e) => {
        const callback = el._vClipboard_error
        callback && callback(e)
      })
      
      // 保存剪贴板实例到元素上
      el._vClipboard = clipboard
    }
  },
  /**
   * 指令更新时执行
   * 更新剪贴板配置或回调函数
   * @param {Element} el - 指令绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   */
  updated (el, binding) {
    if (binding.arg === 'success') {
      // 更新成功回调函数
      el._vClipboard_success = binding.value
    } else if (binding.arg === 'error') {
      // 更新错误回调函数
      el._vClipboard_error = binding.value
    } else {
      // 更新剪贴板实例的文本和操作
      el._vClipboard.text = () => { return binding.value }
      el._vClipboard.action = () => { return binding.arg === 'cut' ? 'cut' : 'copy' }
    }
  },
  
  /**
   * 指令卸载时执行
   * 清理剪贴板实例和相关属性
   * @param {Element} el - 指令绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   */
  unmount (el, binding) {
    if (binding.arg === 'success') {
      // 删除成功回调函数
      delete el._vClipboard_success
    } else if (binding.arg === 'error') {
      // 删除错误回调函数
      delete el._vClipboard_error
    } else {
      // 销毁剪贴板实例
      el._vClipboard.destroy()
      delete el._vClipboard
    }
  }
}

export default VueClipboard
