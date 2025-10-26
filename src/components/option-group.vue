<template>
  <!-- 选项组容器 -->
  <li
    v-show="!hidden"
    :class="[prefixCls + '-wrap']"
  >
    <!-- 选项组标题 -->
    <div :class="[prefixCls + '-title']">
      {{ label }}
    </div>
    <!-- 选项组内容 -->
    <ul>
      <li
        ref="options"
        :class="[prefixCls]"
      >
        <slot />
      </li>
    </ul>
  </li>
</template>
<script>
const prefixCls = 'ivu-select-group'

/**
 * 选项组组件
 * 用于对选择器选项进行分组的组件
 */
export default {
  name: 'OptionGroup',
  props: {
    // 选项组标签
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      hidden: false // 用于搜索时隐藏
    }
  },
  mounted () {
    this.$on('on-query-change', () => {
      this.queryChange()
      return true
    })
  },
  beforeUnmount () {
    this.$off('on-query-change')
  },
  methods: {
    // 查询变化处理
    queryChange () {
      this.$nextTick(() => {
        const options = this.$refs.options.querySelectorAll('.ivu-select-item')
        let hasVisibleOption = false
        for (let i = 0; i < options.length; i++) {
          if (options[i].style.display !== 'none') {
            hasVisibleOption = true
            break
          }
        }
        this.hidden = !hasVisibleOption
      })
    }
  }
}
</script>
