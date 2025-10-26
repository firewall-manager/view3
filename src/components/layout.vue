<template>
  <!-- 布局容器 -->
  <div :class="wrapClasses">
    <slot />
  </div>
</template>
<script>
import { findComponentDownward } from '../utils/assist'

const prefixCls = 'ivu-layout'

/**
 * 布局组件
 * 页面布局的基础容器组件
 */
export default {
  name: 'Layout',
  props: {
    // 是否包含侧边栏
    hasSider: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    // 布局容器CSS类名
    wrapClasses () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-has-sider`]: this.hasSider
                    }
      ]
    }
  }
}
</script>
