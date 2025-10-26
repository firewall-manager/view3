/**
 * 节流函数
 * 返回一个新函数，当被调用时，在`wait`毫秒内最多只调用一次`func`函数
 *
 * @param {Function} func - 要包装的函数
 * @param {Number} wait - 两次函数调用之间必须经过的毫秒数
 * @return {Function} 包装后的节流函数
 */

function throttle (func, wait) {
  let ctx, args, rtn, timeoutID // 缓存变量
  let last = 0  // 上次执行时间

  return function throttled () {
    ctx = this
    args = arguments
    const delta = new Date() - last  // 计算时间差
    
    if (!timeoutID) {
      if (delta >= wait) {
        // 如果时间差大于等于等待时间，立即执行
        call()
      } else {
        // 否则设置定时器，在剩余时间后执行
        timeoutID = setTimeout(call, wait - delta)
      }
    }
    return rtn
  }

  /**
   * 执行函数
   * 重置定时器，更新执行时间，调用原函数
   */
  function call () {
    timeoutID = 0
    last = +new Date()
    rtn = func.apply(ctx, args)
    ctx = null
    args = null
  }
}

export default throttle
