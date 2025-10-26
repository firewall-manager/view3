<template>
  <!-- 级联选择器组件容器 -->
  <div
    v-click-outside="handleClose"
    :class="classes"
  >
    <!-- 选择器触发器 -->
    <div
      ref="reference"
      :class="[prefixCls + '-rel']"
      @click="toggleOpen"
    >
      <!-- 隐藏输入框，用于表单提交 -->
      <input
        type="hidden"
        :name="name"
        :value="currentValue"
      >
      <!-- 自定义触发器插槽 -->
      <slot>
        <!-- 输入框 -->
        <VInput
          ref="input"
          :element-id="elementId"
          :readonly="!filterable"
          :disabled="itemDisabled"
          :model-value="displayInputRender"
          :size="size"
          :placeholder="inputPlaceholder"
          @on-change="handleInput"
        />
        <!-- 显示标签（非搜索模式） -->
        <div
          v-show="filterable && query === ''"
          :class="[prefixCls + '-label']"
          @click="handleFocus"
        >
          {{ displayRender }}
        </div>
        <!-- 清空按钮 -->
        <Icon
          v-show="showCloseIcon"
          type="ios-close-circle"
          :class="[prefixCls + '-arrow']"
          @click.native.stop="clearSelect"
        />
        <!-- 下拉箭头 -->
        <Icon
          :type="arrowType"
          :custom="customArrowType"
          :size="arrowSize"
          :class="[prefixCls + '-arrow']"
        />
      </slot>
    </div>
    <!-- 下拉面板 -->
    <transition name="transition-drop">
      <SelectDropdown
        v-show="visible"
        ref="drop"
        v-transfer-dom
        :class="dropdownCls"
        :data-transfer="transfer"
        :transfer="transfer"
      >
        <div>
          <!-- 级联面板 -->
          <Caspanel
            v-show="!filterable || (filterable && query === '')"
            ref="caspanel"
            :prefix-cls="prefixCls"
            :data="data"
            :disabled="itemDisabled"
            :change-on-select="changeOnSelect"
            :trigger="trigger"
          />
          <!-- 搜索结果列表 -->
          <div
            v-show="filterable && query !== '' && querySelections.length"
            :class="[prefixCls + '-dropdown']"
          >
            <ul :class="[selectPrefixCls + '-dropdown-list']">
              <li
                v-for="(item, index) in querySelections"
                :class="[selectPrefixCls + '-item', {
                  [selectPrefixCls + '-item-disabled']: item.disabled
                }]"
                @click="handleSelectItem(index)"
                v-html="item.display"
              />
            </ul>
          </div>
          <!-- 无结果提示 -->
          <ul
            v-show="(filterable && query !== '' && !querySelections.length) || !data.length"
            :class="[prefixCls + '-not-found-tip']"
          >
            <li>{{ localeNotFoundText }}</li>
          </ul>
        </div>
      </SelectDropdown>
    </transition>
  </div>
</template>
<script>
import VInput from './input.vue'
import SelectDropdown from './select-dropdown'
import Icon from './icon.vue'
import Caspanel from './caspanel.vue'
import clickOutside from '../directives/clickoutside'
import TransferDom from '../directives/transfer-dom'
import { oneOf } from '../utils/assist'
import Emitter from '../mixins/emitter'
import Locale from '../mixins/locale'
import mixinsForm from '../mixins/form'

const prefixCls = 'ivu-cascader'
const selectPrefixCls = 'ivu-select'

/**
 * 级联选择器组件
 * 支持多级联动选择，可搜索过滤，支持异步加载数据
 */
