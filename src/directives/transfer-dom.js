/**
 * DOM传输指令模块
 * 提供将DOM元素传输到指定位置的功能
 * 
 * 参考项目：
 * - https://github.com/airyland/vux/blob/v2/src/directives/transfer-dom/index.js
 * - https://github.com/calebroseland/vue-dom-portal
 */

/**
 * 获取目标DOM节点
 * @param {(Node|string|Boolean)} [node=document.body] DOM节点、CSS选择器或布尔值
 * @return {Node} 元素将被添加到的目标节点
 */
function getTarget (node) {
  if (node === void 0) {
    node = document.body
  }
  if (node === true) { return document.body }
  return node instanceof window.Node ? node : document.querySelector(node)
}

const directive = {
  /**
   * 指令挂载时执行
   * 将元素传输到指定位置
   * @param {Element} el - 指令绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {*} binding.value - 目标位置（DOM节点、选择器或布尔值）
   * @param {Object} vnode - Vue虚拟节点
   */
  mounted (el, { value }, vnode) {
    // 检查是否启用传输功能
    if (el.dataset && el.dataset.transfer !== 'true') return false
    
    // 添加传输标识类名
    el.className = el.className ? el.className + ' v-transfer-dom' : 'v-transfer-dom'
    
    const parentNode = el.parentNode
    if (!parentNode) return
    
    // 创建占位注释节点
    const home = document.createComment('')
    let hasMovedOut = false

    if (value !== false) {
      // 将元素移出原位置，用注释节点占位
      parentNode.replaceChild(home, el)
      // 将元素添加到新位置
      getTarget(value).appendChild(el)
      hasMovedOut = true
    }
    
    // 保存传输数据
    if (!el.__transferDomData) {
      el.__transferDomData = {
        parentNode: parentNode,    // 原始父节点
        home: home,               // 占位注释节点
        target: getTarget(value), // 目标节点
        hasMovedOut: hasMovedOut  // 是否已移出
      }
    }
  },
  /**
   * 指令更新时执行
   * 根据新值更新元素位置
   * @param {Element} el - 指令绑定的DOM元素
   * @param {Object} binding - 指令绑定对象
   * @param {*} binding.value - 新的目标位置
   */
  updated (el, { value }) {
    if (el.dataset && el.dataset.transfer !== 'true') return false
    
    // 需要确保子元素已完成更新（相对于`update`）
    const ref$1 = el.__transferDomData
    if (!ref$1) return
    
    const parentNode = ref$1.parentNode
    const home = ref$1.home
    const hasMovedOut = ref$1.hasMovedOut // 回忆home的位置

    if (!hasMovedOut && value) {
      // 从文档中移除并留下占位符
      parentNode.replaceChild(home, el)
      // 添加到目标位置
      getTarget(value).appendChild(el)
      el.__transferDomData = Object.assign({}, el.__transferDomData, { hasMovedOut: true, target: getTarget(value) })
    } else if (hasMovedOut && value === false) {
      // 之前已移动，现在回到原位置
      parentNode.replaceChild(el, home)
      el.__transferDomData = Object.assign({}, el.__transferDomData, { hasMovedOut: false, target: getTarget(value) })
    } else if (value) {
      // 已经移动过，现在去其他地方
      getTarget(value).appendChild(el)
    }
  },
  /**
   * 指令卸载时执行
   * 将元素恢复到原位置并清理数据
   * @param {Element} el - 指令绑定的DOM元素
   */
  unmounted (el) {
    if (el.dataset && el.dataset.transfer !== 'true') return false
    
    // 移除传输标识类名
    el.className = el.className.replace('v-transfer-dom', '')
    
    const ref$1 = el.__transferDomData
    if (!ref$1) return
    
    // 如果元素已移出，则恢复到原位置
    if (el.__transferDomData.hasMovedOut === true) {
      el.__transferDomData.parentNode && el.__transferDomData.parentNode.appendChild(el)
    }
    
    // 清理传输数据
    el.__transferDomData = null
  }
}

export default directive
