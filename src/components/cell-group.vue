<template>
  <!-- 单元格组容器 -->
  <div class="ivu-cell-group">
    <slot />
  </div>
</template>
<script>
/**
 * 单元格组组件
 * 用于包装多个单元格，提供统一的样式和事件处理
 */
export default {
  name: 'CellGroup',
  // 向子组件提供单元格组实例
  provide () {
    return {
      cellGroup: this
    }
  },
  methods: {
    /**
     * 处理单元格点击事件
     * @param {String} name - 单元格名称
     */
    handleClick (name) {
      this.$emit('on-click', name)
    }
  }
}
</script>
