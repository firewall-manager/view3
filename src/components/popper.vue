<script>
const isServer = false
const Popper = isServer ? function() {} : require('popper.js/dist/umd/popper.js');  // eslint-disable-line

/**
 * Popper组件
 * 基于popper.js的弹出定位组件
 */
export default {
  props: {
    // 是否启用事件
    eventsEnabled: {
      type: Boolean,
      default: false
    },
    // 弹出位置
    placement: {
      type: String,
      default: 'bottom'
    },
    // 边界内边距
    boundariesPadding: {
      type: Number,
      default: 5
    },
    // 参考元素
    reference: Object,
    // 弹出元素
    popper: Object,
    // 偏移量
    offset: {
      default: 0
    },
    // 是否显示
    modelValue: {
      type: Boolean,
      default: false
    },
    // 过渡动画
    transition: String,
    // Popper选项
    options: {
      type: Object,
      default () {
        return {
          modifiers: {
            computeStyle: {
              gpuAcceleration: false
            },
            preventOverflow: {
              boundariesElement: 'window'
            }
          }
        }
      }
    }
  },
  emits: ['on-popper-show', 'on-popper-hide', 'created'],
  data () {
    return {
      visible: this.modelValue
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler (val) {
        this.visible = val
        this.$emit('update:modelValue', val)
      }
    },
    visible (val) {
      if (val) {
        if (this.handleIndexIncrease) this.handleIndexIncrease() // just use for Poptip
        this.updatePopper()
        this.$emit('on-popper-show')
      } else {
        this.$emit('on-popper-hide')
      }
      this.$emit('update:modelValue', val)
    }
  },
  updated () {
    this.$nextTick(() => this.updatePopper())
  },
  beforeUnmount () {
    if (isServer) return
    if (this.popperJS) {
      this.popperJS.destroy()
    }
  },
  methods: {
    createPopper () {
      if (isServer) return
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.placement)) {
        return
      }

      const options = this.options
      const popper = this.popper || this.$refs.popper
      const reference = this.reference || this.$refs.reference

      if (!popper || !reference) return

      if (this.popperJS && this.popperJS.hasOwnProperty('destroy')) {
        this.popperJS.destroy()
      }

      options.eventsEnabled = this.eventsEnabled

      options.placement = this.placement

      if (!options.modifiers.offset) {
        options.modifiers.offset = {}
      }
      options.modifiers.offset.offset = this.offset
      options.onCreate = () => {
        this.$nextTick(this.updatePopper)
        this.$emit('created', this)
      }

      this.popperJS = new Popper(reference, popper, options)
    },
    updatePopper () {
      if (isServer) return
      this.popperJS ? this.popperJS.update() : this.createPopper()
    },
    doDestroy () {
      if (isServer) return
      if (this.visible) return
      this.popperJS.destroy()
      this.popperJS = null
    }
  }
}
</script>
