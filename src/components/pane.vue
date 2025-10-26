<template>
  <!-- 标签页面板 -->
  <div
    v-show="show"
    :class="prefixCls"
    :style="contentStyle"
  >
    <slot />
  </div>
</template>
<script>
const prefixCls = 'ivu-tabs-tabpane'

/**
 * 标签页面板组件
 * 标签页中的内容面板组件
 */
export default {
  name: 'TabPane',
  inject: ['TabsInstance'],
  props: {
    // 标签页名称
    name: {
      type: String
    },
    // 标签页标题
    label: {
      type: [String, Function],
      default: ''
    },
    // 标签页图标
    icon: {
      type: String
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可关闭
    closable: {
      type: Boolean,
      default: null
    },
    // 嵌套标签页时用于区分层级
    tab: {
      type: String
    },
    // 标签页索引（用于v-if时的排序）
    index: {
      type: Number
    },
    // 是否支持右键菜单
    contextMenu: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      show: true,
      currentName: this.name
    }
  },
  computed: {
    contentStyle () {
      return {
        visibility: this.TabsInstance.activeKey !== this.currentName ? 'hidden' : 'visible'
      }
    }
  },
  watch: {
    name (val) {
      this.currentName = val
      this.updateNav()
    },
    label () {
      this.updateNav()
    },
    icon () {
      this.updateNav()
    },
    disabled () {
      this.updateNav()
    }
  },
  mounted () {
    this.updateNav()
  },
  destroyed () {
    this.updateNav()
  },
  methods: {
    updateNav () {
      this.TabsInstance.updateNav()
    }
  }
}
</script>
