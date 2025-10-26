/**
 * Vue组件上下文挂载工具模块
 * 提供将Vue组件挂载到DOM并继承应用上下文的功能
 */

/**
 * 使用上下文挂载Vue组件
 * 将目标组件的上下文设置为应用上下文，然后挂载到DOM
 * @param {Object} target - 目标Vue组件实例
 * @param {Object} app - Vue应用实例
 * @returns {Element} 挂载后的DOM元素
 */
export default function mountWithContext (target, app) {
  // 将应用的上下文复制到目标组件
  target._context.components = app._context.components
  target._context.directives = app._context.directives
  target._context.provides = app._context.provides
  target._context.config = app._context.config
  target._context.mixins = app._context.mixins

  // 创建挂载容器元素
  const elem = document.createElement('div')

  // 挂载组件到容器并获取DOM元素
  const node = target.mount(elem).$el

  // 将DOM元素添加到页面
  document.body.appendChild(node)

  return node
}
