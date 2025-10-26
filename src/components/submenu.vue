<template>
  <!-- 子菜单项 -->
  <li
    :class="classes"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <!-- 子菜单标题 -->
    <component
      ref="reference"
      :class="[prefixCls + '-submenu-title']"
      :style="titleStyle"
      :href="linkUrl"
      :is="to ? 'a' : 'li'"
      @click.prevent="handleItemClick"
    >
      <slot name="title" />
      <!-- 折叠箭头图标 -->
      <Icon
        v-if="collapse"
        :type="arrowType"
        :custom="customArrowType"
        :size="arrowSize"
        :class="[prefixCls + '-submenu-title-icon']"
      />
    </component>
    <!-- 垂直模式折叠过渡 -->
    <CollapseTransition v-if="mode === 'vertical'">
      <ul
        v-show="active"
        :class="[prefixCls]"
      >
        <slot />
      </ul>
    </CollapseTransition>
    <!-- 水平模式下拉过渡 -->
    <transition
      v-else
      name="slide-up"
    >
      <SelectDropdown
        v-show="opened"
        ref="drop"
        placement="bottom"
        :style="dropStyle"
      >
        <ul :class="[prefixCls + '-drop-list']">
          <slot />
        </ul>
      </SelectDropdown>
    </transition>
  </li>
</template>
<script>
import SelectDropdown from './select-dropdown'
import Icon from './icon'
import CollapseTransition from './collapse-transition'
import { getStyle, findComponentUpward, findComponentsDownward } from '../utils/assist'
import Emitter from '../mixins/emitter'
import mixin from '../mixins/menu'
import mixinsLink from '../mixins/link'

const prefixCls = 'ivu-menu'

/**
 * 子菜单组件
 * 菜单中的子菜单项组件
 */
export default {
  name: 'Submenu',
  components: { Icon, SelectDropdown, CollapseTransition },
  mixins: [Emitter, mixin, mixinsLink],
  props: {
    // 子菜单名称
    name: {
      type: [String, Number],
      required: true
    },
    // 是否可折叠
    collapse: {
      type: Boolean,
      default: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      // 是否激活
      active: false,
      // 是否打开
      opened: !this.collapse,
      // 下拉宽度
      dropWidth: parseFloat(getStyle(this.$el, 'width'))
    }
  },
  computed: {
    // 子菜单CSS类名
    classes () {
      return [
                    `${prefixCls}-submenu`,
                    {
                      [`${prefixCls}-item-active`]: this.active && !this.hasParentSubmenu,
                      [`${prefixCls}-opened`]: this.opened,
                      [`${prefixCls}-submenu-disabled`]: this.disabled,
                      [`${prefixCls}-submenu-has-parent-submenu`]: this.hasParentSubmenu,
                      [`${prefixCls}-child-item-active`]: this.active
                    }
      ]
    },
    // 是否手风琴模式
    accordion () {
      return this.menu.accordion
    },
    // 下拉样式
    dropStyle () {
      const style = {}

      if (this.dropWidth) style.minWidth = `${this.dropWidth}px`
      return style
    },
    // 标题样式
    titleStyle () {
      return {}
    },
    // 箭头类型
    arrowType () {
      return 'ios-arrow-down'
    },
    // 自定义箭头类型
    customArrowType () {
      return ''
    },
    // 箭头大小
    arrowSize () {
      return ''
    }
  },
  watch: {
    // 监听菜单模式变化
    mode (val) {
      if (val === 'horizontal') {
        this.$refs.drop.update()
      }
    },
    // 监听打开状态变化
    opened (val) {
      if (this.mode === 'vertical') return
      if (val) {
        // set drop a width to fixed when menu has fixed position
        this.dropWidth = parseFloat(getStyle(this.$el, 'width'))

        this.$refs.drop.update()
      } else {
        this.$refs.drop.destroy()
      }
    }
  },
  mounted () {
    this.mitt.on('on-menu-item-select', this.onMenuItemSelect)
    this.mitt.on('on-update-active-name', this.onUpdateActiveName)
  },
  methods: {
    // 处理菜单项选择
    onMenuItemSelect (name) {
      if (this.mode === 'horizontal') this.opened = false

      this.dispatch('Menu', 'on-menu-item-select', name)

      return true
    },
    // 更新激活名称
    onUpdateActiveName (status) {
      if (findComponentUpward(this, 'Submenu')) this.dispatch('Submenu', 'on-update-active-name', status)

      if (findComponentsDownward(this, 'Submenu')) {
        findComponentsDownward(this, 'Submenu').forEach(item => {
          item.active = false
        })
      }

      this.active = this.name === status.split('.')[0]
    },
    // 处理鼠标进入
    handleMouseenter () {
      if (this.disabled) return
      if (this.mode === 'vertical') return

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.menu.updateOpenKeys(this.name)
        this.opened = true
      }, 250)
    },
    // 处理鼠标离开
    handleMouseleave () {
      if (this.disabled) return
      if (this.mode === 'vertical') return

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.menu.updateOpenKeys(this.name)
        this.opened = false
      }, 150)
    },
    // 处理项目点击
    handleItemClick (event) {
      if (this.disabled) return
      if (this.mode === 'horizontal') return
      const opened = this.opened

      if (this.accordion) {
        this.$parent.$children.forEach(item => {
          if (item.$options.name === 'Submenu') item.opened = false
        })
      }

      if (this.collapse) {
        this.opened = !opened
        this.menu.updateOpenKeys(this.name)
      }

      const parentMenu = findComponentUpward(this, 'Menu')
      if (parentMenu) parentMenu.handleEmitSelectEvent(this.name)

      this.onUpdateActiveName(this.name)
      this.handleCheckClick(event, false)
    }
  }
}
</script>
