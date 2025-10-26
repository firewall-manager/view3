<template>
  <!-- 开关容器 -->
  <span
    tabindex="0"
    :class="wrapClasses"
    :style="wrapStyles"
    @click="toggle"
    @keydown.space="toggle"
  >
    <!-- 隐藏输入框 -->
    <input
      type="hidden"
      :name="name"
      :value="currentValue"
    >
    <!-- 开关内部 -->
    <span :class="innerClasses">
      <!-- 开启状态插槽 -->
      <slot
        v-if="currentValue === trueValue"
        name="open"
      />
      <!-- 关闭状态插槽 -->
      <slot
        v-if="currentValue === falseValue"
        name="close"
      />
    </span>
  </span>
</template>
<script>
import { oneOf } from '../utils/assist'
import Emitter from '../mixins/emitter'
import mixinsForm from '../mixins/form'

const prefixCls = 'ivu-switch'

/**
 * 开关组件
 * 用于表示开关状态的切换组件
 */
export default {
  name: 'ISwitch',
  mixins: [Emitter, mixinsForm],
  props: {
    // 绑定值
    modelValue: {
      type: [String, Number, Boolean],
      default: false
    },
    // 开启时的值
    trueValue: {
      type: [String, Number, Boolean],
      default: true
    },
    // 关闭时的值
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 尺寸
    size: {
      validator (value) {
        return oneOf(value, ['large', 'small', 'default'])
      },
      default () {
        return 'default'
      }
    },
    // 原生name属性
    name: {
      type: String
    },
    // 是否显示加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 开启时的颜色
    trueColor: {
      type: String
    },
    // 关闭时的颜色
    falseColor: {
      type: String
    },
    // 切换前的回调
    beforeChange: Function
  },
  emits: ['update:modelValue', 'on-change'],
  data () {
    return {
      // 当前值
      currentValue: this.modelValue
    }
  },
  computed: {
    // 开关包装器CSS类名
    wrapClasses () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-checked`]: this.currentValue === this.trueValue,
                      [`${prefixCls}-disabled`]: this.itemDisabled,
                      [`${prefixCls}-${this.size}`]: !!this.size,
                      [`${prefixCls}-loading`]: this.loading
                    }
      ]
    },
    // 开关包装器样式
    wrapStyles () {
      const style = {}

      if (this.trueColor && this.currentValue === this.trueValue) {
        style['border-color'] = this.trueColor
        style['background-color'] = this.trueColor
      } else if (this.falseColor && this.currentValue === this.falseValue) {
        style['border-color'] = this.falseColor
        style['background-color'] = this.falseColor
      }

      return style
    },
    // 开关内部CSS类名
    innerClasses () {
      return `${prefixCls}-inner`
    }
  },
  watch: {
    // 监听绑定值变化
    modelValue (val) {
      if (val !== this.trueValue && val !== this.falseValue) {
        throw 'Value should be trueValue or falseValue.'
      }
      this.currentValue = val
    }
  },
  methods: {
    // 处理切换
    handleToggle () {
      const checked = this.currentValue === this.trueValue ? this.falseValue : this.trueValue

      this.currentValue = checked
      this.$emit('update:modelValue', checked)
      this.$emit('on-change', checked)
      this.dispatch('FormItem', 'on-form-change', checked)
    },
    // 切换开关
    toggle (event) {
      event.preventDefault()
      if (this.itemDisabled || this.loading) {
        return false
      }

      if (!this.beforeChange) {
        return this.handleToggle()
      }

      const before = this.beforeChange()

      if (before && before.then) {
        before.then(() => {
          this.handleToggle()
        })
      } else {
        this.handleToggle()
      }
    }
  }
}
</script>
