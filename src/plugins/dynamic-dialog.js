/**
 * 动态对话框插件模块
 * 提供全局对话框组件的动态创建和管理功能
 */

import newInstance from './create-dialog'

let dialogInstance

export default {
  /**
   * 获取对话框实例
   * 创建或返回现有的对话框实例
   * @param {Function} render - 自定义渲染函数
   * @param {boolean} lockScroll - 是否锁定滚动，默认为true
   * @returns {Object} 对话框实例
   */
  getInstance (render = undefined, lockScroll = true) {
    this.dialogInstance = this.dialogInstance || newInstance({
      closable: false,      // 不可关闭
      maskClosable: false,  // 遮罩不可点击关闭
      footerHide: true,     // 隐藏默认底部
      render: render,       // 自定义渲染函数
      lockScroll           // 锁定滚动
    })

    return this.dialogInstance
  },
  /**
   * 显示对话框
   * 根据传入的选项显示对话框
   * @param {Object} options - 对话框选项配置
   */
  show (options) {
    const render = ('render' in options) ? options.render : undefined
    const lockScroll = ('lockScroll' in options) ? options.lockScroll : true
    const instance = this.getInstance(render, lockScroll)

    // 设置移除回调，清理实例引用
    options.onRemove = () => {
      this.dialogInstance = null
    }

    instance.show(options)
  },
  
  /**
   * 显示信息对话框
   * @param {Object} props - 对话框属性配置
   * @returns {Object} 对话框实例
   */
  info (props = {}) {
    if (typeof props === 'object') {
      props.icon = 'info'
      props.showCancel = false
    }

    return this.show(props)
  },

  /**
   * 显示成功对话框
   * @param {Object} props - 对话框属性配置
   * @returns {Object} 对话框实例
   */
  success (props = {}) {
    props.icon = 'success'
    props.showCancel = false
    return this.show(props)
  },

  /**
   * 显示警告对话框
   * @param {Object} props - 对话框属性配置
   * @returns {Object} 对话框实例
   */
  warning (props = {}) {
    props.icon = 'warning'
    props.showCancel = false
    return this.show(props)
  },
  
  /**
   * 显示错误对话框
   * @param {Object} props - 对话框属性配置
   * @returns {Object} 对话框实例
   */
  error (props = {}) {
    props.icon = 'error'
    props.showCancel = false
    return this.show(props)
  },
  
  /**
   * 显示确认对话框
   * @param {Object} props - 对话框属性配置
   * @returns {Object} 对话框实例
   */
  confirm (props = {}) {
    props.icon = 'confirm'
    props.showCancel = true
    return this.show(props)
  },
  /**
   * 移除对话框
   * 关闭当前显示的对话框
   * @returns {boolean} 是否成功移除
   */
  remove () {
    if (!dialogInstance) { 
      // 加载状态时，在取消后移除
      return false
    }

    const instance = getModalInstance()

    instance.remove()
  },
  
  /**
   * 安装插件
   * 将对话框插件安装到Vue应用中
   * @param {Object} app - Vue应用实例
   * @param {*} _ - 未使用的参数
   */
  install (app, _) {
    app.config.globalProperties.$Dialog = this
  }
}
