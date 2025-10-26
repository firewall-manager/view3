<template>
  <!-- 单选框标签 -->
  <label :class="wrapClasses">
    <!-- 单选框容器 -->
    <span :class="radioClasses">
      <!-- 单选框内圆 -->
      <span :class="innerClasses" />
      <!-- 单选框输入框 -->
      <input
        type="radio"
        :class="inputClasses"
        :disabled="itemDisabled"
        :checked="currentValue"
        :name="groupName"
        @change="change"
        @focus="onFocus"
        @blur="onBlur"
      >
    </span>
    <!-- 单选框标签内容 -->
    <slot>{{ label }}</slot>
  </label>
</template>
<script>
import { findComponentUpward, oneOf } from '../utils/assist'
import Emitter from '../mixins/emitter'
import mixinsForm from '../mixins/form'

const prefixCls = 'ivu-radio'

/**
 * 单选框组件
 * 用于单选选择的输入组件
 */
export default {
  name: 'Radio',
  mixins: [Emitter, mixinsForm],
  props: {
    // 绑定值
    modelValue: {
      type: [String, Number, Boolean],
      default: false
    },
    // 选中时的值
    trueValue: {
      type: [String, Number, Boolean],
      default: true
    },
    // 未选中时的值
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    },
    // 标签文本
    label: {
      type: [String, Number]
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
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
    // 原生name属性
    name: {
      type: String
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'on-chage'],
  data () {
    return {
      // 当前值
      currentValue: this.modelValue,
      // 是否在组中
      group: false,
      // 组名
      groupName: this.name,
      // 父组件
      parent: findComponentUpward(this, 'RadioGroup'),
      // 包装器聚焦状态
      focusWrapper: false,
      // 内部聚焦状态
      focusInner: false
    }
  },
  computed: {
    // 包装器CSS类名
    wrapClasses () {
      return [
                    `${prefixCls}-wrapper`,
                    {
                      [`${prefixCls}-group-item`]: this.group,
                      [`${prefixCls}-wrapper-checked`]: this.currentValue,
                      [`${prefixCls}-wrapper-disabled`]: this.itemDisabled,
                      [`${prefixCls}-${this.size}`]: !!this.size,
                      [`${prefixCls}-focus`]: this.focusWrapper,
                      [`${prefixCls}-border`]: this.border
                    }
      ]
    },
    // 单选框CSS类名
    radioClasses () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-checked`]: this.currentValue,
                      [`${prefixCls}-disabled`]: this.itemDisabled
                    }
      ]
    },
    // 内部CSS类名
    innerClasses () {
      return [
                    `${prefixCls}-inner`,
                    {
                      [`${prefixCls}-focus`]: this.focusInner
                    }
      ]
    },
    // 输入框CSS类名
    inputClasses () {
      return `${prefixCls}-input`
    }
  },
  watch: {
    // 监听绑定值变化
    modelValue (val) {
      if (val === this.trueValue || val === this.falseValue) {
        this.updateValue()
      } else {
        throw 'Value should be trueValue or falseValue.'
      }
    }
  },
  mounted () {
    if (this.parent) {
      this.group = true
      if (this.name && this.name !== this.parent.name) {
        /* eslint-disable no-console */
        if (console.warn) {
          console.warn('[iview] Name does not match Radio Group name.')
        }
        /* eslint-enable no-console */
      } else {
        this.groupName = this.parent.name
      }
    }

    if (this.group) {
      this.parent.updateValue()
    } else {
      this.updateValue()
    }
  },
  methods: {
    // 处理值变化
    change (event) {
      if (this.itemDisabled) {
        return false
      }

      const checked = event.target.checked
      this.currentValue = checked

      const value = checked ? this.trueValue : this.falseValue
      this.$emit('update:modelValue', value)

      if (this.group) {
        if (this.label !== undefined) {
          this.parent.change({
            value: this.label,
            checked: this.modelValue
          })
        }
      } else {
        this.$emit('on-change', value)
        this.dispatch('FormItem', 'on-form-change', value)
      }
    },
    // 更新值
    updateValue () {
      this.currentValue = this.modelValue === this.trueValue
    },
    // 失去焦点
    onBlur () {
      this.focusWrapper = false
      this.focusInner = false
    },
    // 获得焦点
    onFocus () {
      if (this.group && this.parent.type === 'button') {
        this.focusWrapper = true
      } else {
        this.focusInner = true
      }
    }
  }
}
</script>
