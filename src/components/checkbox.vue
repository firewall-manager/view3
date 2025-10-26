<template>
  <!-- 复选框标签容器 -->
  <label :class="wrapClasses">
    <!-- 复选框图标容器 -->
    <span :class="checkboxClasses">
      <!-- 复选框内部图标 -->
      <span :class="innerClasses" />
      <!-- 组模式：使用v-model绑定到model数组 -->
      <input
        v-if="group"
        v-model="model"
        type="checkbox"
        :class="inputClasses"
        :disabled="itemDisabled"
        :value="label"
        :name="name"
        @change="change"
        @focus="onFocus"
        @blur="onBlur"
      >
      <!-- 独立模式：使用checked属性 -->
      <input
        v-else
        type="checkbox"
        :class="inputClasses"
        :disabled="itemDisabled"
        :checked="currentValue"
        :name="name"
        @change="change"
        @focus="onFocus"
        @blur="onBlur"
      >
    </span>
    <!-- 复选框文本内容 -->
    <slot><span v-if="showSlot">{{ label }}</span></slot>
  </label>
</template>
<script>
import { findComponentUpward, oneOf } from '../utils/assist'
import Emitter from '../mixins/emitter'
import mixinsForm from '../mixins/form'

const prefixCls = 'ivu-checkbox'

/**
 * 复选框组件
 * 支持独立模式和组模式，可自定义真值/假值
 */
export default {
  name: 'Checkbox',
  mixins: [Emitter, mixinsForm],
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 双向绑定的值
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
      type: [String, Number, Boolean]
    },
    // 是否半选状态
    indeterminate: {
      type: Boolean,
      default: false
    },
    // 组件尺寸
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default () {
        return 'default'
      }
    },
    // 表单字段名
    name: {
      type: String
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: false
    }
  },
  emits: ['on-change', 'update:modelValue'],
  data () {
    return {
      // 组模式下的值数组
      model: [],
      // 当前选中状态
      currentValue: this.modelValue,
      // 是否在组模式
      group: false,
      // 是否显示插槽内容
      showSlot: true,
      // 父级复选框组组件
      parent: findComponentUpward(this, 'CheckboxGroup'),
      // 内部焦点状态
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
                      [`${prefixCls}-border`]: this.border
                    }
      ]
    },
    // 复选框CSS类名
    checkboxClasses () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-checked`]: this.currentValue,
                      [`${prefixCls}-disabled`]: this.itemDisabled,
                      [`${prefixCls}-indeterminate`]: this.indeterminate
                    }
      ]
    },
    // 内部图标CSS类名
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
    // 监听外部值变化，验证值是否有效
    modelValue (val) {
      if (val === this.trueValue || val === this.falseValue) {
        this.updateModel()
      } else if ([null, undefined, ''].includes(val)) {
        this.updateModel()
      } else {
        throw 'Value should be trueValue or falseValue.'
      }
    }
  },
  mounted () {
    // 查找父级复选框组组件
    this.parent = findComponentUpward(this, 'CheckboxGroup')

    if (this.parent) {
      this.group = true
    }

    if (this.group) {
      // 组模式：通知父组件更新
      this.parent.updateModel(true)
    } else {
      // 独立模式：更新自身状态
      this.updateModel()
      this.showSlot = this.$slots.default !== undefined
    }
  },
  methods: {
    /**
     * 处理复选框变化事件
     * @param {Event} event - 变化事件
     */
    change (event) {
      if (this.itemDisabled) {
        return false
      }

      const checked = event.target.checked
      this.currentValue = checked

      const value = checked ? this.trueValue : this.falseValue
      this.$emit('update:modelValue', value)

      if (this.group) {
        // 组模式：通知父组件
        this.parent.change(this.model)
      } else {
        // 独立模式：发射事件
        this.$emit('on-change', value)
        this.dispatch('FormItem', 'on-form-change', value)
      }
    },
    /**
     * 更新模型状态
     */
    updateModel () {
      this.currentValue = this.modelValue === this.trueValue
    },
    /**
     * 失去焦点事件
     */
    onBlur () {
      this.focusInner = false
    },
    /**
     * 获得焦点事件
     */
    onFocus () {
      this.focusInner = true
    }
  }
}
</script>
