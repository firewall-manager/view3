/**
 * 工具函数模块 - 提供常用的辅助功能
 * 包含DOM操作、组件查找、样式处理、类型检查等实用工具
 */

// 服务端渲染标识
const isServer = false

/**
 * 检查值是否在有效列表中
 * @param {*} value - 要检查的值
 * @param {Array} validList - 有效值列表
 * @returns {boolean} 值是否在列表中
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * 将驼峰命名转换为连字符命名
 * @param {string} str - 驼峰命名的字符串
 * @returns {string} 连字符命名的字符串
 */
export function camelcaseToHyphen (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

// 用于模态框隐藏滚动条时计算滚动条宽度
let cached

/**
 * 获取滚动条宽度
 * 通过创建隐藏的DOM元素来测量滚动条宽度，用于模态框等场景
 * @param {boolean} fresh - 是否强制重新计算
 * @returns {number} 滚动条宽度
 */
export function getScrollBarSize (fresh) {
  if (isServer) return 0
  if (fresh || cached === undefined) {
    // 创建内部容器
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    // 创建外部容器
    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)
    document.body.appendChild(outer)

    // 测量无滚动条时的宽度
    const widthContained = inner.offsetWidth
    // 添加滚动条后测量宽度
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    // 如果宽度相同，使用clientWidth
    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    // 计算滚动条宽度
    cached = widthContained - widthScroll
  }
  return cached
}

// 监听DOM变化
export const MutationObserver = isServer ? false : window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || false

// 特殊字符正则表达式
const SPECIAL_CHARS_REGEXP = /([:_-]+(.))/g
// Mozilla浏览器特殊处理正则
const MOZ_HACK_REGEXP = /^moz([A-Z])/

/**
 * 将字符串转换为驼峰命名
 * @param {string} name - 要转换的字符串
 * @returns {string} 驼峰命名的字符串
 */
function camelCase (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

/**
 * 获取元素样式值
 * @param {Element} element - DOM元素
 * @param {string} styleName - 样式名称
 * @returns {string|null} 样式值
 */
export function getStyle (element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  // 处理float属性的特殊命名
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

/**
 * 首字母大写
 * @param {string} str - 要转换的字符串
 * @returns {string} 首字母大写的字符串
 */
function firstUpperCase (str) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1)
}
export { firstUpperCase }

/**
 * 属性类型警告
 * @param {string} component - 组件名称
 * @param {string} prop - 属性名
 * @param {string} correctType - 正确的类型
 * @param {string} wrongType - 错误的类型
 */
export function warnProp (component, prop, correctType, wrongType) {
  correctType = firstUpperCase(correctType)
  wrongType = firstUpperCase(wrongType)
    console.error(`[iView warn]: Invalid prop: type check failed for prop ${prop}. Expected ${correctType}, got ${wrongType}. (found in component: ${component})`);    // eslint-disable-line
}

/**
 * 获取对象类型
 * @param {*} obj - 要检查的对象
 * @returns {string} 对象类型
 */
