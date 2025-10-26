<template>
  <!-- 表格单元格容器 -->
  <div
    ref="cell"
    :class="classes"
    @click="handleCellClick"
  >
    <!-- 索引列 -->
    <template v-if="renderType === 'index'">
      <span>{{ column.indexMethod ? column.indexMethod(row) : (naturalIndex + 1) }}</span>
    </template>
    <!-- 选择列 -->
    <template v-if="renderType === 'selection'">
      <Checkbox
        :model-value="checked"
        :disabled="disabled"
        @click.native.stop="handleClick"
        @on-change="toggleSelect"
      />
    </template>
    <!-- 树形层级缩进 -->
    <div
      v-if="showLevel"
      class="ivu-table-cell-tree-level"
      :style="treeLevelStyle"
    />
    <!-- 树形展开/收起按钮 -->
    <div
      v-if="showChildren"
      class="ivu-table-cell-tree"
      :class="{ 'ivu-table-cell-tree-loading': childrenLoading }"
      @click.prevent.stop="handleToggleTree"
    >
      <Icon
        v-if="childrenLoading"
        type="ios-loading"
        class="ivu-load-loop"
      />
      <Icon
        v-else-if="!childrenExpand"
        type="ios-add"
      />
      <Icon
        v-else
        type="ios-remove"
      />
    </div>
    <!-- 树形节点占位 -->
    <div
      v-else-if="showTreeNode"
      class="ivu-table-cell-tree ivu-table-cell-tree-empty"
    />
    <!-- HTML内容 -->
    <template v-if="renderType === 'html'">
      <span v-html="row[column.key]" />
    </template>
    <!-- 普通内容 -->
    <template v-if="renderType === 'normal'">
      <template v-if="column.tooltip">
        <Tooltip
          transfer
          :content="row[column.key]"
          :theme="tableRoot.tooltipTheme"
          :disabled="!showTooltip && !tooltipShow"
          :max-width="300"
          class="ivu-table-cell-tooltip"
          @on-popper-show="handleTooltipShow"
          @on-popper-hide="handleTooltipHide"
        >
          <span
            ref="content"
            class="ivu-table-cell-tooltip-content"
            @mouseenter="handleTooltipIn"
            @mouseleave="handleTooltipOut"
          >{{ row[column.key] }}</span>
        </Tooltip>
      </template>
      <span v-else>{{ row[column.key] }}</span>
    </template>
    <!-- 展开列 -->
    <template v-if="renderType === 'expand' && !row._disableExpand">
      <div
        :class="expandCls"
        @click="toggleExpand"
      >
        <Icon type="ios-arrow-forward" />
      </div>
    </template>
    <!-- 自定义渲染 -->
    <table-expand
      v-if="renderType === 'render'"
      :row="row"
      :column="column"
      :index="index"
      :render="column.render"
    />
    <!-- 插槽渲染 -->
    <table-slot
      v-if="renderType === 'slot'"
      :row="row"
      :column="column"
      :display="column.display || 'block'"
      :index="index"
    />
  </div>
</template>
<script>
import TableExpand from './table-expand'
import TableSlot from './table-slot'
import Icon from './icon'
import Checkbox from './checkbox'
import Tooltip from './tooltip'

/**
 * 表格单元格组件
 * 用于渲染表格中的单个单元格
 */
