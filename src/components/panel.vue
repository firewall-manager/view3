<template>
  <!-- 折叠面板项 -->
  <div :class="itemClasses">
    <!-- 面板头部 -->
    <div
      :class="headerClasses"
      @click="toggle"
    >
      <Icon
        v-if="!hideArrow"
        type="ios-arrow-forward"
      />
      {{ ' ' }}
      <slot />
    </div>
    <!-- 面板内容折叠过渡 -->
    <collapse-transition v-if="mounted">
      <div
        v-show="isActive"
        :class="contentClasses"
      >
        <div :class="boxClasses">
          <slot name="content" />
        </div>
      </div>
    </collapse-transition>
  </div>
</template>
<script>
import Icon from './icon'
import CollapseTransition from './collapse-transition'
const prefixCls = 'ivu-collapse'

/**
 * 折叠面板组件
 * 折叠面板中的单个面板项组件
 */
export default {
  name: 'Panel',
  components: { Icon, CollapseTransition },
  props: {
    // 面板名称
    name: {
      type: String,
      default: ''
    },
    // 是否隐藏箭头
    hideArrow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      index: 0,
      isActive: false,
      mounted: false
    }
  },
  computed: {
    itemClasses () {
      return [
                    `${prefixCls}-item`,
                    {
                      [`${prefixCls}-item-active`]: this.isActive
                    }
      ]
    },
    headerClasses () {
      return `${prefixCls}-header`
    },
    contentClasses () {
      return `${prefixCls}-content`
    },
    boxClasses () {
      return `${prefixCls}-content-box`
    }
  },
  mounted () {
    this.mounted = true
    this.$parent.setActive()
  },
  methods: {
    toggle () {
      this.$parent.toggle({
        name: this.name || this.index,
        isActive: this.isActive
      })
    }
  }
}
</script>
