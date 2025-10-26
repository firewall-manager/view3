/**
 * 点击外部指令模块（扩展版）
 * 提供增强的点击外部检测功能，支持多种事件类型和修饰符
 */

const CLICK = 'click'
// 捕获阶段实例存储
const captureInstances = Object.create(null)
// 非捕获阶段实例存储
const nonCaptureInstances = Object.create(null)
// 实例列表
const instancesList = [captureInstances, nonCaptureInstances]

/**
 * 捕获和非捕获事件的通用处理函数
 * @param {!Object} context - 事件上下文
 * @param {!Object} instances - 捕获或非捕获注册的实例
 * @param {Event} event - 事件对象
 * @returns {undefined} 默认返回值
 */
const commonHandler = function _onCommonEvent (context, instances, event) {
  const { target } = event

  /**
   * 遍历每个注册项
   * @param {Object} item - 注册项
   */
  const itemIteratee = function _itemIteratee (item) {
    const { el } = item

    // 如果点击的不是元素本身且不在元素内部
    if (el !== target && !el.contains(target)) {
      const { binding } = item

      // 如果设置了stop修饰符，阻止事件冒泡
      if (binding.modifiers.stop) {
        event.stopPropagation()
      }

      // 如果设置了prevent修饰符，阻止默认行为
      if (binding.modifiers.prevent) {
        event.preventDefault()
      }

      // 调用绑定的回调函数
      binding.value.call(context, event)
    }
  }

  /**
   * 遍历事件类型
   * @param {string} eventName - 事件名称
   */
  const keysIteratee = function _keysIteratee (eventName) {
    return instances[eventName].forEach(itemIteratee)
  }

  Object.keys(instances).forEach(keysIteratee)
}

/**
 * 捕获阶段事件处理函数
 * @param {Event} event - 事件对象
 */
const captureEventHandler = function onCaptureEvent (event) {
  /* eslint-disable-next-line babel/no-invalid-this */
  commonHandler(this, captureInstances, event)
}

/**
 * 非捕获阶段事件处理函数
 * @param {Event} event - 事件对象
 */
const nonCaptureEventHandler = function onNonCaptureEvent (event) {
  /* eslint-disable-next-line babel/no-invalid-this */
  commonHandler(this, nonCaptureInstances, event)
}

/**
 * 获取正确的事件处理函数：捕获或非捕获
 * @param {boolean} useCapture - 指示使用哪个处理函数；'true'使用捕获处理函数，'false'使用非捕获处理函数
 * @returns {Function} 事件处理函数
 */
const getEventHandler = function _getEventHandler (useCapture) {
  return useCapture ? captureEventHandler : nonCaptureEventHandler
}

/**
 * 指令定义
 * {@link https://vuejs.org/v2/guide/custom-directive.html|自定义指令}
 *
 * @namespace
 * @property {!Object} $_captureInstances - 注册的捕获阶段实例
 * @property {!Object} $_nonCaptureInstances - 注册的非捕获阶段实例
 * @property {Function} $_onCaptureEvent - 捕获阶段事件处理函数
 * @property {Function} $_onNonCaptureEvent - 非捕获阶段事件处理函数
 * @property {Function} mounted - 指令首次绑定到元素时调用
 * @property {Function} unmount - 指令从元素解绑时调用
 * @property {string} version - 此版本的版本号
 */
export const directive = Object.defineProperties(
  {},
  {
    $_captureInstances: {
      value: captureInstances
    },

    $_nonCaptureInstances: {
      value: nonCaptureInstances
    },

    $_onCaptureEvent: {
      value: captureEventHandler
    },

    $_onNonCaptureEvent: {
      value: nonCaptureEventHandler
    },

    /**
     * 指令挂载时执行
     * 注意：这里的arg修改为capture，这样可以动态设置，原先的事件作为modifiers
     */
    mounted: {
      value: function bind (el, binding) {
        // 验证绑定值必须是函数
        if (typeof binding.value !== 'function') {
          throw new TypeError('Binding value must be a function.')
        }

        // 确定事件类型
        let eventType
        const modifiers = binding.modifiers
        if (modifiers.click) eventType = 'click'
        else if (modifiers.mousedown) eventType = 'mousedown'
        else if (modifiers.touchstart) eventType = 'touchstart'
        else eventType = CLICK

        // 确定是否使用捕获阶段
        const useCapture = binding.arg

        // 标准化绑定对象，设置默认修饰符
        const normalisedBinding = {
          ...binding,
          ...{
            modifiers: {
              ...{
                capture: false,
                prevent: false,
                stop: false
              },
              ...binding.modifiers
            }
          }
        }

        // 选择对应的实例存储
        const instances = useCapture ? captureInstances : nonCaptureInstances

        // 初始化事件类型数组
        if (!Array.isArray(instances[eventType])) {
          instances[eventType] = []
        }

        // 添加实例到存储中
        if (instances[eventType].push({ el, binding: normalisedBinding }) === 1) {
          // 如果是第一个实例，添加全局事件监听器
          if (typeof document === 'object' && document) {
            document.addEventListener(
              eventType,
              getEventHandler(useCapture),
              useCapture
            )
          }
        }
      }
    },

    /**
     * 指令卸载时执行
     * 清理事件监听器和实例存储
     */
    unmount: {
      value: function unbind (el) {
        /**
         * 比较元素是否相同
         * @param {Object} item - 存储项
         * @returns {boolean} 是否不是目标元素
         */
        const compareElements = function _compareElements (item) {
          return item.el !== el
        }

        /**
         * 遍历实例存储
         * @param {Object} instances - 实例存储对象
         */
        const instancesIteratee = function _instancesIteratee (instances) {
          const instanceKeys = Object.keys(instances)

          if (instanceKeys.length) {
            const useCapture = instances === captureInstances

            /**
             * 遍历事件类型
             * @param {string} eventName - 事件名称
             */
            const keysIteratee = function _keysIteratee (eventName) {
              // 过滤掉当前元素
              const newInstance = instances[eventName].filter(compareElements)

              if (newInstance.length) {
                // 如果还有其他实例，更新存储
                instances[eventName] = newInstance
              } else {
                // 如果没有其他实例，移除事件监听器
                if (typeof document === 'object' && document) {
                  document.removeEventListener(
                    eventName,
                    getEventHandler(useCapture),
                    useCapture
                  )
                }

                // 删除事件类型存储
                delete instances[eventName]
              }
            }

            instanceKeys.forEach(keysIteratee)
          }
        }

        // 遍历所有实例存储
        instancesList.forEach(instancesIteratee)
      }
    },

    /* 注意：这需要手动更新以匹配package.json */
    version: {
      enumerable: true,
      value: '3.7.1'
    }
  }
)

/**
 * @typedef {Function} Vue - 构造函数
 * @property {Function} directive - 您可以使用Vue.directive()方法注册全局自定义指令，传入指令ID后跟定义对象
 */

/**
 * Vue.js插件应该暴露一个install方法。该方法将使用Vue构造函数作为第一个参数调用，以及可能的选项
 * {@link https://vuejs.org/v2/guide/plugins.html#Writing-a-Plugin|编写插件}
 * @param {Vue} Vue - Vue函数
 */
export function install (Vue) {
  Vue.directive('click-outside', directive)
}
