<template>
  <!-- 列表项 -->
  <li
    class="ivu-list-item"
    :class="classes"
  >
    <!-- 垂直布局且包含额外内容 -->
    <template v-if="itemLayout === 'vertical' && $slots.extra">
      <div class="ivu-list-item-main">
        <slot />
        <!-- 操作按钮 -->
        <ul
          v-if="$slots.action"
          class="ivu-list-item-action"
        >
          <slot name="action" />
        </ul>
      </div>
      <!-- 额外内容 -->
      <div class="ivu-list-item-extra">
        <slot name="extra" />
      </div>
    </template>
    <!-- 水平布局 -->
    <template v-else>
      <slot />
      <!-- 操作按钮 -->
      <ul
        v-if="$slots.action"
        class="ivu-list-item-action"
      >
        <slot name="action" />
      </ul>
      <!-- 额外内容 -->
      <div class="ivu-list-item-extra">
        <slot name="extra" />
      </div>
    </template>
  </li>
</template>
<script>
/**
 * 列表项组件
 * 列表中的单个项目组件
 */
export default {
  name: 'ListItem',
  inject: ['ListInstance'],
  props: {

  },
  computed: {
    // 列表项布局方式
    itemLayout () {
      return this.ListInstance.itemLayout
    },
    // 是否包含文本节点
    isItemContainsTextNode () {
      let result
      this.$slots.default().forEach(item => {
        if (typeof item === 'string') {
          result = true
        }
      })
      return result
    },
    // 是否为flex模式
    isFlexMode () {
      const extra = this.$slots.extra

      if (this.itemLayout === 'vertical') {
        return !!extra
      }

      return !this.isItemContainsTextNode
    },
    // 列表项CSS类名
    classes () {
      return [
        {
          'ivu-list-item-no-flex': !this.isFlexMode
        }
      ]
    }
  }
}
</script>
