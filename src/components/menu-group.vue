<template>
  <!-- 菜单组容器 -->
  <li :class="[prefixCls + '-item-group']">
    <!-- 菜单组标题 -->
    <div
      :class="[prefixCls + '-item-group-title']"
      :style="groupStyle"
    >
      {{ title }}
    </div>
    <!-- 菜单组内容 -->
    <ul><slot /></ul>
  </li>
</template>
<script>
import mixin from '../mixins/menu'
const prefixCls = 'ivu-menu'

/**
 * 菜单组组件
 * 用于对菜单项进行分组的组件
 */
export default {
  name: 'MenuGroup',
  mixins: [mixin],
  props: {
    // 菜单组标题
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      prefixCls: prefixCls
    }
  },
  computed: {
    // 菜单组样式
    groupStyle () {
      return {}
    }
  }
}
</script>