export default {
  name: 'Cascader',
  components: { VInput, SelectDropdown, Icon, Caspanel },
  directives: { clickOutside, TransferDom },
  mixins: [Emitter, Locale, mixinsForm],
  props: {
    // 级联数据
    data: {
      type: Array,
      default () {
        return []
      }
    },
    // 双向绑定的值
    modelValue: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true
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
    // 触发方式
    trigger: {
      validator (value) {
        return oneOf(value, ['click', 'hover'])
      },
      default: 'click'
    },
    // 是否选择即改变
    changeOnSelect: {
      type: Boolean,
      default: false
    },
    // 自定义显示格式
    renderFormat: {
      type: Function,
      default (label) {
        return label.join(' / ')
      }
    },
    // 异步加载数据函数
    loadData: {
      type: Function
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: false
    },
    // 无数据时的文本
    notFoundText: {
      type: String
    },
    // 是否传送到body
    transfer: {
      type: Boolean,
      default () {
        return false
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
    // 是否捕获事件
    capture: {
      type: Boolean,
      default () {
        return true
      }
    },
    // 传送容器的类名
    transferClassName: {
      type: String
    }
  },
  emits: ['on-visible-change', 'update:modelValue', 'on-change'],
  data () {
    return {
      // CSS类名前缀
      prefixCls: prefixCls,
      // 选择器CSS类名前缀
      selectPrefixCls: selectPrefixCls,
      // 是否显示下拉面板
      visible: false,
      // 已选择的项
      selected: [],
      // 临时选择的项
      tmpSelected: [],
      // 是否正在更新值（用于修复changeOnSelect类型设置值的问题）
      updatingValue: false,
      // 当前值
      currentValue: this.modelValue,
      // 搜索查询文本
      query: '',
      // 有效数据字符串（用于比较数据变化）
      validDataStr: '',
      // 是否已加载子项（用于避免重复触发updateSelect）
      isLoadedChildren: false
    }
  },
  computed: {
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-show-clear`]: this.showCloseIcon,
                      [`${prefixCls}-size-${this.size}`]: !!this.size,
                      [`${prefixCls}-visible`]: this.visible,
                      [`${prefixCls}-disabled`]: this.itemDisabled,
                      [`${prefixCls}-not-found`]: this.filterable && this.query !== '' && !this.querySelections.length
                    }
      ]
    },
    showCloseIcon () {
      return this.currentValue && this.currentValue.length && this.clearable && !this.itemDisabled
    },
    displayRender () {
      const label = []
      for (let i = 0; i < this.selected.length; i++) {
        label.push(this.selected[i].label)
      }

      return this.renderFormat(label, this.selected)
    },
    displayInputRender () {
      return this.filterable ? '' : this.displayRender
    },
    localePlaceholder () {
      if (this.placeholder === undefined) {
        return this.t('i.select.placeholder')
      } else {
        return this.placeholder
      }
    },
    inputPlaceholder () {
      return this.filterable && this.currentValue.length ? null : this.localePlaceholder
    },
    localeNotFoundText () {
      if (this.notFoundText === undefined) {
        return this.t('i.select.noMatch')
      } else {
        return this.notFoundText
      }
    },
    querySelections () {
      let selections = []
      function getSelections (arr, label, value) {
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i]
          item.__label = label ? label + ' / ' + item.label : item.label
          item.__value = value ? value + ',' + item.value : item.value

          if (item.children && item.children.length) {
            getSelections(item.children, item.__label, item.__value)
            delete item.__label
            delete item.__value
          } else {
            selections.push({
              label: item.__label,
              value: item.__value,
              display: item.__label,
              item: item,
              disabled: !!item.disabled
            })
          }
        }
      }
      getSelections(this.data)
      selections = selections.filter(item => {
        return item.label ? item.label.indexOf(this.query) > -1 : false
      }).map(item => {
        item.display = item.display.replace(new RegExp(this.query, 'g'), `<span>${this.query}</span>`)
        return item
      })
      return selections
    },
    // 3.4.0, global setting customArrow 有值时，arrow 赋值空
    arrowType () {
      return 'ios-arrow-down'
    },
    // 3.4.0, global setting
    customArrowType () {
      return ''
    },
    // 3.4.0, global setting
    arrowSize () {
      return ''
    },
    dropdownCls () {
      return {
        [prefixCls + '-transfer']: this.transfer,
        [this.transferClassName]: this.transferClassName
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.currentValue.length) {
          this.updateSelected()
        }
        if (this.transfer) {
          this.$refs.drop.update()
        }
        this.broadcast('SelectDropdown', 'on-update-popper')
      } else {
        if (this.filterable) {
          this.query = ''
          this.$refs.input.currentValue = ''
        }
        if (this.transfer) {
          this.$refs.drop.destroy()
        }
        this.broadcast('SelectDropdown', 'on-destroy-popper')
      }
      this.$emit('on-visible-change', val)
    },
    modelValue (val) {
      this.currentValue = val
      if (!val.length) this.selected = []
    },
    currentValue () {
      this.$emit('update:modelValue', this.currentValue)
      if (this.updatingValue) {
        this.updatingValue = false
        return
      }
      this.updateSelected(true)
    },
    data: {
      deep: true,
      handler () {
        const validDataStr = JSON.stringify(this.getValidData(this.data))
        if (validDataStr !== this.validDataStr) {
          this.validDataStr = validDataStr
          if (!this.isLoadedChildren) {
            this.$nextTick(() => this.updateSelected(false, this.changeOnSelect))
          }
          this.isLoadedChildren = false
        }
      }
    }
  },
  created () {
    this.validDataStr = JSON.stringify(this.getValidData(this.data))
    this.mitt.on('on-result-change', (params) => {
      // lastValue: is click the final val
      // fromInit: is this emit from update value
      const lastValue = params.lastValue
      const changeOnSelect = params.changeOnSelect
      const fromInit = params.fromInit

      if (lastValue || changeOnSelect) {
        const oldVal = JSON.stringify(this.currentValue)
        this.selected = this.tmpSelected

        const newVal = []
        this.selected.forEach((item) => {
          newVal.push(item.value)
        })

        if (!fromInit) {
          this.updatingValue = true
          this.currentValue = newVal
          this.emitValue(this.currentValue, oldVal)
        }
      }
      if (lastValue && !fromInit) {
        this.handleClose()
      }
    })
  },
  mounted () {
    this.updateSelected(true)
  },
  methods: {
    clearSelect () {
      if (this.itemDisabled) return false
      const oldVal = JSON.stringify(this.currentValue)
      this.currentValue = this.selected = this.tmpSelected = []
      this.handleClose()
      this.emitValue(this.currentValue, oldVal)
      //                this.$broadcast('on-clear');
      this.broadcast('Caspanel', 'on-clear')
    },
    handleClose () {
      this.visible = false
    },
    toggleOpen () {
      if (this.itemDisabled) return false
      if (this.visible) {
        if (!this.filterable) this.handleClose()
      } else {
        this.onFocus()
      }
    },
    onFocus () {
      this.visible = true
      if (!this.currentValue.length) {
        this.broadcast('Caspanel', 'on-clear')
      }
    },
    updateResult (result) {
      this.tmpSelected = result
    },
    updateSelected (init = false, changeOnSelectDataChange = false) {
      // #2793 changeOnSelectDataChange used for changeOnSelect when data changed and set value
      if (!this.changeOnSelect || init || changeOnSelectDataChange) {
        this.broadcast('Caspanel', 'on-find-selected', {
          value: this.currentValue
        })
      }
    },
    emitValue (val, oldVal) {
      if (JSON.stringify(val) !== oldVal) {
        this.$emit('on-change', this.currentValue, JSON.parse(JSON.stringify(this.selected)))
        this.$nextTick(() => {
          this.dispatch('FormItem', 'on-form-change', {
            value: this.currentValue,
            selected: JSON.parse(JSON.stringify(this.selected))
          })
        })
      }
    },
    handleInput (event) {
      this.query = event.target.value
    },
    handleSelectItem (index) {
      const item = this.querySelections[index]

      if (item.item.disabled) return false
      this.query = ''
      this.$refs.input.currentValue = ''
      const oldVal = JSON.stringify(this.currentValue)
      this.currentValue = item.value.split(',')
      // use setTimeout for #4786, can not use nextTick, because @on-find-selected use nextTick
      setTimeout(() => {
        this.emitValue(this.currentValue, oldVal)
        this.handleClose()
      }, 0)
    },
    handleFocus () {
      this.$refs.input.focus()
    },
    // 排除 loading 后的 data，避免重复触发 updateSelect
    getValidData (data) {
      function deleteData (item) {
        const new_item = Object.assign({}, item)
        if ('loading' in new_item) {
          delete new_item.loading
        }
        if ('__value' in new_item) {
          delete new_item.__value
        }
        if ('__label' in new_item) {
          delete new_item.__label
        }
        if ('children' in new_item && new_item.children.length) {
          new_item.children = new_item.children.map(i => deleteData(i))
        }
        return new_item
      }

      return data.map(item => deleteData(item))
    }
  }
}
</script>
