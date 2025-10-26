/**
 * 颜色选择器样式前缀混入模块
 * 提供统一的CSS类名前缀配置
 */

export default {
  data () {
    return {
      // 颜色选择器组件前缀
      prefixCls: 'ivu-color-picker',
      // 输入框组件前缀
      inputPrefixCls: 'ivu-input',
      // 图标组件前缀
      iconPrefixCls: 'ion',
      // 传输组件前缀
      transferPrefixCls: 'ivu-transfer'
    }
  }
}
