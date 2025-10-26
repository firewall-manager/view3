<template>
  <!-- 评分组件容器 -->
  <div
    :class="classes"
    @mouseleave="handleMouseleave"
  >
    <!-- 隐藏输入框 -->
    <input
      type="hidden"
      :name="name"
      :value="currentValue"
    >
    <!-- 评分星星 -->
    <div
      v-for="item in count"
      :key="item"
      :class="starCls(item)"
      @mousemove="handleMousemove(item, $event)"
      @click="handleClick(item)"
    >
      <!-- 默认星星 -->
      <template v-if="!showCharacter">
        <span
          :class="[prefixCls + '-star-content']"
          type="half"
        />
      </template>
      <!-- 自定义字符或图标 -->
      <template v-else>
        <span
          :class="[prefixCls + '-star-first']"
          type="half"
        >
          <template v-if="character !== ''">{{ character }}</template>
          <i
            v-else
            :class="iconClasses"
            type="half"
          />
        </span>
        <span :class="[prefixCls + '-star-second']">
          <template v-if="character !== ''">{{ character }}</template>
          <i
            v-else
            :class="iconClasses"
          />
        </span>
      </template>
    </div>
    <!-- 评分文本 -->
    <div
      v-if="showText"
      v-show="currentValue > 0"
      :class="[prefixCls + '-text']"
    >
      <slot><span>{{ currentValue }}</span> <span v-if="currentValue <= 1">{{ t('i.rate.star') }}</span><span v-else>{{ t('i.rate.stars') }}</span></slot>
    </div>
  </div>
</template>
<script>
import Locale from '../mixins/locale'
import Emitter from '../mixins/emitter'
import mixinsForm from '../mixins/form'

import Icon from './icon'

const prefixCls = 'ivu-rate'

/**
 * 评分组件
 * 用于评分的星星组件
 */
export default {
  name: 'Rate',
  components: { Icon },
  mixins: [Locale, Emitter, mixinsForm],
  props: {
    // 星星总数
    count: {
      type: Number,
      default: 5
    },
    // 绑定值
    value: {
      type: Number,
      default: 0
    },
    // 是否允许半星
    allowHalf: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否显示文本
    showText: {
      type: Boolean,
      default: false
    },
    // 原生name属性
    name: {
      type: String
    },
    // 是否可清除
    clearable: {
      type: Boolean,
      default: false
    },
    // 自定义字符
    character: {
      type: String,
      default: ''
    },
    // 图标类型
    icon: {
      type: String,
      default: ''
    },
    // 自定义图标
    customIcon: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      // 悬停索引
      hoverIndex: -1,
      // 是否悬停
      isHover: false,
      // 是否半星
      isHalf: this.allowHalf && this.value.toString().indexOf('.') >= 0,
      // 当前值
      currentValue: this.value
    }
  },
  computed: {
    // 评分组件CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-disabled`]: this.itemDisabled
                    }
      ]
    },
    // 图标CSS类名
    iconClasses () {
      return [
        'ivu-icon',
        {
          [`ivu-icon-${this.icon}`]: this.icon !== '',
          [`${this.customIcon}`]: this.customIcon !== ''
        }
      ]
    },
    // 是否显示自定义字符
    showCharacter () {
      return this.character !== '' || this.icon !== '' || this.customIcon !== ''
    }
  },
  watch: {
    // 监听绑定值变化
    value (val) {
      this.currentValue = val
    },
    // 监听当前值变化
    currentValue (val) {
      this.setHalf(val)
    }
  },
  methods: {
    // 星星CSS类名
    starCls (value) {
      const hoverIndex = this.hoverIndex
      const currentIndex = this.isHover ? hoverIndex : this.currentValue

      let full = false
      let isLast = false

      if (currentIndex >= value) full = true

      if (this.isHover) {
        isLast = currentIndex === value
      } else {
        isLast = Math.ceil(this.currentValue) === value
      }

      return [
        {
          [`${prefixCls}-star`]: !this.showCharacter,
          [`${prefixCls}-star-chart`]: this.showCharacter,
          [`${prefixCls}-star-full`]: (!isLast && full) || (isLast && !this.isHalf),
          [`${prefixCls}-star-half`]: isLast && this.isHalf,
          [`${prefixCls}-star-zero`]: !full
        }
      ]
    },
    // 处理鼠标移动
    handleMousemove (value, event) {
      if (this.itemDisabled) return

      this.isHover = true
      if (this.allowHalf) {
        const type = event.target.getAttribute('type') || false
        this.isHalf = type === 'half'
      } else {
        this.isHalf = false
      }
      this.hoverIndex = value
    },
    // 处理鼠标离开
    handleMouseleave () {
      if (this.itemDisabled) return

      this.isHover = false
      this.setHalf(this.currentValue)
      this.hoverIndex = -1
    },
    // 设置半星状态
    setHalf (val) {
      this.isHalf = this.allowHalf && val.toString().indexOf('.') >= 0
    },
    // 处理点击
    handleClick (value) {
      if (this.itemDisabled) return
      // value++;
      if (this.isHalf) value -= 0.5

      if (this.clearable && Math.abs(value - this.currentValue) < 0.01) {
        value = 0
      }

      this.currentValue = value
      this.$emit('input', value)
      this.$emit('on-change', value)
      this.dispatch('FormItem', 'on-form-change', value)
    }
  }
}
</script>
