/**
 * 创建模态框插件模块
 * 提供动态创建模态框的功能，支持上下文继承
 */

import { createApp, h } from 'vue'
import mountWithContext from '../utils/mount-with-context'

/**
 * 创建模态框实例
 * 动态创建Vue应用实例并渲染模态框组件
 * @param {Object} app - Vue应用实例
 * @param {Object} component - 模态框组件
 * @param {Object} props - 组件属性
 * @param {Function} render - 渲染函数
 * @param {Function} onRemove - 移除回调
 * @returns {Object} 包含show、remove方法和component的实例对象
 */
function createInstance (app, component, props, render, onRemove) {
  let node

  // 提取插槽配置
  const slots = props.slots || {}
  delete props.slots

  const instance = createApp({
    methods: {
      /**
       * 移除模态框
       * 延迟销毁模态框，提供动画效果
       */
      remove () {
        setTimeout(() => {
          this.destroy()
        }, 300)
      },
      
      /**
       * 销毁模态框
       * 从DOM中移除模态框元素
       */
      destroy () {
        document.body.removeChild(this.$el)
        onRemove()
      }
    },
    render () {
      node = h(component, {
        ...props,
        onVisibleChange: (visible) => {
          if (!visible) this.remove()
        }
      }, {
        ...slots,
        default: () => render(h)
      })

      return node
    }
  })

  // 使用上下文挂载，继承应用上下文
  mountWithContext(instance, app)

  return {
    // 组件实例
    component: node.component.proxy,
    
    /**
     * 显示模态框
     */
    show () {
      node.component.proxy.visible = true
    },

    /**
     * 移除模态框
     */
    remove () {
      node.component.proxy.visible = false
    }
  }
}
export default createInstance