export default {
  name: 'TableCell',
  components: { Icon, Checkbox, TableExpand, TableSlot, Tooltip },
  inject: ['tableRoot'],
  props: {
    // 样式前缀
    prefixCls: String,
    // 行数据
    row: Object,
    // 列配置
    column: Object,
    // 自然索引（重建数据索引）
    naturalIndex: Number, // index of rebuildData
    // 数据索引
    index: Number, // _index of data
    // 是否选中
    checked: Boolean,
    // 是否禁用
    disabled: Boolean,
    // 是否展开
    expanded: Boolean,
    // 是否固定
    fixed: {
      type: [Boolean, String],
      default: false
    },
    // 是否为树形子节点
    treeNode: Boolean,
    // 树形层级
    treeLevel: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 渲染类型
      renderType: '',
      // 唯一标识
      uid: -1,
      // 上下文
      context: this.$parent.$parent.$parent.currentContext,
      // 是否显示提示框
      showTooltip: false, // 鼠标滑过overflow文本时，再检查是否需要显示
      // 提示框显示状态
      tooltipShow: false
    }
  },
  computed: {
    // 单元格CSS类名
    classes () {
      return [
                    `${this.prefixCls}-cell`,
                    {
                      [`${this.prefixCls}-hidden`]: !this.fixed && this.column.fixed && (this.column.fixed === 'left' || this.column.fixed === 'right'),
                      [`${this.prefixCls}-cell-ellipsis`]: this.column.ellipsis || false,
                      [`${this.prefixCls}-cell-with-expand`]: this.renderType === 'expand',
                      [`${this.prefixCls}-cell-with-selection`]: this.renderType === 'selection'
                    }
      ]
    },
    // 展开按钮CSS类名
    expandCls () {
      return [
                    `${this.prefixCls}-cell-expand`,
                    {
                      [`${this.prefixCls}-cell-expand-expanded`]: this.expanded
                    }
      ]
    },
    // 是否显示子节点展开按钮
    showChildren () {
      let status = false
      if (this.renderType === 'html' || this.renderType === 'normal' || this.renderType === 'render' || this.renderType === 'slot') {
        const data = this.row
        if ((data.children && data.children.length) || ('_loading' in data)) {
          if (this.column.tree) status = true
        }
      }
      return status
    },
    // 是否显示树形节点占位
    showTreeNode () {
      let status = false
      if (this.renderType === 'html' || this.renderType === 'normal' || this.renderType === 'render' || this.renderType === 'slot') {
        if (this.column.tree && this.treeNode) status = true
      }
      return status
    },
    // 是否显示层级缩进
    showLevel () {
      let status = false
      if (this.renderType === 'html' || this.renderType === 'normal' || this.renderType === 'render' || this.renderType === 'slot') {
        if (this.column.tree && this.treeNode) status = true
      }
      return status
    },
    // 树形层级样式
    treeLevelStyle () {
      return {
        'padding-left': this.treeLevel * this.tableRoot.indentSize + 'px'
      }
    },
    // 子节点是否展开
    childrenExpand () {
      const data = this.tableRoot.getDataByRowKey(this.row._rowKey)
      return data._isShowChildren
    },
    // 子节点是否加载中
    childrenLoading () {
      const data = this.tableRoot.getDataByRowKey(this.row._rowKey)
      return '_loading' in data && data._loading
    }
  },
  created () {
    if (this.column.type === 'index') {
      this.renderType = 'index'
    } else if (this.column.type === 'selection') {
      this.renderType = 'selection'
    } else if (this.column.type === 'html') {
      this.renderType = 'html'
    } else if (this.column.type === 'expand') {
      this.renderType = 'expand'
    } else if (this.column.render) {
      this.renderType = 'render'
    } else if (this.column.slot) {
      this.renderType = 'slot'
    } else {
      this.renderType = 'normal'
    }
  },
  methods: {
    // 切换选择状态
    toggleSelect () {
      if (this.treeNode) {
        this.$parent.$parent.$parent.toggleSelect(this.index, this.row._rowKey)
      } else {
        this.$parent.$parent.$parent.toggleSelect(this.index)
      }
    },
    // 切换展开状态
    toggleExpand () {
      this.$parent.$parent.$parent.toggleExpand(this.index)
    },
    // 处理点击事件
    handleClick () {
      // 防止 Checkbox 冒泡
    },
    // 处理提示框鼠标进入
    handleTooltipIn () {
      const $content = this.$refs.content
      this.showTooltip = $content.scrollWidth > $content.offsetWidth
    },
    // 处理提示框鼠标离开
    handleTooltipOut () {
      this.showTooltip = false
    },
    // 处理提示框显示
    handleTooltipShow () {
      this.tooltipShow = true
    },
    // 处理提示框隐藏
    handleTooltipHide () {
      this.tooltipShow = false
    },
    // 处理树形节点切换
    handleToggleTree () {
      this.$parent.$parent.$parent.toggleTree(this.row._rowKey)
    },
    // 处理单元格点击
    handleCellClick (event) {
      this.$parent.$parent.$parent.$emit('on-cell-click', this.row, this.column, this.row[this.column.key], event)
    }
  }
}
</script>
