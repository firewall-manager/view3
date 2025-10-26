/**
 * 表单混入模块
 * 提供表单组件与表单实例的交互功能
 */

export default {
  // 注入表单实例
  inject: {
    FormInstance: {
      default: ''
    }
  },
  computed: {
    /**
     * 计算表单项是否禁用
     * 优先使用组件自身的disabled属性，如果没有则使用表单实例的disabled状态
     * @returns {boolean} 是否禁用
     */
    itemDisabled () {
      let state = this.disabled
      if (!state && this.FormInstance) state = this.FormInstance.disabled
      return state
    }
  }
}