function typeOf (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

/**
 * 深拷贝对象
 * @param {*} data - 要拷贝的数据
 * @returns {*} 拷贝后的数据
 */
function deepCopy (data) {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (const i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

export { deepCopy }

/**
 * 滚动到指定位置动画
 * @param {Element|Window} el - 要滚动的元素或window
 * @param {number} from - 起始位置
 * @param {number} to - 目标位置
 * @param {number} duration - 动画持续时间(ms)
 * @param {Function} endCallback - 动画结束回调
 */
export function scrollTop (el, from = 0, to, duration = 500, endCallback) {
  // 兼容性处理：为不支持requestAnimationFrame的浏览器提供polyfill
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
              return window.setTimeout(callback, 1000 / 60)
            }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  /**
   * 递归滚动函数
   * @param {number} start - 当前起始位置
   * @param {number} end - 目标位置
   * @param {number} step - 每步移动距离
   */
  function scroll (start, end, step) {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * 向上查找组件
 * @param {Object} context - Vue组件实例
 * @param {string|Array} componentName - 组件名称或名称数组
 * @param {Array} componentNames - 内部使用的组件名称数组
 * @returns {Object|null} 找到的父组件实例
 */
function findComponentUpward (context, componentName, componentNames) {
  if (typeof componentName === 'string') {
    componentNames = [componentName]
  } else {
    componentNames = componentName
  }

  let parent = context.$parent
  let name = parent.$options.name
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) name = parent.$options.name
  }
  return parent
}
export { findComponentUpward }

/**
 * 向下查找单个组件
 * @param {Object} context - Vue组件实例
 * @param {string} componentName - 组件名称
 * @returns {Object|undefined} 找到的第一个子组件实例
 */
export function findComponentDownward (context, componentName) {
  return findComponentsDownward(context, componentName)[0]
}

/**
 * 向下查找多个组件
 * @param {Object} context - Vue组件实例
 * @param {string} componentName - 组件名称
 * @returns {Array} 找到的所有子组件实例数组
 */
export function findComponentsDownward (context, componentName) {
  const children = context.$.subTree.children

  if (Array.isArray(children)) {
    return children.reduce((components, child) => {
      const component = child.component && child.component.proxy

      if (component) {
        const name = component.$options.name

        if (name === componentName) {
          return components.concat(component)
        } else {
          return components.concat(findComponentsDownward(component, componentName))
        }
      } else {
        return components.concat(findComponentsDownward({ $: { subTree: child } }, componentName))
      }
    }, [])
  } else if (children && typeof children === 'object') {
    const component = context.$.subTree.component

    if (component && component.proxy && component.proxy.$options.name === componentName) {
      return findComponentsDownward({ $: { subTree: { children: [context.$.subTree] } } }, componentName)
    }

    if (component) {
      return findComponentsDownward({ $: component }, componentName)
    } else {
      return []
    }
  } else {
    return []
  }
}

/**
 * 向上查找多个组件
 * @param {Object} context - Vue组件实例
 * @param {string} componentName - 组件名称
 * @returns {Array} 找到的所有父组件实例数组
 */
export function findComponentsUpward (context, componentName) {
  const parents = []
  const parent = context.$parent

  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent)
    return parents.concat(findComponentsUpward(parent, componentName))
  } else {
    return []
  }
}

/**
 * 查找兄弟组件
 * @param {Object} context - Vue组件实例
 * @param {string} componentName - 组件名称
 * @param {boolean} exceptMe - 是否排除自身
 * @returns {Array} 找到的兄弟组件实例数组
 */
export function findBrothersComponents (context, componentName, exceptMe = true) {
  const children = context.$parent.$.subTree.children
  if (!children || !Array.isArray(children)) return []

  const res = context.$parent.$.subTree.children.filter(item => {
    const child = item.component && item.component.proxy

    if (child) {
      return child.$options.name === componentName
    }
  })

  if (exceptMe) {
    const index = res.findIndex(item => item._uid === context._uid)

    res.splice(index, 1)
  }

  return []
}

/* istanbul ignore next */
/**
 * 去除字符串首尾空白字符
 * @param {string} string - 要处理的字符串
 * @returns {string} 处理后的字符串
 */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/* istanbul ignore next */
/**
 * 检查元素是否包含指定类名
 * @param {Element} el - DOM元素
 * @param {string} cls - 类名
 * @returns {boolean} 是否包含类名
 */
export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
/**
 * 为元素添加类名
 * @param {Element} el - DOM元素
 * @param {string} cls - 要添加的类名
 */
export function addClass (el, cls) {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
/**
 * 移除元素的类名
 * @param {Element} el - DOM元素
 * @param {string} cls - 要移除的类名
 */
export function removeClass (el, cls) {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

/**
 * 响应式断点映射
 * 定义不同屏幕尺寸的断点值
 */
export const dimensionMap = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'
}

/**
 * 设置媒体查询polyfill
 * 为不支持matchMedia的浏览器提供兼容性处理
 */
export function setMatchMedia () {
  if (typeof window !== 'undefined') {
    const matchMediaPolyfill = mediaQuery => {
      return {
        media: mediaQuery,
        matches: false,
        on () {},
        off () {}
      }
    }
    window.matchMedia = window.matchMedia || matchMediaPolyfill
  }
}

/**
 * 锚点匹配正则表达式
 * 用于匹配URL中的锚点部分
 */
export const sharpMatcherRegx = /#([^#]+)$/
