<template>
  <!-- 选项项 -->
  <li
    :class="classes"
    @click.stop="select"
    @mousedown.prevent
  >
    <slot>{{ showLabel }}</slot>
  </li>
</template>
<script>
import Emitter from '../mixins/emitter'
import mixinsForm from '../mixins/form'
import { findComponentUpward } from '../utils/assist'

const prefixCls = 'ivu-select-item'

/**
 * 选项组件
 * 选择器中的单个选项组件
 */
export default {
  name: 'VOption',
  componentName: 'select-item',
  mixins: [Emitter, mixinsForm],
  inject: ['selectComponent'],
  props: {
    // 选项值
    value: {
      type: [String, Number],
      required: true
    },
    // 选项标签
    label: {
      type: [String, Number]
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否选中
    selected: {
      type: Boolean,
      default: false
    },
    // 是否聚焦
    isFocused: {
      type: Boolean,
      default: false
    },
    // 标签值
    tag: {
      type: [String, Number]
    }
  },
  emits: ['on-select-selected', 'on-clickoutside'],
  data () {
    return {
      searchLabel: '', // the slot value (textContent)
      autoComplete: false,
      dataSelected: false,
      dataIsFocused: false
    }
  },
  computed: {
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-disabled`]: this.itemDisabled,
                      [`${prefixCls}-selected`]: this.dataSelected && !this.autoComplete,
                      [`${prefixCls}-focus`]: this.dataIsFocused
                    }
      ]
    },
    showLabel () {
      return (this.label) ? this.label : this.value
    },
    optionLabel () {
      return this.label || (this.$el && this.$el.textContent)
    }
  },
  watch: {
    selected (value) {
      this.dataSelected = value
    },
    isFocused (value) {
      this.dataIsFocused = value
    }
  },
  mounted () {
    const Select = this.selectComponent
    if (Select) this.autoComplete = Select.autoComplete

    this.selectComponent.optionComponents.push(this)
  },
  beforeUnmount () {
    const index = this.selectComponent.optionComponents.indexOf(this)

    this.selectComponent.optionComponents.splice(index, 1)
  },
  methods: {
    select () {
      if (this.itemDisabled) return false

      this.selectComponent.mitt.emit('on-select-selected', {
        value: this.value,
        label: this.optionLabel,
        tag: this.tag
      })
      this.$emit('on-select-selected', {
        value: this.value,
        label: this.optionLabel,
        tag: this.tag
      })
    }
  }
}
</script>
