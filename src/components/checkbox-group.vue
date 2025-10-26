<template>
  <!-- 复选框组容器 -->
  <div :class="classes">
    <slot />
  </div>
</template>
<script>
import { findComponentsDownward, oneOf } from '../utils/assist'
import Emitter from '../mixins/emitter'

const prefixCls = 'ivu-checkbox-group'

/**
 * 复选框组组件
 * 管理多个复选框的状态，支持统一尺寸和值管理
 */
export default {
  name: 'CheckboxGroup',
  mixins: [Emitter],
  props: {
    // 双向绑定的值数组
    modelValue: {
      type: Array,
      default () {
        return []
      }
    },
    // 组件尺寸
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default () {
        return 'default'
      }
    }
  },
  emits: ['on-change', 'update:modelValue'],
  data () {
    return {
      // 当前值
      currentValue: this.modelValue,
      // 子复选框组件数组
      childrens: []
    }
  },
  computed: {
    // 复选框组CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`ivu-checkbox-${this.size}`]: !!this.size
                    }
      ]
    }
  },
  watch: {
    // 监听外部值变化，更新子组件
    modelValue () {
      this.updateModel(true)
    }
  },
  mounted () {
    // 组件挂载后更新子组件
    this.updateModel(true)
  },
  methods: {
    /**
     * 更新子复选框组件的状态
     * @param {Boolean} update - 是否更新子组件的当前值
     */
    updateModel (update) {
      this.childrens = findComponentsDownward(this, 'Checkbox')

      if (this.childrens) {
        this.childrens.forEach(child => {
          child.model = this.modelValue

          if (update) {
            child.currentValue = this.modelValue.indexOf(child.label) >= 0
            child.group = true
          }
        })
      }
    },
    /**
     * 处理值变化
     * @param {Array} data - 新的值数组
     */
    change (data) {
      this.currentValue = data
      this.$emit('update:modelValue', data)
      this.$emit('on-change', data)
      this.dispatch('FormItem', 'on-form-change', data)
    }
  }
}
</script>
