/**
 * 点击外部指令模块
 * 提供点击元素外部时触发回调的功能
 */

export default {
  /**
   * 指令挂载时执行
   * 绑定全局点击事件监听器
   * @param {Element} el - 指令绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {Function} binding.value - 点击外部时的回调函数
   * @param {Object} vnode - Vue虚拟节点
   */
  mounted (el, { value }, vnode) {
    /**
     * 文档点击处理函数
     * 检查点击是否在元素外部，如果是则执行回调
     * @param {Event} e - 点击事件
     */
    function documentHandler (e) {
      // 如果点击的是元素内部，不执行回调
      if (el.contains(e.target)) {
        return false
      }

      // 如果提供了回调函数，则执行
      if (typeof value === 'function') {
        value(e)
      }
    }

    // 将处理函数保存到元素上，用于后续清理
    el.__vueClickOutside__ = documentHandler

    // 绑定全局点击事件
    document.addEventListener('click', documentHandler)
  },
  
  /**
   * 指令更新时执行
   * 当前实现为空，可根据需要添加更新逻辑
   */
  update () {

  },
  
  /**
   * 指令卸载时执行
   * 清理事件监听器和相关属性
   * @param {Element} el - 指令绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   */
  unmount (el, binding) {
    // 移除全局点击事件监听器
    document.removeEventListener('click', el.__vueClickOutside__)

    // 删除保存的处理函数引用
    delete el.__vueClickOutside__
  }
}
