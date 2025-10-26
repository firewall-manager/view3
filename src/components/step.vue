<template>
  <!-- 步骤项容器 -->
  <div :class="wrapClasses">
    <!-- 步骤连接线 -->
    <div :class="[prefixCls + '-tail']">
      <i />
    </div>
    <!-- 步骤头部 -->
    <div :class="[prefixCls + '-head']">
      <div :class="[prefixCls + '-head-inner']">
        <!-- 步骤编号 -->
        <span v-if="!icon && !$slots.icon && currentStatus !== 'finish' && currentStatus !== 'error'">{{ stepNumber }}</span>
        <!-- 自定义图标插槽 -->
        <span
          v-else-if="$slots.icon"
          class="ivu-steps-icon"
        ><slot name="icon" /></span>
        <!-- 状态图标 -->
        <span
          v-else
          :class="iconClasses"
        />
      </div>
    </div>
    <!-- 步骤主体 -->
    <div :class="[prefixCls + '-main']">
      <!-- 步骤标题 -->
      <div :class="[prefixCls + '-title']">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <!-- 步骤内容 -->
      <div
        v-if="content || $slots.content"
        :class="[prefixCls + '-content']"
      >
        <slot name="content">
          {{ content }}
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import Emitter from '../../mixins/emitter'
import { oneOf } from '../../utils/assist'

const prefixCls = 'ivu-steps'
const iconPrefixCls = 'ivu-icon'

/**
 * 步骤项组件
 * 步骤条中的单个步骤项组件
 */
export default {
  name: 'Step',
  mixins: [Emitter],
  props: {
    // 步骤状态
    status: {
      validator (value) {
        return oneOf(value, ['wait', 'process', 'finish', 'error'])
      }
    },
    // 步骤标题
    title: {
      type: String,
      default: ''
    },
    // 步骤内容
    content: {
      type: String
    },
    // 步骤图标
    icon: {
      type: String
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      // 步骤编号
      stepNumber: '',
      // 下一个错误状态
      nextError: false,
      // 总步骤数
      total: 1,
      // 当前状态
      currentStatus: ''
    }
  },
  computed: {
    // 步骤项CSS类名
    wrapClasses () {
      return [
                    `${prefixCls}-item`,
                    `${prefixCls}-status-${this.currentStatus}`,
                    {
                      [`${prefixCls}-custom`]: !!this.icon || !!this.$slots.icon,
                      [`${prefixCls}-next-error`]: this.nextError
                    }
      ]
    },
    // 图标CSS类名
    iconClasses () {
      let icon = ''

      if (this.icon) {
        icon = this.icon
      } else {
        if (this.currentStatus === 'finish') {
          icon = 'ios-checkmark'
        } else if (this.currentStatus === 'error') {
          icon = 'ios-close'
        }
      }

      return [
                    `${prefixCls}-icon`,
                    `${iconPrefixCls}`,
                    {
                      [`${iconPrefixCls}-${icon}`]: icon !== ''
                    }
      ]
    }
  },
  watch: {
    // 监听状态变化
    status (val) {
      this.currentStatus = val
      if (this.currentStatus === 'error') {
        this.$parent.setNextError()
      }
    }
  },
  created () {
    this.currentStatus = this.status
  },
  mounted () {
    this.dispatch('Steps', 'append')
  },
  beforeUnmount () {
    this.dispatch('Steps', 'remove')
  }
}
</script>
