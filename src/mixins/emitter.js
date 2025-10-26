/**
 * 事件发射器混入模块
 * 提供组件间的事件通信功能，包括向上派发和向下广播
 */

import mitt from 'mitt'
import { findComponentsDownward } from '../utils/assist'

/**
 * 向下广播事件
 * 向指定名称的子组件广播事件
 * @param {string} componentName - 组件名称
 * @param {string} eventName - 事件名称
 * @param {Array} params - 事件参数
 */
function broadcast (componentName, eventName, params) {
  const components = findComponentsDownward(this, componentName)

  components.forEach((component) => component.mitt.emit.apply(component, [eventName].concat(params)))
}

export default {
  computed: {
    /**
     * 创建mitt事件发射器实例
     * @returns {Object} mitt实例
     */
    mitt () {
      return mitt()
    }
  },
  methods: {
    /**
     * 向上派发事件
     * 向指定名称的父组件派发事件
     * @param {string} componentName - 目标组件名称
     * @param {string} eventName - 事件名称
     * @param {Array} params - 事件参数
     */
    dispatch (componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name

      // 向上查找指定名称的父组件
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.name
        }
      }
      
      // 如果找到目标父组件，派发事件
      if (parent) {
        parent.mitt.emit.apply(parent, [eventName].concat(params))
      }
    },
    
    /**
     * 向下广播事件
     * 向指定名称的子组件广播事件
     * @param {string} componentName - 目标组件名称
     * @param {string} eventName - 事件名称
     * @param {Array} params - 事件参数
     */
    broadcast (componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    }
  }
}
