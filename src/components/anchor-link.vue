<template>
  <!-- 锚点链接组件 -->
  <div :class="anchorLinkClasses">
    <!-- 锚点链接 -->
    <a
      :class="linkTitleClasses"
      :href="href"
      :data-scroll-offset="scrollOffset"
      :data-href="href"
      :title="title"
      @click.prevent="goAnchor"
    >{{ title }}</a>
    <!-- 子锚点链接插槽 -->
    <slot />
  </div>
</template>
<script>
/**
 * 锚点链接组件
 * 锚点导航中的单个链接项，支持点击跳转和激活状态
 */
export default {
  name: 'AnchorLink',
  // 注入父级锚点组件的实例
  inject: ['anchorCom'],
  props: {
    // 锚点链接地址
    href: String,
    // 链接标题
    title: String,
    // 滚动偏移量，默认使用父组件的值
    scrollOffset: {
      type: Number,
      default () {
        return this.anchorCom.scrollOffset
      }
    }
  },
  data () {
    return {
      // CSS类名前缀
      prefix: 'ivu-anchor-link'
    }
  },
  computed: {
    // 锚点链接CSS类名
    anchorLinkClasses () {
      return [
        this.prefix,
        // 当前激活的链接添加active类
        this.anchorCom.currentLink === this.href ? `${this.prefix}-active` : ''
      ]
    },
    // 链接标题CSS类名
    linkTitleClasses () {
      return [
                `${this.prefix}-title`
      ]
    }
  },
  mounted () {
    // 组件挂载后初始化父级锚点组件
    this.$nextTick(() => {
      this.anchorCom.init()
    })
  },
  methods: {
    /**
     * 跳转到锚点
     * 处理锚点点击事件，更新URL并滚动到目标位置
     */
    goAnchor () {
      // 设置当前链接
      this.currentLink = this.href
      // 处理哈希变化
      this.anchorCom.handleHashChange()
      // 滚动到目标位置
      this.anchorCom.handleScrollTo()
      // 触发选择事件
      this.anchorCom.$emit('on-select', this.href)
      
      // 检查是否有路由实例
      const isRoute = this.$router
      if (isRoute) {
        // 使用Vue Router跳转
        this.$router.push(this.href, () => {})
      } else {
        // 直接修改浏览器地址
        window.location.href = this.href
      }
    }
  }
}
</script>
