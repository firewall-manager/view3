<template>
  <!-- 分页选项容器 -->
  <div
    v-if="showSizer || showElevator"
    :class="optsClasses"
  >
    <!-- 页面大小选择器 -->
    <div
      v-if="showSizer"
      :class="sizerClasses"
    >
      <VSelect
        v-model="currentPageSize"
        :size="size"
        :placement="placement"
        :transfer="transfer"
        :disabled="disabled"
        @on-change="changeSize"
      >
        <VOption
          v-for="item in pageSizeOpts"
          :key="item"
          :value="item"
          style="text-align:center;"
        >
          {{ item }}{{ t('i.page.page') }}
        </VOption>
      </VSelect>
    </div>
    <!-- 快速跳转输入框 -->
    <div
      v-if="showElevator"
      :class="ElevatorClasses"
    >
      {{ t('i.page.goto') }}
      <input
        type="text"
        :value="_current"
        autocomplete="off"
        spellcheck="false"
        :disabled="disabled"
        @keyup.enter="changePage"
      >
      {{ t('i.page.p') }}
    </div>
  </div>
</template>
<script>
import Locale from '../mixins/locale'
import VSelect from './select'
import VOption from './option'

const prefixCls = 'ivu-page'

/**
 * 检查值是否为数字
 * @param {*} value - 要检查的值
 * @returns {Boolean} 是否为数字
 */
function isValueNumber (value) {
  return (/^[1-9][0-9]*$/).test(value + '')
}

/**
 * 分页选项组件
 * 用于提供分页大小选择和快速跳转功能的组件
 */
export default {
  name: 'PageOption',
  components: { VSelect, VOption },
  mixins: [Locale],
  props: {
    // 页面大小选项数组
    pageSizeOpts: Array,
    // 是否显示页面大小选择器
    showSizer: Boolean,
    // 是否显示快速跳转
    showElevator: Boolean,
    // 当前页码
    current: Number,
    // 当前页码（内部使用）
    _current: Number,
    // 页面大小
    pageSize: Number,
    // 总页数
    allPages: Number,
    // 是否小尺寸
    isSmall: Boolean,
    // 下拉框位置
    placement: String,
    // 是否转移DOM
    transfer: Boolean,
    // 是否禁用
    disabled: Boolean
  },
  emits: ['on-size'],
  data () {
    return {
      currentPageSize: this.pageSize
    }
  },
  computed: {
    size () {
      return this.isSmall ? 'small' : 'default'
    },
    optsClasses () {
      return [
                    `${prefixCls}-options`
      ]
    },
    sizerClasses () {
      return [
                    `${prefixCls}-options-sizer`
      ]
    },
    ElevatorClasses () {
      return [
                    `${prefixCls}-options-elevator`
      ]
    }
  },
  watch: {
    pageSize (val) {
      this.currentPageSize = val
    }
  },
  methods: {
    changeSize () {
      this.$emit('on-size', this.currentPageSize)
    },
    changePage (event) {
      let val = event.target.value.trim()
      let page = 0

      if (isValueNumber(val)) {
        val = Number(val)
        if (val != this.current) {
          const allPages = this.allPages

          if (val > allPages) {
            page = allPages
          } else {
            page = val
          }
        }
      } else {
        page = 1
      }

      if (page) {
        this.$emit('on-page', page)
        event.target.value = page
      }
    }
  }
}
</script>
