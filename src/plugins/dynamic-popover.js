/**
 * 动态弹出框插件模块
 * 提供全局弹出框组件的动态创建和管理功能
 */

import { createApp, h } from 'vue'
import mountWithContext from '../utils/mount-with-context'

import Popper from 'popper.js/dist/umd/popper.js'
import Popover from '../components/popover'

/**
 * 移除当前弹出框
 * 清理当前显示的弹出框实例
 */
function removeCurrentPopover () {
  if (DynamicPopover.currentPopover) {
    DynamicPopover.currentPopover.remove()
    DynamicPopover.currentPopover.popper.remove()
    DynamicPopover.currentPopover = null
  }
}

// 监听全局点击事件，实现点击外部关闭弹出框
document.addEventListener('click', (e) => {
  if (DynamicPopover.currentPopover &&
    !DynamicPopover.currentPopover.popper.contains(event.target) &&
    !DynamicPopover.currentPopover.reference.contains(event.target)) {
    removeCurrentPopover()
  }
})

const DynamicPopover = {
  // 当前弹出框实例
  currentPopover: null,
  
  /**
   * 显示弹出框
   * 在指定元素附近显示弹出框
   * @param {Element} el - 参考元素
   * @param {Object} component - 要显示的组件
   * @param {Object} props - 组件属性
   * @param {Object} opts - 弹出框选项配置
   */
  show (el, component, props, opts = {}) {
    removeCurrentPopover()

    const instance = createApp({
      render () {
        return h(Popover, {
          bodyStyle: 'padding: 0'
        }, () => [
          h(component, props)
        ])
      }
    })

    const node = mountWithContext(instance, this.app)

    // 创建Popper实例
    this.currentPopover = new Popper(el, node, {
      placement: opts.placement || 'bottom',
      modifiers: {
        computeStyle:{
          gpuAcceleration: false,
        },
        preventOverflow :{
          boundariesElement: 'window'
        }
      }
    })

    // 重写remove方法，添加自定义回调
    this.currentPopover.remove = () => {
      if (opts.onRemove) {
        opts.onRemove()
      }

      this.currentPopover.destroy()
    }
  },
  /**
   * 移除弹出框
   * 关闭当前显示的弹出框
   */
  remove () {
    removeCurrentPopover()
  },
  
  /**
   * 安装插件
   * 将弹出框插件安装到Vue应用中，并监听路由变化
   * @param {Object} app - Vue应用实例
   * @param {*} _ - 未使用的参数
   */
  install (app, _) {
    this.app = app

    // 注册全局属性
    app.config.globalProperties.$Popover = this

    // 监听路由变化，自动关闭弹出框
    if (app.config.globalProperties.$router) {
      app.config.globalProperties.$router.afterEach(() => {
        this.remove()
      })
    }
  }
}

export default DynamicPopover
