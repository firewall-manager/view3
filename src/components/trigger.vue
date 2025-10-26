<template>
  <!-- 分割触发器容器 -->
  <div :class="classes">
    <!-- 触发器条容器 -->
    <div :class="barConClasses">
      <!-- 触发器条 -->
      <i
        v-for="i in 8"
        v-once
        :key="`trigger-${i}`"
        :class="`${prefix}-bar`"
      />
    </div>
  </div>
</template>

<script>
/**
 * 分割触发器组件
 * 用于分割面板的拖拽触发器
 */
export default {
  name: 'Trigger',
  props: {
    // 模式
    mode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 样式前缀
      prefix: 'ivu-split-trigger',
      // 初始偏移量
      initOffset: 0
    }
  },
  computed: {
    // 是否垂直
    isVertical () {
      return this.mode === 'vertical'
    },
    // 触发器CSS类名
    classes () {
      return [
        this.prefix,
        this.isVertical ? `${this.prefix}-vertical` : `${this.prefix}-horizontal`
      ]
    },
    // 触发器条容器CSS类名
    barConClasses () {
      return [
                    `${this.prefix}-bar-con`,
                    this.isVertical ? 'vertical' : 'horizontal'
      ]
    }
  }
}
</script>
