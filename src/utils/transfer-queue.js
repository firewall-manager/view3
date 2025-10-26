/**
 * 传输队列工具模块
 * 提供传输组件相关的索引管理功能
 */

// 传输索引计数器
let transferIndex = 0
// 最后可见索引计数器
let lastVisibleIndex = 0

/**
 * 增加传输索引
 * 用于生成唯一的传输组件标识
 */
function transferIncrease () {
  transferIndex++
}

/**
 * 增加最后可见索引
 * 用于管理传输组件的可见性状态
 */
function lastVisibleIncrease () {
  lastVisibleIndex++
}

export { transferIndex, transferIncrease, lastVisibleIndex, lastVisibleIncrease }
