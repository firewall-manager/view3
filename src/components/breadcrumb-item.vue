<template>
  <!-- 面包屑项组件容器 -->
  <span>
    <!-- 链接项：当有to属性时显示为链接 -->
    <a
      v-if="to"
      :href="linkUrl"
      :target="target"
      :class="linkClasses"
      @click.exact="handleCheckClick($event, false)"
      @click.ctrl="handleCheckClick($event, true)"
      @click.meta="handleCheckClick($event, true)"
    >
      <slot />
    </a>
    <!-- 普通文本项：当没有to属性时显示为普通文本 -->
    <span
      v-else
      :class="linkClasses"
    >
      <slot />
    </span>
    <!-- 分隔符：使用HTML内容 -->
    <span
      v-if="!showSeparator"
      :class="separatorClasses"
      v-html="separator"
    />
    <!-- 分隔符：使用插槽内容 -->
    <span
      v-else
      :class="separatorClasses"
    >
      <slot name="separator" />
    </span>
  </span>
</template>
<script>
import mixinsLink from '../mixins/link'
const prefixCls = 'ivu-breadcrumb-item'

/**
 * 面包屑项组件
 * 面包屑导航中的单个项目，支持链接和普通文本两种模式
 */
export default {
  name: 'BreadcrumbItem',
  mixins: [mixinsLink],
  props: {
    // 继承自link mixin的属性
  },
  data () {
    return {
      // 分隔符内容
      separator: '',
      // 是否显示自定义分隔符插槽
      showSeparator: false
    }
  },
  computed: {
    // 链接CSS类名
    linkClasses () {
      return `${prefixCls}-link`
    },
    // 分隔符CSS类名
    separatorClasses () {
      return `${prefixCls}-separator`
    }
  },
  mounted () {
    // 检查是否有自定义分隔符插槽
    this.showSeparator = this.$slots.separator !== undefined
  }
}
</script>
