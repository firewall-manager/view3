/**
 * 防抖函数
 * 返回一个函数，只要它继续被调用，就不会被触发。
 * 该函数将在停止调用N毫秒后被调用。
 * 如果传递了`immediate`参数，则在开始边缘触发函数，而不是在结束边缘。
 * 该函数还有一个'clear'属性，是一个清除定时器的函数，用于防止之前调度的执行。
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} func - 要包装的函数
 * @param {Number} wait - 超时时间（毫秒），默认为100
 * @param {Boolean} immediate - 是否在开始边缘执行，默认为false
 * @returns {Function} 防抖后的函数
 * @api public
 */
function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result
  // 设置默认等待时间
  if (wait == null) wait = 100

  /**
   * 延迟执行函数
   * 计算剩余时间，如果还有时间则继续等待，否则执行函数
   */
  function later () {
    const last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      // 如果还有剩余时间，继续等待
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果不是立即执行模式，则执行函数
      if (!immediate) {
        result = func.apply(context, args)
        context = args = null
      }
    }
  };

  /**
   * 防抖后的函数
   * 每次调用都会重置定时器
   */
  const debounced = function () {
    context = this
    args = arguments
    timestamp = Date.now()
    const callNow = immediate && !timeout
    
    if (!timeout) timeout = setTimeout(later, wait)
    
    // 如果是立即执行模式且没有待执行的定时器，立即执行
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }

  /**
   * 清除定时器
   * 取消待执行的函数调用
   */
  debounced.clear = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  /**
   * 立即执行并清除定时器
   * 强制执行待执行的函数调用
   */
  debounced.flush = function () {
    if (timeout) {
      result = func.apply(context, args)
      context = args = null

      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
};

// 添加ES模块兼容性
debounce.debounce = debounce

export default debounce
