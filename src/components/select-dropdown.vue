<template>
  <!-- 选择器下拉容器 -->
  <div
    class="ivu-select-dropdown"
    :class="className"
    :style="styles"
  >
    <slot />
  </div>
</template>
<script>
import { getStyle } from '../utils/assist';  // eslint-disable-line
import { transferIndex, transferIncrease } from '../utils/transfer-queue'
import Emitter from '../mixins/emitter'

const isServer = false
const Popper = isServer ? function () {} : require('popper.js/dist/umd/popper.js')

/**
 * 选择器下拉组件
 * 用于显示选择器的下拉选项列表
 */
export default {
  name: 'SelectDropdown',
  mixins: [Emitter],
  props: {
    // 显示位置
    placement: {
      type: String,
      default: 'bottom-start'
    },
    // 自定义类名
    className: {
      type: String
    },
    // 是否转移到body
    transfer: {
      type: Boolean
    }
  },
  data () {
    return {
      // Popper实例
      popper: null,
      // 宽度
      width: '',
      // Popper状态
      popperStatus: false,
      // 转移索引
      tIndex: this.handleGetIndex()
    }
  },
  computed: {
    // 样式
    styles () {
      const style = {}
      if (this.width) style.minWidth = `${this.width}px`
      if (this.width) style.maxWidth = `${this.width}px`

      if (this.transfer) style['z-index'] = 1060 + this.tIndex

      return style
    }
  },
  created () {
    // 监听更新Popper事件
    this.mitt.on('on-update-popper', this.update)
    // 监听销毁Popper事件
    this.mitt.on('on-destroy-popper', this.destroy)
  },
  beforeUnmount () {
    // 移除事件监听
    this.mitt.off('on-update-popper', this.update)
    this.mitt.off('on-destroy-popper', this.destroy)

    // 销毁Popper实例
    if (this.popper) {
      this.popper.destroy()
      this.popper = null
    }
  },
  methods: {
    // 更新Popper
    update () {
      if (isServer) return
      this.$nextTick(() => {
        if (this.popper) {
          this.popper.update()
          this.popperStatus = true
        } else {
          this.popper = new Popper(this.$parent.$parent.$refs.reference, this.$el, {
            eventsEnabled: false,
            placement: this.placement,
            modifiers: {
              computeStyle: {
                gpuAcceleration: false
              },
              preventOverflow: {
                boundariesElement: 'window'
              }
            },
            onCreate: () => {
              this.resetTransformOrigin()
              this.$nextTick(this.popper.update())
            },
            onUpdate: () => {
              this.resetTransformOrigin()
            }
          })
        }
        // 当父组件是Modal且Select宽度为100%时设置高度
        if (this.$parent.$options.name === 'VSelect') {
          this.width = parseInt(getStyle(this.$parent.$el, 'width'))
        } else if (this.$parent.$parent.$options.name === 'VSelect') {
          this.width = parseInt(getStyle(this.$parent.$parent.$el, 'width'))
        }
        this.tIndex = this.handleGetIndex()
      })
    },
    // 销毁Popper
    destroy () {
      if (this.popper) {
        setTimeout(() => {
          if (this.popper && !this.popperStatus) {
            this.popper.destroy()
            this.popper = null
          }
          this.popperStatus = false
        }, 300)
      }
    },
    // 重置变换原点
    resetTransformOrigin () {
      // 不判断，Select 会报错，不知道为什么
      if (!this.popper) return

      const x_placement = this.popper.popper.getAttribute('x-placement')
      const placementStart = x_placement.split('-')[0]
      const placementEnd = x_placement.split('-')[1]
      const leftOrRight = x_placement === 'left' || x_placement === 'right'
      if (!leftOrRight) {
        this.popper.popper.style.transformOrigin = placementStart === 'bottom' || (placementStart !== 'top' && placementEnd === 'start') ? 'center top' : 'center bottom'
      }
    },
    // 获取转移索引
    handleGetIndex () {
      transferIncrease()
      return transferIndex
    }
  }
}
</script>
