/**
 * 国际化混入模块
 * 提供多语言翻译功能
 */

import { t } from '../locale'

export default {
  methods: {
    /**
     * 翻译方法
     * 调用全局翻译函数进行文本翻译
     * @param {...any} args - 翻译参数
     * @returns {string} 翻译后的文本
     */
    t (...args) {
      return t.apply(this, args)
    }
  }
}
