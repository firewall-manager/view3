/**
 * 创建消息通知插件模块
 * 提供动态创建消息通知的功能
 */

import { createApp, h } from 'vue'

import Notification from '../components/notification'

/**
 * 创建消息通知实例
 * 动态创建Vue应用实例并渲染通知组件
 * @param {Object} properties - 初始属性配置
 * @returns {Object} 包含notice、remove、destroy方法和component的实例对象
 */
function createInstance (properties) {
  let node
  let component
  const _props = properties || {}

  const instance = createApp({
    render () {
      node = h(Notification, _props)

      return node
    }
  })

  const elem = document.createElement('div')
  const parentElem = document.createElement('div')

  document.body.appendChild(parentElem)
  parentElem.appendChild(instance.mount(elem).$el)

  component = node.component.proxy

  return {
    /**
     * 添加通知
     * @param {Object} noticeProps - 通知属性配置
     */
    notice (noticeProps) {
      component.add(noticeProps)
    },
    
    /**
     * 移除指定通知
     * @param {string} name - 通知名称
     */
    remove (name) {
      component.close(name)
    },
    
    // 组件实例
    component: component,
    
    /**
     * 销毁通知实例
     * 关闭所有通知并移除DOM元素
     * @param {string} element - 要移除的元素类名
     */
    destroy (element) {
      component.closeAll()

      setTimeout(() => {
        document.body.removeChild(document.getElementsByClassName(element)[0])
      }, 500)
    }
  }
};

export default createInstance
