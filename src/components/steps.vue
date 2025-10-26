<template>
  <!-- 步骤条容器 -->
  <div :class="classes">
    <slot />
  </div>
</template>
<script>
import { oneOf } from '../../utils/assist'

const prefixCls = 'ivu-steps'

/**
 * 防抖函数
 * @param {Function} fn 要防抖的函数
 * @returns {Function} 防抖后的函数
 */
function debounce (fn) {
  let waiting
  return function () {
    if (waiting) return
    waiting = true
    const context = this
    const args = arguments
    const later = function () {
      waiting = false
      fn.apply(context, args)
    }
    this.$nextTick(later)
  }
}

/**
 * 步骤条组件
 * 用于显示流程步骤的导航组件
 */
export default {
  name: 'Steps',
  props: {
    // 当前步骤
    current: {
      type: Number,
      default: 0
    },
    // 当前状态
    status: {
      validator (value) {
        return oneOf(value, ['wait', 'process', 'finish', 'error'])
      },
      default: 'process'
    },
    // 尺寸
    size: {
      validator (value) {
        return oneOf(value, ['small'])
      }
    },
    // 方向
    direction: {
      validator (value) {
        return oneOf(value, ['horizontal', 'vertical'])
      },
      default: 'horizontal'
    }
  },
  computed: {
    // 步骤条CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.direction}`,
                    {
                      [`${prefixCls}-${this.size}`]: !!this.size
                    }
      ]
    }
  },
  watch: {
    // 监听当前步骤变化
    current () {
      this.updateChildProps()
    },
    // 监听状态变化
    status () {
      this.updateCurrent()
    }
  },
  mounted () {
    this.updateSteps()
    this.mitt.on('append', this.debouncedAppendRemove())
    this.mitt.on('remove', this.debouncedAppendRemove())
  },
  methods: {
    // 更新子组件属性
    updateChildProps (isInit) {
      const total = this.$children.length
      this.$children.forEach((child, index) => {
        child.stepNumber = index + 1

        if (this.direction === 'horizontal') {
          child.total = total
        }

        // 如果已存在status,且在初始化时,则略过
        // todo 如果当前是error,在current改变时需要处理
        if (!(isInit && child.currentStatus)) {
          if (index === this.current) {
            if (this.status !== 'error') {
              child.currentStatus = 'process'
            }
          } else if (index < this.current) {
            child.currentStatus = 'finish'
          } else {
            child.currentStatus = 'wait'
          }
        }

        if (child.currentStatus !== 'error' && index !== 0) {
          this.$children[index - 1].nextError = false
        }
      })
    },
    // 设置下一个错误状态
    setNextError () {
      this.$children.forEach((child, index) => {
        if (child.currentStatus === 'error' && index !== 0) {
          this.$children[index - 1].nextError = true
        }
      })
    },
    // 更新当前步骤
    updateCurrent (isInit) {
      // 防止溢出边界
      if (this.current < 0 || this.current >= this.$children.length) {
        return
      }
      if (isInit) {
        const current_status = this.$children[this.current].currentStatus
        if (!current_status) {
          this.$children[this.current].currentStatus = this.status
        }
      } else {
        this.$children[this.current].currentStatus = this.status
      }
    },
    // 防抖的添加移除处理
    debouncedAppendRemove () {
      return debounce(function () {
        this.updateSteps()
      })
    },
    // 更新步骤
    updateSteps () {
      this.updateChildProps(true)
      this.setNextError()
      this.updateCurrent(true)
    }
  }
}
</script>
