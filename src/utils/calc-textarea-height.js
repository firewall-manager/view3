/**
 * 文本域高度计算工具模块
 * 用于自动计算和调整文本域的高度，支持最小/最大行数限制
 */

// 隐藏文本域的样式，用于测量内容高度
const HIDDEN_TEXTAREA_STYLE = `
  min-height:0 !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`

// 影响文本域高度的样式属性列表
const SIZING_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing'
]

// 计算样式缓存
const computedStyleCache = {}
// 隐藏的文本域元素
let hiddenTextarea

/**
 * 计算节点样式信息
 * @param {Element} node - DOM节点
 * @param {boolean} useCache - 是否使用缓存
 * @returns {Object} 节点样式信息对象
 */
function calculateNodeStyling (node, useCache = false) {
  // 获取节点唯一标识
  const nodeRef = (
    node.getAttribute('id') ||
            node.getAttribute('data-reactid') ||
            node.getAttribute('name'))

  // 如果使用缓存且缓存存在，直接返回
  if (useCache && computedStyleCache[nodeRef]) {
    return computedStyleCache[nodeRef]
  }

  const style = window.getComputedStyle(node)

  // 获取盒模型类型
  const boxSizing = (
    style.getPropertyValue('box-sizing') ||
        style.getPropertyValue('-moz-box-sizing') ||
        style.getPropertyValue('-webkit-box-sizing')
  )

  // 计算上下内边距总和
  const paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom')) +
        parseFloat(style.getPropertyValue('padding-top'))
  )

  // 计算上下边框总和
  const borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width')) +
        parseFloat(style.getPropertyValue('border-top-width'))
  )

  // 构建影响尺寸的样式字符串
  const sizingStyle = SIZING_STYLE
    .map(name => `${name}:${style.getPropertyValue(name)}`)
    .join(';')

  const nodeInfo = {
    sizingStyle,
    paddingSize,
    borderSize,
    boxSizing
  }

  // 如果使用缓存，保存计算结果
  if (useCache && nodeRef) {
    computedStyleCache[nodeRef] = nodeInfo
  }

  return nodeInfo
}

/**
 * 计算文本域高度
 * 根据内容自动计算文本域的高度，支持最小/最大行数限制
 * @param {Element} uiTextNode - 文本域DOM元素
 * @param {number|null} minRows - 最小行数
 * @param {number|null} maxRows - 最大行数
 * @param {boolean} useCache - 是否使用样式缓存
 * @returns {Object} 包含高度信息的对象
 */
export default function calcTextareaHeight (uiTextNode, minRows = null, maxRows = null, useCache = false) {
  // 创建隐藏的文本域用于测量
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea')
    document.body.appendChild(hiddenTextarea)
  }

  // 修复wrap="off"问题
  // https://github.com/ant-design/ant-design/issues/6577
  if (uiTextNode.getAttribute('wrap')) {
    hiddenTextarea.setAttribute('wrap', uiTextNode.getAttribute('wrap'))
  } else {
    hiddenTextarea.removeAttribute('wrap')
  }

  // 复制所有影响文本域内容高度的CSS属性
  const {
    paddingSize, borderSize,
    boxSizing, sizingStyle
  } = calculateNodeStyling(uiTextNode, useCache)

  // 需要设置overflow属性来隐藏滚动条，否则文本行计算不准确
  // 因为阴影在技术上会比内容更窄
  hiddenTextarea.setAttribute('style', `${sizingStyle};${HIDDEN_TEXTAREA_STYLE}`)
  hiddenTextarea.value = uiTextNode.value || uiTextNode.placeholder || ''

  let minHeight = Number.MIN_SAFE_INTEGER
  let maxHeight = Number.MAX_SAFE_INTEGER
  let height = hiddenTextarea.scrollHeight
  let overflowY

  // 根据盒模型调整高度计算
  if (boxSizing === 'border-box') {
    // border-box: 添加边框，因为高度 = 内容 + 内边距 + 边框
    height = height + borderSize
  } else if (boxSizing === 'content-box') {
    // content-box: 移除内边距，因为高度 = 内容
    height = height - paddingSize
  }

  // 处理最小/最大行数限制
  if (minRows !== null || maxRows !== null) {
    // 测量单行文本域的高度
    hiddenTextarea.value = ' '
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize
    
    if (minRows !== null) {
      minHeight = singleRowHeight * minRows
      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize
      }
      height = Math.max(minHeight, height)
    }
    
    if (maxRows !== null) {
      maxHeight = singleRowHeight * maxRows
      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize
      }
      overflowY = height > maxHeight ? '' : 'hidden'
      height = Math.min(maxHeight, height)
    }
  }
  
  // 当没有最大行数限制时，移除滚动条闪烁
  if (!maxRows) {
    overflowY = 'hidden'
  }

  return {
    height: `${height}px`,
    minHeight: `${minHeight}px`,
    maxHeight: `${maxHeight}px`,
    overflowY
  }
}
