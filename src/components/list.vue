<template>
  <!-- 列表容器 -->
  <div :class="classes">
    <!-- 列表头部 -->
    <div
      v-if="header || $slots.header"
      class="ivu-list-header"
    >
      <slot name="header">
        {{ header }}
      </slot>
    </div>
    <!-- 列表内容区域 -->
    <div class="ivu-list-container">
      <ul class="ivu-list-items">
        <slot />
      </ul>
    </div>
    <!-- 加载状态 -->
    <Spin
      v-if="loading"
      fix
      size="large"
    >
      <slot name="spin" />
    </Spin>
    <!-- 列表底部 -->
    <div
      v-if="footer || $slots.footer"
      class="ivu-list-footer"
    >
      <slot name="footer">
        {{ footer }}
      </slot>
    </div>
  </div>
</template>
<script>
import Spin from './spin'
import { oneOf } from '../utils/assist'

const prefixCls = 'ivu-list'

/**
 * 列表组件
 * 用于展示列表数据的容器组件
 */
export default {
  name: 'List',
  components: { Spin },
  provide () {
    return {
      ListInstance: this
    }
  },
  props: {
    // 是否显示边框
    border: {
      type: Boolean,
      default: false
    },
    // 列表项布局方式
    itemLayout: {
      validator (value) {
        return oneOf(value, ['horizontal', 'vertical'])
      },
      default: 'horizontal'
    },
    // 列表头部内容
    header: {
      type: String,
      default: ''
    },
    // 列表底部内容
    footer: {
      type: String,
      default: ''
    },
    // 是否显示加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 列表尺寸
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default () {
        return 'default'
      }
    },
    // 是否显示分割线
    split: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    classes () {
      return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.size}`,
                    `${prefixCls}-${this.itemLayout}`,
                    {
                      [`${prefixCls}-bordered`]: this.border,
                      [`${prefixCls}-split`]: this.split
                    }
      ]
    }
  },
  methods: {

  }
}
</script>
