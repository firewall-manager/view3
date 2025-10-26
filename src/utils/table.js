/**
 * 表格工具模块
 * 提供表格列处理、转换和生成相关功能
 */

import { deepCopy } from './assist'

/**
 * 转换列顺序
 * 将固定列（左侧或右侧）排在前面，其他列排在后面
 * @param {Array} columns - 列配置数组
 * @param {string} fixedType - 固定类型（'left' 或 'right'）
 * @returns {Array} 重新排序后的列数组
 */
const convertColumnOrder = (columns, fixedType) => {
  const list = []    // 固定列
  const other = []   // 其他列
  columns.forEach((col) => {
    if (col.fixed && col.fixed === fixedType) {
      list.push(col)
    } else {
      other.push(col)
    }
  })
  return list.concat(other)
}

export { convertColumnOrder }

/**
 * 获取所有列（包括子列）
 * 递归遍历列配置，获取所有叶子节点列
 * @param {Array} cols - 列配置数组
 * @param {boolean} forTableHead - 是否用于表头，在convertToRows时设为true，在table.vue等正常情况设为false
 * @returns {Array} 所有列的扁平化数组
 */
const getAllColumns = (cols, forTableHead = false) => {
  const columns = deepCopy(cols)
  const result = []
  columns.forEach((column) => {
    if (column.children) {
      // 如果有子列，递归处理
      if (forTableHead) result.push(column)
      result.push.apply(result, getAllColumns(column.children, forTableHead))
    } else {
      // 叶子节点列，直接添加
      result.push(column)
    }
  })
  return result
}

export { getAllColumns }

/**
 * 将列配置转换为行结构
 * 用于处理多级表头，将嵌套的列配置转换为二维数组
 * @param {Array} columns - 列配置数组
 * @param {string|boolean} fixedType - 固定类型（'left'、'right' 或 false）
 * @returns {Array} 转换后的行数组
 */
const convertToRows = (columns, fixedType = false) => {
  // 根据固定类型处理列顺序
  const originColumns = fixedType ? fixedType === 'left' ? deepCopy(convertColumnOrder(columns, 'left')) : deepCopy(convertColumnOrder(columns, 'right')) : deepCopy(columns)
  let maxLevel = 1
  
  /**
   * 递归遍历列，计算层级和colSpan
   * @param {Object} column - 当前列
   * @param {Object} parent - 父列
   */
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1
      if (maxLevel < column.level) {
        maxLevel = column.level
      }
    }
    if (column.children) {
      // 有子列，计算colSpan为所有子列colSpan之和
      let colSpan = 0
      column.children.forEach((subColumn) => {
        traverse(subColumn, column)
        colSpan += subColumn.colSpan
      })
      column.colSpan = colSpan
    } else {
      // 叶子节点，colSpan为1
      column.colSpan = 1
    }
  }

  // 遍历所有列，计算层级和colSpan
  originColumns.forEach((column) => {
    column.level = 1
    traverse(column)
  })

  // 创建行数组
  const rows = []
  for (let i = 0; i < maxLevel; i++) {
    rows.push([])
  }

  // 获取所有列（包括父列）
  const allColumns = getAllColumns(originColumns, true)

  // 为每列设置rowSpan并分配到对应行
  allColumns.forEach((column) => {
    if (!column.children) {
      // 叶子节点，rowSpan为剩余层级数
      column.rowSpan = maxLevel - column.level + 1
    } else {
      // 父列，rowSpan为1
      column.rowSpan = 1
    }
    rows[column.level - 1].push(column)
  })

  return rows
}

export { convertToRows }

/**
 * 生成随机字符串
 * 用于生成表格行或列的唯一标识
 * @param {number} len - 字符串长度，默认为32
 * @returns {string} 随机字符串
 */
const getRandomStr = function (len = 32) {
  const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  const maxPos = $chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}

export { getRandomStr }
