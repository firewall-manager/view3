/**
 * 颜色处理工具模块
 * 提供颜色转换、验证、计算等功能的工具函数
 */

import tinycolor from 'tinycolor2'
import { oneOf } from './assist'

/**
 * 设置颜色透明度
 * @param {string|Object} data - 颜色数据
 * @param {number} alpha - 透明度值(0-1)
 * @returns {Object} tinycolor对象
 */
function setAlpha (data, alpha) {
  const color = tinycolor(data)
  const { _a } = color

  if (_a === undefined || _a === null) {
    color.setAlpha(alpha || 1)
  }

  return color
}

/**
 * 获取颜色对象
 * @param {string|Object} data - 原始颜色数据
 * @param {Object} colorData - 颜色数据对象
 * @returns {Object} tinycolor颜色对象
 */
function getColor (data, colorData) {
  const alpha = colorData && colorData.a

  if (colorData) {
    // HSL格式在转换之间比十六进制更好
    if (colorData.hsl) {
      return setAlpha(colorData.hsl, alpha)
    }

    if (colorData.hex && colorData.hex.length > 0) {
      return setAlpha(colorData.hex, alpha)
    }
  }

  return setAlpha(colorData, alpha)
}

/**
 * 改变颜色
 * 处理颜色转换和格式化，确保颜色值的准确性
 * @param {string|Object} data - 颜色数据
 * @param {number} oldHue - 旧的色相值
 * @returns {Object} 包含各种格式的颜色对象
 */
export function changeColor (data, oldHue) {
  const colorData = data === '' ? '#2d8cf0' : data
  const color = getColor(data, colorData)
  const hsl = color.toHsl()
  const hsv = color.toHsv()

  // 当饱和度为0时，保持色相值
  if (hsl.s === 0) {
    hsl.h = colorData.h || (colorData.hsl && colorData.hsl.h) || oldHue || 0
    hsv.h = hsl.h
  }

  // 当HSV的V值小于0.0164时（基于测试）
  // 由于可能的精度损失，色相和饱和度的结果会被误算
  if (hsv.v < 0.0164) {
    hsv.h = colorData.h || (colorData.hsv && colorData.hsv.h) || 0
    hsv.s = colorData.s || (colorData.hsv && colorData.hsv.s) || 0
  }

  // 当HSL的L值小于0.01时，保持色相和饱和度
  if (hsl.l < 0.01) {
    hsl.h = colorData.h || (colorData.hsl && colorData.hsl.h) || 0
    hsl.s = colorData.s || (colorData.hsl && colorData.hsl.s) || 0
  }

  return {
    hsl,
    hex: color.toHexString().toUpperCase(),
    rgba: color.toRgb(),
    hsv,
    oldHue: colorData.h || oldHue || hsl.h,
    source: colorData.source,
    a: colorData.a || color.getAlpha()
  }
}

/**
 * 限制数值在指定范围内
 * @param {number} value - 要限制的值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
export function clamp (value, min, max) {
  if (value < min) {
    return min
  }

  if (value > max) {
    return max
  }

  return value
}

/**
 * 获取增量值
 * @param {string} key - 键名
 * @param {Array} keys - 键数组
 * @param {number} increment - 增量值
 * @returns {number} 增量值或0
 */
export function getIncrement (key, keys, increment) {
  return oneOf(key, keys) ? increment : 0
}

/**
 * 获取触摸事件属性值
 * @param {Event} e - 触摸事件
 * @param {string} prop - 属性名
 * @returns {number} 属性值
 */
export function getTouches (e, prop) {
  return e.touches ? e.touches[0][prop] : 0
}

/**
 * 将RGBA对象转换为字符串
 * @param {Object} rgba - RGBA颜色对象
 * @returns {string} RGBA字符串
 */
export function toRGBAString (rgba) {
  const { r, g, b, a } = rgba

  return `rgba(${[r, g, b, a].join(',')})`
}

/**
 * 验证十六进制颜色值是否有效
 * @param {string} hex - 十六进制颜色值
 * @returns {boolean} 是否有效
 */
export function isValidHex (hex) {
  return tinycolor(hex).isValid()
}

/**
 * 检查颜色数据迭代器
 * @param {Object} data - 颜色数据对象
 * @param {Object} counts - 计数对象
 * @param {string} letter - 要检查的属性名
 * @returns {Object} 更新后的计数对象
 */
function checkIteratee (data, counts, letter) {
  let { checked, passed } = counts
  const value = data[letter]

  if (value) {
    checked += 1

    if (Number.isFinite(value)) {
      passed += 1
    }
  }

  return { checked, passed }
}

// 要检查的颜色属性键名
const keysToCheck = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v']

/**
 * 简单检查颜色数据是否有效
 * @param {Object} data - 颜色数据对象
 * @returns {Object|undefined} 有效的数据或undefined
 */
export function simpleCheckForValidColor (data) {
  const results = keysToCheck.reduce(checkIteratee.bind(null, data), { checked: 0, passed: 0 })

  return results.checked === results.passed ? data : undefined
}
