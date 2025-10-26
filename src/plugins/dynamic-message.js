/**
 * 动态消息通知插件模块
 * 提供全局消息通知组件的动态创建和管理功能
 */

import newInstance from './create-message'

// 消息样式前缀
const prefixCls = 'ivu-message'
// 图标样式前缀
const iconPrefixCls = 'ion'
// 消息键名前缀
const prefixKey = 'ivu_message_key_'

// 默认配置
const defaults = {
  top: 24,        // 默认顶部距离
  duration: 1.5   // 默认显示时长（秒）
}

// 消息名称计数器
let name = 1

// 图标类型映射
const iconTypes = {
  info: 'ios-information-circle',
  success: 'ios-checkmark-circle',
  warning: 'ios-alert',
  error: 'ios-close-circle',
  loading: 'ios-loading'
}

export default {
  /**
   * 显示信息消息
   * @param {Object|string} options - 消息选项或内容
   * @returns {Function} 关闭消息的函数
   */
  info (options) {
    return this.message('info', options)
  },
  
  /**
   * 显示成功消息
   * @param {Object|string} options - 消息选项或内容
   * @returns {Function} 关闭消息的函数
   */
  success (options) {
    return this.message('success', options)
  },
  
  /**
   * 显示警告消息
   * @param {Object|string} options - 消息选项或内容
   * @returns {Function} 关闭消息的函数
   */
  warning (options) {
    return this.message('warning', options)
  },
  
  /**
   * 显示错误消息
   * @param {Object|string} options - 消息选项或内容
   * @returns {Function} 关闭消息的函数
   */
  error (options) {
    return this.message('error', options)
  },
  
  /**
   * 显示加载消息
   * @param {Object|string} options - 消息选项或内容
   * @returns {Function} 关闭消息的函数
   */
  loading (options) {
    return this.message('loading', options)
  },
  
  /**
   * 显示指定类型的消息
   * @param {string} type - 消息类型
   * @param {Object|string} options - 消息选项或内容
   * @returns {Function} 关闭消息的函数
   */
  message (type, options) {
    if (typeof options === 'string') {
      options = {
        content: options
      }
    }
    return this.notice(options.content, options.duration, type, options.onClose, options.closable, options.render, options.background)
  },
  /**
   * 获取消息实例
   * 创建或返回现有的消息实例
   * @returns {Object} 消息实例
   */
  getMessageInstance () {
    this.messageInstance = this.messageInstance || newInstance({
      prefixCls: prefixCls,
      styles: {
        top: `${defaults.top}px`
      }
    })

    return this.messageInstance
  },
  
  /**
   * 显示通知消息
   * @param {string} content - 消息内容
   * @param {number} duration - 显示时长
   * @param {string} type - 消息类型
   * @param {Function} onClose - 关闭回调
   * @param {boolean} closable - 是否可关闭
   * @param {Function} render - 自定义渲染函数
   * @param {boolean} background - 是否有背景
   * @returns {Function} 关闭消息的函数
   */
  notice (content = '', duration = defaults.duration, type, onClose = function () {}, closable = false, render = function () {}, background = false) {
    const iconType = iconTypes[type]

    // 如果是加载类型，添加加载动画类
    const loadCls = type === 'loading' ? ' ivu-load-loop' : ''

    const instance = this.getMessageInstance()

    instance.notice({
      name: `${prefixKey}${name}`,
      duration: duration,
      styles: {},
      transitionName: 'move-up',
      content: `
            <div class="${prefixCls}-custom-content ${prefixCls}-${type}">
                <i class="${iconPrefixCls} ${iconPrefixCls}-${iconType} ${loadCls}"></i>
                <span>${content}</span>
            </div>
        `,
      render: render,
      onClose: onClose,
      closable: closable,
      type: 'message',
      msgType: type,
      background: background
    })

    // 返回关闭函数，使用闭包保存当前消息的name值
    return (function () {
      const target = name++

      return function () {
        instance.remove(`${prefixKey}${target}`)
      }
    })()
  },
  /**
   * 配置消息默认选项
   * @param {Object} options - 配置选项
   */
  config (options) {
    if (options.top || options.top === 0) {
      defaults.top = options.top
    }
    if (options.duration || options.duration === 0) {
      defaults.duration = options.duration
    }
  },
  
  /**
   * 销毁消息实例
   * 清理所有消息并销毁实例
   */
  destroy () {
    const instance = getMessageInstance()
    this.messageInstance = null
    instance.destroy('ivu-message')
  },
  
  /**
   * 安装插件
   * 将消息插件安装到Vue应用中
   * @param {Object} app - Vue应用实例
   * @param {*} _ - 未使用的参数
   */
  install (app, _) {
    app.config.globalProperties.$Message = this
  }
}
