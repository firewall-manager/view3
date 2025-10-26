/**
 * 动态模态框插件模块
 * 提供全局模态框组件的动态创建和管理功能
 */

import createInstance from './create-modal'
import ModalComponent from '../components/modal'

// 默认模态框选项配置
const defaultOptions = {
  width: 620,        // 默认宽度
  closable: false,   // 默认不可关闭
  footerHide: true   // 默认隐藏底部
}

/**
 * 动态模态框类
 * 管理模态框的创建、显示和销毁
 */
class DynamicModalClass {
  /**
   * 打开模态框
   * 创建并显示指定组件的模态框
   * @param {Object} component - 要显示的组件
   * @param {Object} props - 组件属性
   * @param {Object} opts - 模态框选项配置
   */
  open (component, props, opts) {
    const options = { ...defaultOptions, ...opts }
    const instance = this.getModalInstance(component, props, options)

    instance.show(options)
  }

  /**
   * 移除模态框
   * 关闭并清理模态框实例
   */
  remove () {
    if (this.modalInstance) {
      const instance = this.getModalInstance()

      instance.remove()

      this.modalInstance = null
    }
  }

  /**
   * 获取模态框实例
   * 创建或返回现有的模态框实例
   * @param {Object} component - 要显示的组件
   * @param {Object} props - 组件属性
   * @param {Object} options - 模态框选项配置
   * @returns {Object} 模态框实例
   */
  getModalInstance (component, props, options) {
    this.modalInstance = this.modalInstance || createInstance(
      this.app,
      ModalComponent,
      options,
      (h) => h(component, { ...props }),
      () => {
        if (options.onClose) options.onClose()
        this.modalInstance = null
      }
    )

    return this.modalInstance
  }

  /**
   * 安装插件
   * 将模态框插件安装到Vue应用中，并监听路由变化
   * @param {Object} app - Vue应用实例
   * @param {*} _ - 未使用的参数
   */
  install (app, _) {
    this.app = app

    // 注册全局属性
    app.config.globalProperties.$Modal = this

    // 监听路由变化，自动关闭模态框
    if (app.config.globalProperties.$router) {
      app.config.globalProperties.$router.afterEach(() => {
        this.remove()
      })
    }
  }
}

// 导出单例实例
export default new DynamicModalClass()
// 导出类定义
export { DynamicModalClass }
