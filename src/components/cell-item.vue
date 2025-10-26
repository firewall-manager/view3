<template>
  <!-- 单元格项容器 -->
  <div class="ivu-cell-item">
    <!-- 图标区域 -->
    <div class="ivu-cell-icon">
      <slot name="icon" />
    </div>
    <!-- 主要内容区域 -->
    <div class="ivu-cell-main">
      <!-- 标题区域 -->
      <div class="ivu-cell-title">
        <slot>{{ title }}</slot>
      </div>
      <!-- 标签区域 -->
      <div class="ivu-cell-label">
        <slot name="label">
          {{ label }}
        </slot>
      </div>
    </div>
    <!-- 底部区域 -->
    <div class="ivu-cell-footer">
      <span class="ivu-cell-extra"><slot name="extra">{{ extra }}</slot></span>
    </div>
  </div>
</template>
<script>
/**
 * 单元格项组件
 * 单元格组中的单个单元格项，包含图标、标题、标签和额外内容
 */
export default {
  props: {
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
    }
  }
}
</script>
