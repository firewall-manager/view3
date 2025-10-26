<template>
  <!-- 锚点组件包装器，支持固钉功能 -->
  <component
    :is="wrapperComponent"
    :offset-top="offsetTop"
    :offset-bottom="offsetBottom"
    @on-change="handleAffixStateChange"
  >
    <div
      :class="`${prefix}-wrapper`"
      :style="wrapperStyle"
    >
      <div :class="`${prefix}`">
        <!-- 墨水条指示器 -->
        <div :class="`${prefix}-ink`">
          <span
            v-show="showInk"
            :class="`${prefix}-ink-ball`"
            :style="{top: `${inkTop}px`}"
          />
        </div>
        <!-- 锚点链接插槽 -->
        <slot />
      </div>
    </div>
  </component>
</template>
<script>
import { scrollTop, findComponentsDownward, sharpMatcherRegx } from '../../utils/assist'
import { on, off } from '../../utils/dom'

/**
 * 锚点组件
 * 提供页面内导航功能，支持固钉和墨水条指示器
 */
export default {
  name: 'Anchor',
  // 向子组件提供锚点实例
  provide () {
    return {
      anchorCom: this
    }
  },
  props: {
    // 是否启用固钉功能
    affix: {
      type: Boolean,
      default: true
    },
    // 距离顶部的偏移量
    offsetTop: {
      type: Number,
      default: 0
    },
    // 距离底部的偏移量
    offsetBottom: Number,
    // 滚动边界值
    bounds: {
      type: Number,
      default: 5
    },
    // 滚动容器，HTMLElement 在 SSR 下不支持
    container: null,
    // 是否显示墨水条指示器
    showInk: {
      type: Boolean,
      default: false
    },
    // 滚动偏移量
    scrollOffset: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // CSS类名前缀
      prefix: 'ivu-anchor',
      // 当前固钉状态
      isAffixed: false,
      // 墨水条顶部位置
      inkTop: 0,
      // 是否正在滚动动画中
      animating: false,
      // 当前显示的链接
      currentLink: '',
      // 当前显示的标题ID
      currentId: '',
      // 滚动容器
      scrollContainer: null,
      // 滚动元素
      scrollElement: null,
      // 标题偏移量数组
      titlesOffsetArr: [],
      // 包装器顶部位置
      wrapperTop: 0,
      // 是否在第一个标题之上
      upperFirstTitle: true
    }
  },
  computed: {
    // 包装器组件：根据是否启用固钉选择组件
    wrapperComponent () {
      return this.affix ? 'Affix' : 'div'
    },
    // 包装器样式：设置最大高度
    wrapperStyle () {
      return {
        maxHeight: this.offsetTop ? `calc(100vh - ${this.offsetTop}px)` : '100vh'
      }
    },
    // 容器是否为窗口
    containerIsWindow () {
      return this.scrollContainer === window
    }
  },
  watch: {
    // 监听路由变化
    '$route' () {
      this.handleHashChange()
      this.$nextTick(() => {
        this.handleScrollTo()
      })
    },
    // 监听容器变化
    container () {
      this.init()
    },
    // 监听当前链接变化
    currentLink (newHref, oldHref) {
      this.$emit('on-change', newHref, oldHref)
    }
  },
  mounted () {
    // 组件挂载后初始化
    this.init()
  },
  methods: {
    /**
     * 处理固钉状态变化
     * @param {Boolean} state - 固钉状态
     */
    handleAffixStateChange (state) {
      this.isAffixed = this.affix && state
    },
    /**
     * 处理滚动事件
     * @param {Event} e - 滚动事件
     */
    handleScroll (e) {
      this.upperFirstTitle = e.target.scrollTop < this.titlesOffsetArr[0].offset
      if (this.animating) return
      this.updateTitleOffset()
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || e.target.scrollTop
      this.getCurrentScrollAtTitleId(scrollTop)
    },
    /**
     * 处理哈希变化
     * 从URL中提取锚点信息
     */
    handleHashChange () {
      const url = window.location.href
      const sharpLinkMatch = sharpMatcherRegx.exec(url)
      if (!sharpLinkMatch) return
      this.currentLink = sharpLinkMatch[0]
      this.currentId = sharpLinkMatch[1]
    },
    /**
     * 滚动到指定锚点
     * 平滑滚动到目标位置并设置墨水条位置
     */
    handleScrollTo () {
      const anchor = document.getElementById(this.currentId)
      const currentLinkElementA = document.querySelector(`a[data-href="${this.currentLink}"]`)
      let offset = this.scrollOffset
      if (currentLinkElementA) {
        offset = parseFloat(currentLinkElementA.getAttribute('data-scroll-offset'))
      }

      if (!anchor) return
      const offsetTop = anchor.offsetTop - this.wrapperTop - offset
      this.animating = true
      scrollTop(this.scrollContainer, this.scrollElement.scrollTop, offsetTop, 600, () => {
        this.animating = false
      })
      this.handleSetInkTop()
    },
    /**
     * 设置墨水条位置
     * 根据当前激活的链接设置墨水条顶部位置
     */
    handleSetInkTop () {
      const currentLinkElementA = document.querySelector(`a[data-href="${this.currentLink}"]`)
      if (!currentLinkElementA) return
      const elementATop = currentLinkElementA.offsetTop
      const top = (elementATop < 0 ? this.offsetTop : elementATop)
      this.inkTop = top
    },
    /**
     * 更新标题偏移量
     * 计算所有锚点标题相对于滚动容器的偏移位置
     */
    updateTitleOffset () {
      const links = findComponentsDownward(this, 'AnchorLink').map(link => {
        return link.href
      })
      const idArr = links.map(link => {
        return link.split('#')[1]
      })
      const offsetArr = []
      idArr.forEach(id => {
        const titleEle = document.getElementById(id)
        if (titleEle) {
          offsetArr.push({
            link: `#${id}`,
            offset: titleEle.offsetTop - this.scrollElement.offsetTop
          })
        }
      })
      this.titlesOffsetArr = offsetArr
    },
    /**
     * 根据滚动位置获取当前标题ID
     * @param {Number} scrollTop - 当前滚动位置
     */
    getCurrentScrollAtTitleId (scrollTop) {
      let i = -1
      const len = this.titlesOffsetArr.length
      let titleItem = {
        link: '#',
        offset: 0
      }
      scrollTop += this.bounds
      while (++i < len) {
        const currentEle = this.titlesOffsetArr[i]
        const nextEle = this.titlesOffsetArr[i + 1]
        if (scrollTop >= currentEle.offset && scrollTop < ((nextEle && nextEle.offset) || Infinity)) {
          titleItem = this.titlesOffsetArr[i]
          break
        }
      }
      this.currentLink = titleItem.link
      this.handleSetInkTop()
    },
    /**
     * 获取滚动容器
     * 设置滚动容器和滚动元素
     */
    getContainer () {
      this.scrollContainer = this.container ? (typeof this.container === 'string' ? document.querySelector(this.container) : this.container) : window
      this.scrollElement = this.container ? this.scrollContainer : (document.documentElement || document.body)
    },
    /**
     * 移除事件监听器
     * 清理滚动和哈希变化事件监听
     */
    removeListener () {
      off(this.scrollContainer, 'scroll', this.handleScroll)
      off(window, 'hashchange', this.handleHashChange)
    },
    /**
     * 初始化锚点组件
     * 设置容器、事件监听和初始状态
     */
    init () {
      this.handleHashChange()
      this.$nextTick(() => {
        this.removeListener()
        this.getContainer()
        this.wrapperTop = this.containerIsWindow ? 0 : this.scrollElement.offsetTop
        this.handleScrollTo()
        this.handleSetInkTop()
        this.updateTitleOffset()
        if (this.titlesOffsetArr[0]) {
          this.upperFirstTitle = this.scrollElement.scrollTop < this.titlesOffsetArr[0].offset
        }
        on(this.scrollContainer, 'scroll', this.handleScroll)
        on(window, 'hashchange', this.handleHashChange)
      })
    }
  },
  beforeUnmont () {
    // 组件销毁前移除事件监听
    this.removeListener()
  }
}
</script>
