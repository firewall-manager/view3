<template>
  <!-- 滚动容器包装器 -->
  <div
    :class="wrapClasses"
    style="touch-action: none;"
  >
    <!-- 滚动容器 -->
    <div
      ref="scrollContainer"
      :class="scrollContainerClasses"
      :style="{height: height + 'px'}"
      @scroll="handleScroll"
      @wheel="onWheel"
      @touchstart="onPointerDown"
    >
      <!-- 顶部加载器 -->
      <div
        ref="toploader"
        :class="loaderClasses"
        :style="{paddingTop: wrapperPadding.paddingTop}"
      >
        <loader
          :text="localeLoadingText"
          :active="showTopLoader"
        />
      </div>
      <!-- 滚动内容区域 -->
      <div
        ref="scrollContent"
        :class="slotContainerClasses"
      >
        <slot />
      </div>
      <!-- 底部加载器 -->
      <div
        ref="bottomLoader"
        :class="loaderClasses"
        :style="{paddingBottom: wrapperPadding.paddingBottom}"
      >
        <loader
          :text="localeLoadingText"
          :active="showBottomLoader"
        />
      </div>
    </div>
  </div>
</template>
<script>
import throttle from 'lodash.throttle'
import loader from './loading-component.vue'
import { on, off } from '../../utils/dom'
import Locale from '../../mixins/locale'

const prefixCls = 'ivu-scroll'
const dragConfig = {
  sensitivity: 10,
  minimumStartDragOffset: 5 // minimum start drag offset
}

const noop = () => Promise.resolve()

/**
 * 滚动组件
 * 支持上拉下拉刷新的滚动容器组件
 */
