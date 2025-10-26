/**
 * 动态抽屉插件模块
 * 提供全局抽屉组件的动态创建和管理功能
 */

import createInstance from './create-modal'
import DrawerComponent from '../components/drawer'

// 默认抽屉选项配置
const defaultOptions = {
  width: 720,        // 默认宽度
  closable: false    // 默认不可关闭
}

export default {
  /**
   * 打开抽屉
   * 创建并显示指定组件的抽屉
   * @param {Object} component - 要显示的组件
   * @param {Object} props - 组件属性
   * @param {Object} opts - 抽屉选项配置
   */
  open (component, props, opts) {
    const options = { ...defaultOptions, ...opts }
    const instance = this.getDrawerInstance(component, props, options)

    instance.show(options)
  },

  /**
   * 获取抽屉组件实例
   * @returns {Object|null} 抽屉组件实例
   */
  get component () {
    return this.drawerInstance && this.drawerInstance.component
  },

  /**
   * 移除抽屉
   * 关闭并清理抽屉实例
   */
  remove () {
    if (this.drawerInstance) {
      const instance = this.getDrawerInstance()

      instance.remove()

      this.drawerInstance = null
    }
  },

  /**
   * 获取抽屉实例
   * 创建或返回现有的抽屉实例
   * @param {Object} component - 要显示的组件
   * @param {Object} props - 组件属性
   * @param {Object} options - 抽屉选项配置
   * @returns {Object} 抽屉实例
   */
  getDrawerInstance (component, props, options) {
    this.drawerInstance = this.drawerInstance || createInstance(
      this.app,
      DrawerComponent,
      options,
      (h) => h(component, { ...props }),
      () => {
        if (options.onClose) options.onClose()
        this.drawerInstance = null
      }
    )

    return this.drawerInstance
  },

  /**
   * 安装插件
   * 将抽屉插件安装到Vue应用中，并监听路由变化
   * @param {Object} app - Vue应用实例
   * @param {*} _ - 未使用的参数
   */
  install (app, _) {
    this.app = app

    // 注册全局属性
    app.config.globalProperties.$Drawer = this

    // 监听路由变化，自动关闭抽屉
    if (app.config.globalProperties.$router) {
      app.config.globalProperties.$router.afterEach(() => {
        this.remove()
      })
    }
  }
}
