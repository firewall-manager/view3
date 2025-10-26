<template>
  <!-- 单选框组容器 -->
  <div
    :class="classes"
    :name="name"
  >
    <slot />
  </div>
</template>
<script>
import { oneOf, findComponentsDownward } from '../utils/assist'
import Emitter from '../mixins/emitter'

const prefixCls = 'ivu-radio-group'

let seed = 0
const now = Date.now()
/**
 * 生成唯一ID
 * @returns {String} 唯一标识符
 */
const getUuid = () => `ivuRadioGroup_${now}_${seed++}`

/**
 * 单选框组组件
 * 用于管理多个单选框的容器组件
 */
export default {
  name: 'RadioGroup',
  mixins: [Emitter],
  props: {
    // 绑定值
    modelValue: {
      type: [String, Number],
      default: ''
    },
    // 尺寸
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default () {
        return 'default'
      }
    },
    // 类型
    type: {
      validator (value) {
        return oneOf(value, ['button'])
      }
    },
    // 是否垂直排列
    vertical: {
      type: Boolean,
      default: false
    },
    // 原生name属性
    name: {
      type: String,
      default: getUuid
    },
    // 按钮样式
    buttonStyle: {
      validator (value) {
        return oneOf(value, ['default', 'solid'])
      },
      default: 'default'
    }
  },
  emits: ['update:modelValue', 'on-change'],
  data () {
    return {
      // 当前值
      currentValue: this.modelValue,
      // 子组件列表
      childrens: []
    }
  },
  computed: {
    // 单选框组CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-${this.size}`]: !!this.size,
                      [`ivu-radio-${this.size}`]: !!this.size,
                      [`${prefixCls}-${this.type}`]: !!this.type,
                      [`${prefixCls}-button-${this.buttonStyle}`]: this.type === 'button' && this.buttonStyle !== 'default',
                      [`${prefixCls}-vertical`]: this.vertical
                    }
      ]
    }
  },
  watch: {
    // 监听绑定值变化
    modelValue () {
      if (this.currentValue !== this.modelValue) {
        this.currentValue = this.modelValue
        this.$nextTick(() => {
          this.updateValue()
        })
      }
    }
  },
  mounted () {
    this.updateValue()
  },
  methods: {
    // 更新子组件值
    updateValue () {
      this.childrens = findComponentsDownward(this, 'Radio')

      if (this.childrens) {
        this.childrens.forEach(child => {
          child.currentValue = this.currentValue === child.label
          child.group = true
        })
      }
    },
    // 处理值变化
    change (data) {
      this.currentValue = data.value
      this.updateValue()
      this.$emit('update:modelValue', data.value)
      this.$emit('on-change', data.value)
      this.dispatch('FormItem', 'on-form-change', data.value)
    }
  }
}
</script>
