/**
 * 字符串格式化模板模块
 * 提供类似模板字符串的格式化功能，支持占位符替换
 * 
 * 参考项目：
 * - https://github.com/Matt-Esch/string-template/index.js
 */

// 匹配占位符的正则表达式：{key} 或 %{key}
const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g

export default function () {
  /**
   * 检查对象是否拥有指定属性
   * @param {Object} obj - 要检查的对象
   * @param {string} key - 属性名
   * @returns {boolean} 是否拥有该属性
   */
  function hasOwn (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key)
  }

  /**
   * 模板字符串格式化函数
   * 将字符串中的占位符替换为对应的值
   * @param {String} string - 包含占位符的模板字符串
   * @param {...*} args - 替换参数，可以是对象或多个参数
   * @return {String} 格式化后的字符串
   */
  function template (string, ...args) {
    // 如果只有一个参数且是对象，直接使用该对象
    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0]
    }

    // 确保args是对象
    if (!args || !args.hasOwnProperty) {
      args = {}
    }

    // 使用正则表达式替换占位符
    return string.replace(RE_NARGS, (match, prefix, i, index) => {
      let result

      // 检查是否是转义的占位符（如 %{key}）
      if (string[index - 1] === '{' &&
                string[index + match.length] === '}') {
        return i
      } else {
        // 获取对应的值
        result = hasOwn(args, i) ? args[i] : null
        if (result === null || result === undefined) {
          return ''
        }

        return result
      }
    })
  }

  return template
}
