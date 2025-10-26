<template>
  <!-- 链接菜单项 -->
  <a
    v-if="to"
    :href="linkUrl"
    :target="target"
    :class="classes"
    :style="itemStyle"
    @click.exact="handleClickItem($event, false)"
    @click.ctrl="handleClickItem($event, true)"
    @click.meta="handleClickItem($event, true)"
  ><slot /></a>
  <!-- 普通菜单项 -->
  <li
    v-else
    :class="classes"
    :style="itemStyle"
    @click.stop="handleClickItem"
  >
    <slot />
  </li>
</template>
<script>
import Emitter from '../mixins/emitter'
import { findComponentUpward } from '../utils/assist'
import mixin from '../mixins/menu'
import mixinsLink from '../mixins/link'

const prefixCls = 'ivu-menu'

/**
 * 菜单项组件
 * 菜单中的单个菜单项组件
 */
export default {
  name: 'MenuItem',
  mixins: [Emitter, mixin, mixinsLink],
  props: {
    // 菜单项名称
    name: {
      type: [String, Number],
      required: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    classes () {
      return [
                    `${prefixCls}-item`,
                    {
                      [`${prefixCls}-item-active`]: this.active,
                      [`${prefixCls}-item-selected`]: this.active,
                      [`${prefixCls}-item-disabled`]: this.disabled
                    }
      ]
    },
    itemStyle () {
      return {}
    }
  },
  mounted () {
    this.mitt.on('on-update-active-name', this.updateActiveName)
  },
  methods: {
    updateActiveName (name) {
      if (this.name === name) {
        this.active = true
        this.dispatch('Submenu', 'on-update-active-name', name)
      } else {
        this.active = false
      }
    },
    handleClickItem (event, new_window = false) {
      if (this.disabled) return

      if (new_window || this.target === '_blank') {
        this.handleCheckClick(event, new_window)
        const parentMenu = findComponentUpward(this, 'Menu')
        if (parentMenu) parentMenu.handleEmitSelectEvent(this.name)
      } else {
        const parent = findComponentUpward(this, 'Submenu')

        if (parent) {
          this.dispatch('Submenu', 'on-menu-item-select', this.name)
        } else {
          this.dispatch('Menu', 'on-menu-item-select', this.name)
        }

        this.handleCheckClick(event, new_window)
      }
    }
  }
}
</script>
