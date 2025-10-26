<template>
  <!-- 单元格组件容器 -->
  <div :class="classes">
    <!-- 链接模式：当有to属性时显示为链接 -->
    <a
      v-if="to"
      :href="linkUrl"
      :target="target"
      class="ivu-cell-link"
      @click.exact="handleClickItem($event, false)"
      @click.ctrl="handleClickItem($event, true)"
      @click.meta="handleClickItem($event, true)"
    >
      <CellItem
        :title="title"
        :label="label"
        :extra="extra"
      >
        <slot
          slot="icon"
          name="icon"
        />
        <slot slot="default" />
        <slot
          slot="extra"
          name="extra"
        />
        <slot
          slot="label"
          name="label"
        />
      </CellItem>
    </a>
    <!-- 普通模式：当没有to属性时显示为普通div -->
    <div
      v-else
      class="ivu-cell-link"
      @click="handleClickItem"
    >
      <CellItem
        :title="title"
        :label="label"
        :extra="extra"
      >
        <slot
          slot="icon"
          name="icon"
        />
        <slot slot="default" />
        <slot
          slot="extra"
          name="extra"
        />
        <slot
          slot="label"
          name="label"
        />
      </CellItem>
    </div>
    <!-- 箭头图标：链接模式时显示 -->
    <div
      v-if="to"
      class="ivu-cell-arrow"
    >
      <slot name="arrow">
        <Icon
          :type="arrowType"
          :custom="customArrowType"
          :size="arrowSize"
        />
      </slot>
    </div>
  </div>
</template>
<script>
import CellItem from './cell-item.vue'
import Icon from './icon.vue'
import mixinsLink from '../mixins/link'

const prefixCls = 'ivu-cell'

/**
 * 单元格组件
 * 单元格组中的单个单元格，支持链接模式和普通模式
 */
export default {
  name: 'Cell',
  components: { CellItem, Icon },
  mixins: [mixinsLink],
  // 注入父级单元格组实例
  inject: ['cellGroup'],
  props: {
    // 单元格名称
    name: {
      type: [String, Number]
    },
    // 标题文本
    title: {
      type: String,
      default: ''
    },
    // 标签文本
    label: {
      type: String,
      default: ''
    },
    // 额外内容文本
    extra: {
      type: String,
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否选中
    selected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // CSS类名前缀
      prefixCls: prefixCls
    }
  },
  computed: {
    // 单元格CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-disabled`]: this.disabled,
                      [`${prefixCls}-selected`]: this.selected,
                      [`${prefixCls}-with-link`]: this.to
                    }
      ]
    },
    // 箭头图标类型
    arrowType () {
      return 'ios-arrow-forward'
    },
    // 自定义箭头图标类型
    customArrowType () {
      return ''
    },
    // 箭头图标尺寸
    arrowSize () {
      return ''
    }
  },
  methods: {
    /**
     * 处理单元格点击事件
     * @param {Event} event - 点击事件
     * @param {Boolean} new_window - 是否在新窗口打开
     */
    handleClickItem (event, new_window) {
      this.$parent.handleClick(this.name)

      this.handleCheckClick(event, new_window)
    }
  }
}
</script>
