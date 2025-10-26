<template>
  <!-- 列表项元信息容器 -->
  <div class="ivu-list-item-meta">
    <!-- 头像区域 -->
    <div
      v-if="avatar || $slots.avatar"
      class="ivu-list-item-meta-avatar"
    >
      <slot name="avatar">
        <Avatar :src="avatar" />
      </slot>
    </div>
    <!-- 内容区域 -->
    <div class="ivu-list-item-meta-content">
      <!-- 标题 -->
      <div
        v-if="title || $slots.title"
        class="ivu-list-item-meta-title"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <!-- 描述 -->
      <div
        v-if="description || $slots.description"
        class="ivu-list-item-meta-description"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from '../../components/avatar/avatar.vue'

/**
 * 列表项元信息组件
 * 用于显示列表项的头像、标题和描述信息
 */
export default {
  name: 'ListItemMeta',
  components: { Avatar },
  props: {
    // 头像地址
    avatar: {
      type: String,
      default: ''
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 描述
    description: {
      type: String,
      default: ''
    }
  }
}
</script>
