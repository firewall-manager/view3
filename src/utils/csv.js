/**
 * CSV导出工具模块
 * 提供将数据转换为CSV格式的功能
 * 
 * 灵感来源：https://www.npmjs.com/package/react-csv-downloader
 * 该包已从Github移除
 */

// CSV换行符
const newLine = '\r\n'

/**
 * 添加一行数据到CSV内容中
 * @param {Array} content - CSV内容数组
 * @param {Array} row - 行数据数组
 * @param {Object} options - 选项对象
 * @param {string} options.separator - 分隔符
 * @param {boolean} options.quoted - 是否添加引号
 */
const appendLine = (content, row, { separator, quoted }) => {
  const line = row.map(data => {
    if (!quoted) return data
    // 为数据添加引号，并转义内部的双引号
    data = typeof data === 'string' ? data.replace(/"/g, '""') : data
    return `"${data}"`
  })
  content.push(line.join(separator))
}

// 默认配置选项
const defaults = {
  separator: ',',  // 默认分隔符
  quoted: false    // 默认不添加引号
}

/**
 * 将数据转换为CSV格式字符串
 * @param {Array|Object} columns - 列定义数组或对象
 * @param {Array} datas - 数据数组
 * @param {Object} options - 配置选项
 * @param {boolean} noHeader - 是否不包含表头
 * @returns {string} CSV格式的字符串
 */
export default function csv (columns, datas, options, noHeader = false) {
  // 合并默认选项和用户选项
  options = Object.assign({}, defaults, options)
  let columnOrder  // 列顺序
  const content = []  // CSV内容数组
  const column = []    // 表头列数组

  // 处理列定义
  if (columns) {
    columnOrder = columns.map(v => {
      if (typeof v === 'string') return v
      if (!noHeader) {
        // 添加表头，优先使用title，否则使用key
        column.push(typeof v.title !== 'undefined' ? v.title : v.key)
      }
      return v.key
    })
    // 如果有表头，添加到内容中
    if (column.length > 0) appendLine(content, column, options)
  } else {
    // 如果没有列定义，从数据中提取列名
    columnOrder = []
    datas.forEach(v => {
      if (!Array.isArray(v)) {
        columnOrder = columnOrder.concat(Object.keys(v))
      }
    })
    if (columnOrder.length > 0) {
      // 去重并添加表头
      columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index)
      if (!noHeader) appendLine(content, columnOrder, options)
    }
  }

  // 处理数据行
  if (Array.isArray(datas)) {
    datas.forEach(row => {
      if (!Array.isArray(row)) {
        // 如果数据不是数组，按列顺序提取数据
        row = columnOrder.map(k => (typeof row[k] !== 'undefined' ? row[k] : ''))
      }
      appendLine(content, row, options)
    })
  }
  
  // 返回CSV字符串
  return content.join(newLine)
}
