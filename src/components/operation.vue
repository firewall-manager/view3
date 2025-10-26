<template>
  <!-- 操作按钮容器 -->
  <div :class="prefixCls + '-operation'">
    <!-- 反向操作按钮 -->
    <template v-if="reverseOperation">
      <i-button
        type="primary"
        size="small"
        :disabled="!leftActive"
        @click.native="moveToRight"
      >
        <span>{{ operations[1] }}</span> <Icon type="ios-arrow-forward" />
      </i-button>
      <i-button
        type="primary"
        size="small"
        :disabled="!rightActive"
        @click.native="moveToLeft"
      >
        <Icon type="ios-arrow-back" /> <span>{{ operations[0] }}</span>
      </i-button>
    </template>
    <!-- 正向操作按钮 -->
    <template v-else>
      <i-button
        type="primary"
        size="small"
        :disabled="!rightActive"
        @click.native="moveToLeft"
      >
        <Icon type="ios-arrow-back" /> <span>{{ operations[0] }}</span>
      </i-button>
      <i-button
        type="primary"
        size="small"
        :disabled="!leftActive"
        @click.native="moveToRight"
      >
        <span>{{ operations[1] }}</span> <Icon type="ios-arrow-forward" />
      </i-button>
    </template>
  </div>
</template>
<script>
import iButton from '../button/button.vue'
import Icon from '../icon/icon.vue'

/**
 * 操作组件
 * 用于提供左右移动操作按钮的组件
 */
export default {
  name: 'Operation',
  components: { iButton, Icon },
  props: {
    // 样式前缀
    prefixCls: String,
    // 操作按钮文本数组
    operations: Array,
    // 左侧是否激活
    leftActive: Boolean,
    // 右侧是否激活
    rightActive: Boolean,
    // 是否反向操作
    reverseOperation: Boolean
  },
  methods: {
    // 移动到左侧
    moveToLeft () {
      this.$parent.moveTo('left')
    },
    // 移动到右侧
    moveToRight () {
      this.$parent.moveTo('right')
    }
  }
}
</script>
