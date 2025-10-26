/**
 * 链接混入模块
 * 提供路由链接和外部链接的处理功能
 */

import { oneOf } from '../utils/assist'

export default {
  props: {
    // 链接目标，可以是路由对象或URL字符串
    to: {
      type: [Object, String]
    },
    // 是否替换当前历史记录
    replace: {
      type: Boolean,
      default: false
    },
    // 链接打开方式
    target: {
      type: String,
      validator (value) {
        return oneOf(value, ['_blank', '_self', '_parent', '_top'])
      },
      default: '_self'
    },
    // 是否追加到当前路径
    append: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    /**
     * 计算链接URL
     * 根据to属性类型和路由配置生成最终的链接地址
     * @returns {string} 计算后的链接URL
     */
    linkUrl () {
      const type = typeof this.to

      // 如果是绝对URL（包含//），直接返回
      if (typeof this.to === 'string' && this.to.includes('//')) {
        return this.to
      }
      
      const router = this.$router
      if (router) {
        const current = this.$route
        const route = router.resolve(this.to, current, this.append)

        // 如果路由有名称，返回href，否则返回原始to值
        return route.name ? route.href : this.to
      }
      return this.to
    }
  },
  methods: {
    /**
     * 处理链接点击事件
     * 根据配置决定是打开新窗口还是当前窗口跳转
     * @param {boolean} newWindow - 是否在新窗口打开，默认为false
     */
    handleClick (newWindow = false) {
      const router = this.$router

      if (newWindow) {
        // 在新窗口打开
        let to = this.to
        if (router) {
          const current = this.$route
          const route = router.resolve(this.to, current, this.append)
          to = route.name ? route.href : this.to
        }
        window.open(to)
      } else {
        // 在当前窗口跳转
        if (router) {
          if ((typeof this.to === 'string') && !router.resolve(this.to, this.$route, this.append).name) {
            // 如果是字符串且没有对应的路由，使用location.href跳转
            window.location.href = this.to
          } else {
            // 使用路由跳转
            this.replace ? this.$router.replace(this.to, () => {}) : this.$router.push(this.to, () => {})
          }
        } else {
          // 没有路由实例，使用location.href跳转
          window.location.href = this.to
        }
      }
    },
    
    /**
     * 处理点击检查事件
     * 根据target属性决定是否阻止默认行为并执行跳转
     * @param {Event} event - 点击事件
     * @param {boolean} newWindow - 是否在新窗口打开，默认为false
     * @returns {boolean} 是否阻止默认行为
     */
    handleCheckClick (event, newWindow = false) {
      if (this.to) {
        if (this.target === '_blank') {
          // 如果是_blank，不阻止默认行为，让浏览器处理
          return false
        } else {
          // 阻止默认行为，使用自定义跳转逻辑
          event.preventDefault()
          this.handleClick(newWindow)
        }
      }
    }
  }
}
