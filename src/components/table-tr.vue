<template>
  <!-- 可拖拽行 -->
  <tr
    v-if="draggable"
    :class="rowClasses(row._index)"
    :draggable="draggable"
    @dragstart="onDrag($event, row._index)"
    @drop="onDrop($event, row._index)"
    @dragover="allowDrop($event)"
  >
    <slot />
  </tr>
  <!-- 普通行 -->
  <tr
    v-else
    :class="rowClasses(row._index)"
    :draggable="false"
  >
    <slot />
  </tr>
</template>
<script>
/**
 * 表格行组件
 * 用于渲染表格中的单行数据
 */
export default {
  props: {
    // 行数据
    row: {
      type: Object,
      required: true
    },
    // 样式前缀
    prefixCls: {
      type: String,
      required: false,
      default: ''
    },
    // 是否可拖拽
    draggable: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否为子行
    isChildren: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    // 对象数据
    objData () {
      return this.$parent.objData
    }
  },
  methods: {
    // 处理拖拽开始
    onDrag (e, index) {
      e.dataTransfer.setData('index', index)
    },
    // 处理拖拽放置
    onDrop (e, index) {
      const dragIndex = e.dataTransfer.getData('index')
      this.$parent.$parent.dragAndDrop(dragIndex, index)
      e.preventDefault()
    },
    // 允许拖拽放置
    allowDrop (e) {
      e.preventDefault()
    },
    // 行CSS类名
    rowClasses (_index) {
      const objData = this.isChildren ? this.$parent.$parent.getDataByRowKey(this.row._rowKey) : this.objData[_index]
      return [
                    `${this.prefixCls}-row`,
                    this.rowClsName(_index),
                    {
                      [`${this.prefixCls}-row-highlight`]: objData && objData._isHighlight,
                      [`${this.prefixCls}-row-hover`]: objData && objData._isHover
                    }
      ]
    },
    // 行类名
    rowClsName (_index) {
      return this.$parent.$parent.rowClassName(this.objData[_index], _index)
    }
  }
}
</script>
