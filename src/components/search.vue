<template>
  <!-- 搜索组件容器 -->
  <div :class="prefixCls">
    <!-- 搜索输入框 -->
    <i-input
      v-model="currentQuery"
      size="small"
      :icon="icon"
      :placeholder="placeholder"
      @on-click="handleClick"
    />
  </div>
</template>
<script>
import iInput from '../input/input.vue'

/**
 * 搜索组件
 * 用于提供搜索功能的输入框组件
 */
export default {
  name: 'Search',
  components: { iInput },
  props: {
    // 样式前缀
    prefixCls: String,
    // 占位符
    placeholder: String,
    // 查询文本
    query: String
  },
  data () {
    return {
      // 当前查询文本
      currentQuery: this.query
    }
  },
  computed: {
    // 图标
    icon () {
      return this.query === '' ? 'ios-search' : 'ios-close-circle'
    }
  },
  watch: {
    // 监听查询文本变化
    query (val) {
      this.currentQuery = val
    },
    // 监听当前查询文本变化
    currentQuery (val) {
      this.$emit('on-query-change', val)
    }
  },
  methods: {
    // 处理点击事件
    handleClick () {
      if (this.currentQuery === '') return
      this.currentQuery = ''
      this.$emit('on-query-clear')
    }
  }
}
</script>
