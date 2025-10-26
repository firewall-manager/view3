<template>
  <div
  >
    <span
      v-if="$slots.prefix || prefix"
      :class="[prefixCls + '-prefix']"
    >
      <slot name="prefix">
        <Icon
          v-if="prefix"
          :type="prefix"
        />
      </slot>
    </span>
    <div
      v-for="(item, index) in selectedMultiple"
      class="ivu-tag ivu-tag-checked"
    >
      <template v-if="maxTagCount === undefined || index < maxTagCount">
        <span
          class="ivu-tag-text"
          :class="{ 'ivu-select-multiple-tag-hidden': item.disabled }"
        >{{ item.tag !== undefined ? item.tag : item.label }}</span>
        <Icon
          v-if="!item.disabled"
          type="ios-close"
          size="large"
          @click.capture.stop="removeTag(item)"
        />
      </template>
    </div>
    <div
      v-if="maxTagCount !== undefined && selectedMultiple.length > maxTagCount"
      class="ivu-tag ivu-tag-checked"
    >
      <span class="ivu-tag-text ivu-select-max-tag">
        <template v-if="maxTagPlaceholder">{{ maxTagPlaceholder(selectedMultiple.length - maxTagCount) }}</template>
        <template v-else>+ {{ selectedMultiple.length - maxTagCount }}...</template>
      </span>
    </div>
    <span
      v-show="singleDisplayValue"
      :class="singleDisplayClasses"
    >{{ singleDisplayValue }}</span>
    <input
      v-if="filterable"
      :id="inputElementId"
      ref="input"
      v-model="query"
      type="text"
      :disabled="disabled"
      :class="[prefixCls + '-input']"
      :placeholder="showPlaceholder ? localePlaceholder : ''"
      :style="inputStyle"
      autocomplete="off"
      spellcheck="false"
      @keydown="resetInputState"
      @keydown.delete="handleInputDelete"
      @keydown.enter="handleInputEnter"
      @focus="onInputFocus"

      @blur="onInputBlur"
    >
    <Icon
      v-if="resetSelect"
      type="ios-close-circle"
      :class="[prefixCls + '-arrow']"
      @click.native.stop="onClear"
    />
    <Icon
      v-if="!resetSelect && !remote"
      :type="arrowType"
      :custom="customArrowType"
      :size="arrowSize"
      :class="[prefixCls + '-arrow']"
    />
  </div>
</template>
<script>
import Icon from './icon'
import Locale from '../mixins/locale'

const prefixCls = 'ivu-select'

/**
 * 选择器头部组件
 * 用于显示选择器的头部内容，包括前缀、标签、输入框等
 */
