/**
 * 表格混入模块
 * 提供表格组件相关的功能，包括列对齐、筛选器显示、列宽设置等
 */

export default {
  methods: {
    /**
     * 计算列对齐样式类
     * 根据列配置和行数据生成对应的CSS类名
     * @param {Object} column - 列配置对象
     * @param {Object} row - 行数据对象，默认为空对象
     * @returns {Array} 包含基础类名和条件类名的数组
     */
    alignCls (column, row = {}) {
      let cellClassName = ''
      // 获取行级别的单元格类名
      if (row.cellClassName && column.key && row.cellClassName[column.key]) {
        cellClassName = row.cellClassName[column.key]
      }
      return [
        `${this.prefixCls}-column-${column.__id}`,
        {
          [`${cellClassName}`]: cellClassName, // 单元格类名
          [`${column.className}`]: column.className, // 列类名
          [`${this.prefixCls}-column-${column.align}`]: column.align, // 列对齐类名
          // 列隐藏类名：根据固定列位置判断是否隐藏
          [`${this.prefixCls}-hidden`]: (this.fixed === 'left' && column.fixed !== 'left') || (this.fixed === 'right' && column.fixed !== 'right') || (!this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'))
        }
      ]
    },
    
    /**
     * 判断筛选器是否显示
     * 根据列和当前固定状态判断筛选器弹窗是否应该显示
     * @param {Object} column - 列配置对象
     * @returns {boolean} 是否显示筛选器
     */
    isPopperShow (column) {
      return column.filters && ((!this.fixed && !column.fixed) || (this.fixed === 'left' && column.fixed === 'left') || (this.fixed === 'right' && column.fixed === 'right'))
    },
    
    /**
     * 设置单元格宽度
     * 根据列配置和列宽缓存计算单元格宽度
     * @param {Object} column - 列配置对象
     * @returns {string} 计算后的宽度值
     */
    setCellWidth (column) {
      let width = ''
      if (column.width) {
        // 优先使用列配置中的宽度
        width = column.width
      } else if (this.columnsWidth[column._index]) {
        // 使用列宽缓存中的宽度
        width = this.columnsWidth[column._index].width
      }
      // 如果宽度为'0'，则设为空字符串
      if (width === '0') width = ''
      return width
    }
  }
}
