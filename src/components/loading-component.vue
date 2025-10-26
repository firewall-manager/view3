<template lang="html">
  <!-- 加载组件包装器 -->
  <div :class="wrapperClasses">
    <!-- 加载动画容器 -->
    <div :class="spinnerClasses">
      <Spin fix>
        <!-- 加载图标 -->
        <Icon
          type="ios-loading"
          size="18"
          :class="iconClasses"
        />
        <!-- 加载文本 -->
        <div
          v-if="text"
          :class="textClasses"
        >
          {{ text }}
        </div>
      </Spin>
    </div>
  </div>
</template>

<script>
import Spin from '../spin/spin.vue'
import Icon from '../icon/icon.vue'

const prefixCls = 'ivu-scroll'

/**
 * 加载组件
 * 用于显示加载状态的组件
 */
export default {
  components: { Spin, Icon },
  props: ['text', 'active', 'spinnerHeight'],
  computed: {
    // 包装器CSS类名
    wrapperClasses () {
      return [
                    `${prefixCls}-loader-wrapper`,
                    {
                      [`${prefixCls}-loader-wrapper-active`]: this.active
                    }
      ]
    },
    // 加载动画CSS类名
    spinnerClasses () {
      return `${prefixCls}-spinner`
    },
    // 图标CSS类名
    iconClasses () {
      return `${prefixCls}-spinner-icon`
    },
    // 文本CSS类名
    textClasses () {
      return `${prefixCls}-loader-text`
    }
  }
}
</script>