export default {
  name: 'SelectHead',
  components: { Icon },
  mixins: [Locale],
  inject: ['selectComponent'],
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否远程搜索
    remote: {
      type: Boolean,
      default: false
    },
    // 初始标签
    initialLabel: {
      type: [String, Number, Array]
    },
    // 选中的值
    values: {
      type: Array,
      default: () => []
    },
    // 是否可清除
    clearable: {
      type: [Function, Boolean],
      default: false
    },
    // 输入框元素ID
    inputElementId: {
      type: String
    },
    // 占位符
    placeholder: {
      type: String
    },
    // 查询属性
    queryProp: {
      type: String,
      default: ''
    },
    // 前缀
    prefix: {
      type: String
    },
    // 最大标签数量
    maxTagCount: {
      type: Number
    },
    // 最大标签占位符
    maxTagPlaceholder: {
      type: Function
    },
    // 是否允许创建
    allowCreate: {
      type: Boolean
    },
    // 是否显示创建项
    showCreateItem: {
      type: Boolean
    }
  },
  emits: ['on-input-blur', 'on-query-change', 'on-input-focus', 'on-keydown'],
  data () {
    return {
      // 样式前缀
      prefixCls: prefixCls,
      // 查询文本
      query: '',
      // 输入框长度
      inputLength: 20,
      // 远程初始标签
      remoteInitialLabel: this.initialLabel,
      // 是否阻止远程调用
      preventRemoteCall: false
    }
  },
  computed: {
    // 单选显示CSS类名
    singleDisplayClasses () {
      const { filterable, multiple, showPlaceholder } = this
      return [{
        [prefixCls + '-head-with-prefix']: this.$slots.prefix || this.prefix,
        [prefixCls + '-placeholder']: showPlaceholder && !filterable,
        [prefixCls + '-selected-value']: !showPlaceholder && !multiple && !filterable
      }]
    },
    // 单选显示值
    singleDisplayValue () {
      if ((this.multiple && this.values.length > 0) || this.filterable) return ''
      return `${this.selectedSingle}` || this.localePlaceholder
    },
    // 是否显示占位符
    showPlaceholder () {
      let status = false
      if (!this.multiple) {
        const value = this.values[0]
        if (typeof value === 'undefined' || String(value).trim() === '') {
          status = !this.remoteInitialLabel
        }
      } else {
        if (!this.values.length > 0) {
          status = true
        }
      }
      return status
    },
    // 是否重置选择
    resetSelect () {
      return !this.showPlaceholder && this.clearable
    },
    // 输入框样式
    inputStyle () {
      const style = {}

      if (this.multiple) {
        if (this.showPlaceholder) {
          style.width = '100%'
        } else {
          style.width = `${this.inputLength}px`
        }
      }

      return style
    },
    // 本地化占位符
    localePlaceholder () {
      if (this.placeholder === undefined) {
        return this.t('i.select.placeholder')
      } else {
        return this.placeholder
      }
    },
    // 选中的单选值
    selectedSingle () {
      const selected = this.values[0]
      return selected ? selected.label : (this.remoteInitialLabel || '')
    },
    // 选中的多选值
    selectedMultiple () {
      return this.multiple ? this.values : []
    },
    // 头部CSS类名
    headCls () {
      return {
        [`${prefixCls}-head-flex`]: this.filterable && (this.$slots.prefix || this.prefix)
      }
    },
    // 箭头类型
    arrowType () {
      return 'ios-arrow-down'
    },
    // 自定义箭头类型
    customArrowType () {
      return ''
    },
    // 箭头尺寸
    arrowSize () {
      return ''
    }
  },
  watch: {
    values ([value]) {
      if (!this.filterable) return
      this.preventRemoteCall = true
      if (this.multiple) {
        this.query = ''
        this.preventRemoteCall = false // this should be after the query change setter above
        return
      }
      // #982
      if (typeof value === 'undefined' || value === '' || value === null) this.query = ''
      else this.query = value.label
      this.$nextTick(() => this.preventRemoteCall = false) // this should be after the query change setter above
    },
    query (val) {
      if (this.preventRemoteCall) {
        this.preventRemoteCall = false
        return
      }

      this.$emit('on-query-change', val)
    },
    queryProp (query) {
      if (query !== this.query) this.query = query
    }
  },
  methods: {
    // 处理输入框获得焦点
    onInputFocus () {
      this.$emit('on-input-focus')
    },
    // 处理输入框失去焦点
    onInputBlur () {
      if (this.showCreateItem) return
      if (!this.values.length) this.query = '' // #5155
      this.$emit('on-input-blur')
    },
    // 移除标签
    removeTag (value) {
      if (this.disabled) return false
      this.selectComponent.onOptionClick(value)
    },
    // 重置输入框状态
    resetInputState () {
      this.inputLength = this.$refs.input.value.length * 12 + 20
      this.$emit('on-keydown')
    },
    // 处理输入框删除
    handleInputDelete (e) {
      const targetValue = e.target.value
      if (this.multiple && this.selectedMultiple.length && this.query === '' && targetValue === '') {
        this.removeTag(this.selectedMultiple[this.selectedMultiple.length - 1])
      }
    },
    // 处理输入框回车
    handleInputEnter () {
      this.$emit('on-enter')
    },
    // 处理头部点击
    onHeaderClick (e) {
      if (this.filterable && e.target === this.$el) {
        this.$refs.input.focus()
      }
    },
    // 处理清除
    onClear () {
      this.$emit('on-clear')
    }
  }
}
</script>
