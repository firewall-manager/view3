<template>
  <!-- 自动完成组件，基于选择器实现 -->
  <VSelect
    ref="select"
    class="ivu-auto-complete"
    :label="label"
    :disabled="itemDisabled"
    :clearable="clearable"
    :placeholder="placeholder"
    :size="size"
    :placement="placement"
    :model-value="currentValue"
    :transfer-class-name="transferClassName"
    filterable
    remote
    auto-complete
    :remote-method="remoteMethod"
    :transfer="transfer"
    @on-select="handleSelect"
    @on-clickoutside="handleClickOutside"
  >
    <!-- 输入框插槽 -->
    <template #input>
      <VInput
        ref="input"
        slot="input"
        v-model="currentValue"
        :element-id="elementId"
        :name="name"
        :placeholder="placeholder"
        :disabled="itemDisabled"
        :size="size"
        :icon="inputIcon"
        :border="border"
        @on-click="handleClear"
        @on-focus="handleFocus"
        @on-blur="handleBlur"
      />
    </template>
    <!-- 自定义选项插槽 -->
    <slot v-if="$slots.default" />
    <!-- 默认选项列表 -->
    <template v-else>
      <VOption
        v-for="item in filteredData"
        :key="item"
        :value="item"
      >
        {{ item }}
      </VOption>
    </template>
  </VSelect>
</template>
<script>
import VSelect from './select'
import VOption from './option'
import VInput from './input'
import { oneOf } from '../utils/assist'
import Emitter from '../mixins/emitter'
import mixinsForm from '../mixins/form'

/**
 * 自动完成组件
 * 提供输入建议功能，支持远程搜索和自定义过滤
 */
export default {
  name: 'AutoComplete',
  components: { VSelect, VOption, VInput },
  mixins: [Emitter, mixinsForm],
  props: {
    // 双向绑定的值
    modelValue: {
      type: [String, Number],
      default: ''
    },
    // 标签文本
    label: {
      type: [String, Number],
      default: ''
    },
    // 选项数据数组
    data: {
      type: Array,
      default: () => []
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false
    },
    // 占位符文本
    placeholder: {
      type: String
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
    // 输入框图标
    icon: {
      type: String
    },
    // 自定义过滤方法
    filterMethod: {
      type: [Function, Boolean],
      default: false
    },
    // 下拉框位置
    placement: {
      validator (value) {
        return oneOf(value, ['top', 'bottom', 'top-start', 'bottom-start', 'top-end', 'bottom-end'])
      },
      default: 'bottom-start'
    },
    // 是否传送到body
    transfer: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default () {
        return true
      }
    },
    // 表单字段名
    name: {
      type: String
    },
    // 元素ID
    elementId: {
      type: String
    },
    // 传送容器的类名
    transferClassName: {
      type: String
    }
  },
  emits: ['on-search', 'update:modelValue', 'on-focus', 'on-blur', 'on-change', 'on-select'],
  data () {
    return {
      // 当前输入值
      currentValue: this.modelValue,
      // 禁用变化事件发射（用于表单重置）
      disableEmitChange: false
    }
  },
  computed: {
    // 输入框图标：根据清空按钮和自定义图标决定
    inputIcon () {
      let icon = ''
      if (this.clearable && this.currentValue && !this.disabled) {
        icon = 'ios-close'
      } else if (this.icon) {
        icon = this.icon
      }
      return icon
    },
    // 过滤后的数据：使用自定义过滤方法或返回原始数据
    filteredData () {
      if (this.filterMethod) {
        return this.data.filter(item => this.filterMethod(this.currentValue, item))
      } else {
        return this.data
      }
    }
  },
  watch: {
    // 监听外部值变化
    modelValue (val) {
      if (this.currentValue !== val) {
        this.disableEmitChange = true
      }
      this.currentValue = val
    },
    // 监听内部值变化
    currentValue (val) {
      this.$refs.select.setQuery(val)
      this.$emit('update:modelValue', val)
      if (this.disableEmitChange) {
        this.disableEmitChange = false
        return
      }
      this.$emit('on-change', val)
      this.dispatch('FormItem', 'on-form-change', val)
    }
  },
  methods: {
    /**
     * 远程搜索方法
     * @param {String} query - 搜索关键词
     */
    remoteMethod (query) {
      this.$emit('on-search', query)
    },
    /**
     * 处理选项选择
     * @param {Object} option - 选中的选项
     */
    handleSelect (option) {
      const val = option.value
      if (val === undefined || val === null) return
      this.currentValue = val
      this.$refs.input.blur()
      this.$emit('on-select', val)
    },
    /**
     * 处理输入框获得焦点
     * @param {Event} event - 焦点事件
     */
    handleFocus (event) {
      this.$emit('on-focus', event)
    },
    /**
     * 处理输入框失去焦点
     * @param {Event} event - 失焦事件
     */
    handleBlur (event) {
      this.$emit('on-blur', event)
    },
    /**
     * 处理清空操作
     */
    handleClear () {
      if (!this.clearable) return
      this.currentValue = ''
      this.$refs.select.reset()
      this.$emit('on-clear')
    },
    /**
     * 处理点击外部区域
     * 失焦输入框
     */
    handleClickOutside () {
      this.$nextTick(() => {
        this.$refs.input.blur()
      })
    }
  }
}
</script>
