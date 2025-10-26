<template>
  <!-- 下拉菜单项 -->
  <li
    :class="classes"
    @click="handleClick"
  >
    <slot />
  </li>
</template>
<script>
import { findComponentUpward } from '../utils/assist'
const prefixCls = 'ivu-dropdown-item'

/**
 * 下拉菜单项组件
 * 下拉菜单中的单个菜单项
 */
export default {
  name: 'DropdownItem',
  props: {
    // 菜单项名称
    name: {
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
    // 是否有分割线
    divided: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 菜单项CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-disabled`]: this.disabled,
                      [`${prefixCls}-selected`]: this.selected,
                      [`${prefixCls}-divided`]: this.divided
                    }
      ]
    }
  },
  methods: {
    /**
     * 处理菜单项点击事件
     */
    handleClick () {
      if (this.disabled) return
      const $parent = findComponentUpward(this, 'Dropdown')
      const hasChildren = this.$parent && this.$parent.$options.name === 'Dropdown'

      if (hasChildren) {
        // 有子菜单时发射事件
        this.$parent.mitt.emit('on-haschild-click')
      } else {
        // 无子菜单时发射悬停点击事件
        if ($parent && $parent.$options.name === 'Dropdown') {
          $parent.mitt.emit('on-hover-click')
        }
      }
      // 发射点击事件
      $parent.mitt.emit('on-click', this.name)
    }
  }
}
</script>
