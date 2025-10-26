/**
 * 国际化核心模块
 * 提供多语言支持和文本翻译功能
 */

import defaultLang from './lang/en-US'
import Format from './format'

// 创建格式化函数实例
const format = Format()
// 当前语言包
let lang = defaultLang
// 国际化处理函数
let i18nHandler = function () {
  const vuei18n = Object.getPrototypeOf(this || Vue).$t

  if (typeof vuei18n === 'function' && !!Vue.locale) {
    return vuei18n.apply(this, arguments)
  }
}

/**
 * 翻译函数
 * 根据路径获取翻译文本并格式化
 * @param {string} path - 翻译路径，如 'button.ok'
 * @param {Object} options - 格式化选项
 * @returns {string} 翻译后的文本
 */
export const t = function (path, options) {
  // 首先尝试使用自定义的i18n处理函数
  let value = i18nHandler.apply(this, arguments)
  if (value !== null && value !== undefined) return value

  // 按点分割路径
  const array = path.split('.')
  let current = lang

  // 逐级查找翻译文本
  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i]
    value = current[property]
    if (i === j - 1) return format(value, options)
    if (!value) return ''
    current = value
  }
  return ''
}

/**
 * 设置语言包
 * @param {Object} l - 语言包对象
 */
export const use = function (l) {
  lang = l || lang
}

/**
 * 设置国际化处理函数
 * @param {Function} fn - 自定义的i18n处理函数
 */
export const i18n = function (fn) {
  i18nHandler = fn || i18nHandler
}

// 导出所有方法
export default { use, t, i18n }