export default {
  name: 'Scroll',
  components: { loader },
  mixins: [Locale],
  props: {
    // 滚动容器高度
    height: {
      type: [Number, String],
      default: 300
    },
    // 到达顶部回调
    onReachTop: {
      type: Function
    },
    // 到达底部回调
    onReachBottom: {
      type: Function
    },
    // 到达边缘回调
    onReachEdge: {
      type: Function
    },
    // 加载文本
    loadingText: {
      type: String
    },
    // 距离边缘的阈值
    distanceToEdge: [Number, Array],
    // 是否停止滑动
    stopSlide: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const distanceToEdge = this.calculateProximityThreshold()
    return {
      // 显示顶部加载器
      showTopLoader: false,
      // 显示底部加载器
      showBottomLoader: false,
      // 显示主体加载器
      showBodyLoader: false,
      // 上次滚动位置
      lastScroll: 0,
      // 到达顶部滚动限制
      reachedTopScrollLimit: true,
      // 到达底部滚动限制
      reachedBottomScrollLimit: false,
      // 顶部橡皮筋内边距
      topRubberPadding: 0,
      // 底部橡皮筋内边距
      bottomRubberPadding: 0,
      // 橡皮筋回弹超时
      rubberRollBackTimeout: false,
      // 是否正在加载
      isLoading: false,
      // 触摸按下位置
      pointerTouchDown: null,
      // 触摸滚动状态
      touchScroll: false,
      // 滚动处理函数
      handleScroll: () => {},
      // 指针抬起处理函数
      pointerUpHandler: () => {},
      // 指针移动处理函数
      pointerMoveHandler: () => {},

      // 接近边缘检测器
      topProximityThreshold: distanceToEdge[0],
      bottomProximityThreshold: distanceToEdge[1]
    }
  },
  computed: {
    // 包装器CSS类名
    wrapClasses () {
      return `${prefixCls}-wrapper`
    },
    // 滚动容器CSS类名
    scrollContainerClasses () {
      return [
                    `${prefixCls}-container`,
                    {
                      [`${prefixCls}-container-loading`]: this.showBodyLoader && this.stopSlide
                    }
      ]
    },
    // 插槽容器CSS类名
    slotContainerClasses () {
      return [
                    `${prefixCls}-content`,
                    {
                      [`${prefixCls}-content-loading`]: this.showBodyLoader
                    }
      ]
    },
    // 加载器CSS类名
    loaderClasses () {
      return `${prefixCls}-loader`
    },
    // 包装器内边距
    wrapperPadding () {
      return {
        paddingTop: this.topRubberPadding + 'px',
        paddingBottom: this.bottomRubberPadding + 'px'
      }
    },
    // 本地化加载文本
    localeLoadingText () {
      if (this.loadingText === undefined) {
        return this.t('i.select.loading')
      } else {
        return this.loadingText
      }
    }
  },
  created () {
    this.handleScroll = throttle(this.onScroll, 150, { leading: false })
    this.pointerUpHandler = this.onPointerUp.bind(this) // because we need the same function to add and remove event handlers
    this.pointerMoveHandler = throttle(this.onPointerMove, 50, { leading: false })
  },
  methods: {
    // 等待一秒（改善加载感觉，避免浏览器滚动尾随事件）
    waitOneSecond () {
      return new Promise(resolve => {
        setTimeout(resolve, 1000)
      })
    },

    // 计算接近阈值
    calculateProximityThreshold () {
      const dte = this.distanceToEdge
      if (typeof dte === 'undefined') return [20, 20]
      return Array.isArray(dte) ? dte : [dte, dte]
    },

    onCallback (dir) {
      this.isLoading = true
      this.showBodyLoader = true
      if (dir > 0) {
        this.showTopLoader = true
        this.topRubberPadding = 20
      } else {
        this.showBottomLoader = true
        this.bottomRubberPadding = 20

        // to force the scroll to the bottom while height is animating
        let bottomLoaderHeight = 0
        const container = this.$refs.scrollContainer
        const initialScrollTop = container.scrollTop
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            bottomLoaderHeight = Math.max(
              bottomLoaderHeight,
              this.$refs.bottomLoader.getBoundingClientRect().height
            )
            container.scrollTop = initialScrollTop + bottomLoaderHeight
          }, i * 50)
        }
      }

      const callbacks = [this.waitOneSecond(), this.onReachEdge ? this.onReachEdge(dir) : noop()]
      callbacks.push(dir > 0 ? this.onReachTop ? this.onReachTop() : noop() : this.onReachBottom ? this.onReachBottom() : noop())

      const tooSlow = setTimeout(() => {
        this.reset()
      }, 5000)

      Promise.all(callbacks).then(() => {
        clearTimeout(tooSlow)
        this.reset()
      })
    },

    reset () {
      [
        'showTopLoader',
        'showBottomLoader',
        'showBodyLoader',
        'isLoading',
        'reachedTopScrollLimit',
        'reachedBottomScrollLimit'
      ].forEach(prop => (this[prop] = false))

      this.lastScroll = 0
      this.topRubberPadding = 0
      this.bottomRubberPadding = 0
      clearInterval(this.rubberRollBackTimeout)

      // if we remove the handler too soon the screen will bump
      if (this.touchScroll) {
        setTimeout(() => {
          off(window, 'touchend', this.pointerUpHandler)
          this.$refs.scrollContainer.removeEventListener('touchmove', this.pointerMoveHandler)
          this.touchScroll = false
        }, 500)
      }
    },

    onWheel (event) {
      if (this.isLoading) return

      // get the wheel direction
      const wheelDelta = event.wheelDelta ? event.wheelDelta : -(event.detail || event.deltaY)
      this.stretchEdge(wheelDelta)
    },

    stretchEdge (direction) {
      clearTimeout(this.rubberRollBackTimeout)

      // check if set these props
      if (!this.onReachEdge) {
        if (direction > 0) {
          if (!this.onReachTop) return
        } else {
          if (!this.onReachBottom) return
        }
      }

      // if the scroll is not strong enough, lets reset it
      this.rubberRollBackTimeout = setTimeout(() => {
        if (!this.isLoading) this.reset()
      }, 250)

      // to give the feeling its ruberish and can be puled more to start loading
      if (direction > 0 && this.reachedTopScrollLimit) {
        this.topRubberPadding += 5 - this.topRubberPadding / 5
        if (this.topRubberPadding > this.topProximityThreshold) this.onCallback(1)
      } else if (direction < 0 && this.reachedBottomScrollLimit) {
        this.bottomRubberPadding += 6 - this.bottomRubberPadding / 4
        if (this.bottomRubberPadding > this.bottomProximityThreshold) this.onCallback(-1)
      } else {
        this.onScroll()
      }
    },

    onScroll () {
      const el = this.$refs.scrollContainer
      if (this.isLoading || !el) return
      const scrollDirection = Math.sign(this.lastScroll - el.scrollTop) // IE has no Math.sign, check that webpack polyfills this
      const displacement = el.scrollHeight - el.clientHeight - el.scrollTop

      const topNegativeProximity = this.topProximityThreshold < 0 ? this.topProximityThreshold : 0
      const bottomNegativeProximity = this.bottomProximityThreshold < 0 ? this.bottomProximityThreshold : 0
      if (scrollDirection == -1 && displacement + bottomNegativeProximity <= dragConfig.sensitivity) {
        this.reachedBottomScrollLimit = true
      } else if (scrollDirection >= 0 && el.scrollTop + topNegativeProximity <= 0) {
        this.reachedTopScrollLimit = true
      } else {
        this.reachedTopScrollLimit = false
        this.reachedBottomScrollLimit = false
        this.lastScroll = el.scrollTop
      }
    },

    getTouchCoordinates (e) {
      return {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      }
    },

    onPointerDown (e) {
      // we just use scroll and wheel in desktop, no mousedown
      if (this.isLoading) return
      if (e.type == 'touchstart') {
        // if we start do touchmove on the scroll edger the browser will scroll the body
        // by adding 5px margin on pointer down we avoid this behaviour and the scroll/touchmove
        // in the component will not be exported outside of the component
        const container = this.$refs.scrollContainer
        if (this.reachedTopScrollLimit) container.scrollTop = 5
        else if (this.reachedBottomScrollLimit) container.scrollTop -= 5
      }
      if (e.type == 'touchstart' && this.$refs.scrollContainer.scrollTop == 0) { this.$refs.scrollContainer.scrollTop = 5 }

      this.pointerTouchDown = this.getTouchCoordinates(e)
      on(window, 'touchend', this.pointerUpHandler)
      this.$refs.scrollContainer.parentElement.addEventListener('touchmove', e => {
        e.stopPropagation()
        this.pointerMoveHandler(e)
      }, { passive: false, useCapture: true })
    },

    onPointerMove (e) {
      if (!this.pointerTouchDown) return
      if (this.isLoading) return

      const pointerPosition = this.getTouchCoordinates(e)
      const yDiff = pointerPosition.y - this.pointerTouchDown.y

      this.stretchEdge(yDiff)

      if (!this.touchScroll) {
        const wasDragged = Math.abs(yDiff) > dragConfig.minimumStartDragOffset
        if (wasDragged) this.touchScroll = true
      }
    },

    onPointerUp () {
      this.pointerTouchDown = null
    }
  }
}

</script>
