/**
 * 创建对话框插件模块
 * 提供动态创建确认对话框的功能，支持多种类型的对话框
 */

import { createApp, h } from 'vue'

import Modal from '../components/modal'
import Button from '../components/button'
import Locale from '../mixins/locale'

// 对话框样式前缀
const prefixCls = 'ivu-modal-confirm'

/**
 * 创建对话框实例
 * 动态创建Vue应用实例并渲染对话框组件
 * @param {Object} properties - 初始属性配置
 * @returns {Object} 包含show、remove方法和component的实例对象
 */
function createInstance (properties) {
  let component
  let node
  const _props = properties || {}

  const instance = createApp({
    mixins: [Locale],
    data () {
      return Object.assign({}, _props, {
        visible: false,        // 是否可见
        width: 416,           // 对话框宽度
        title: '',            // 标题
        body: '',             // 内容
        iconType: '',         // 图标类型
        iconName: '',         // 图标名称
        okText: undefined,    // 确认按钮文本
        cancelText: undefined, // 取消按钮文本
        showCancel: false,    // 是否显示取消按钮
        loading: false,       // 是否加载中
        buttonLoading: false, // 按钮加载状态
        scrollable: false,    // 是否可滚动
        closable: false,      // 是否可关闭
        closing: false        // 是否正在关闭
      })
    },
    computed: {
      /**
       * 图标类型样式类
       * @returns {Array} 图标类型相关的CSS类名数组
       */
      iconTypeCls () {
        return [
          `${prefixCls}-head-icon`,
          `${prefixCls}-head-icon-${this.iconType}`
        ]
      },
      
      /**
       * 图标名称样式类
       * @returns {Array} 图标名称相关的CSS类名数组
       */
      iconNameCls () {
        return [
          'ion',
          `ion-${this.iconName}`
        ]
      },
      
      /**
       * 本地化确认按钮文本
       * @returns {string} 确认按钮文本
       */
      localeOkText () {
        if (this.okText) {
          return this.okText
        } else {
          return this.t('i.modal.okText')
        }
      },
      
      /**
       * 本地化取消按钮文本
       * @returns {string} 取消按钮文本
       */
      localeCancelText () {
        if (this.cancelText) {
          return this.cancelText
        } else {
          return this.t('i.modal.cancelText')
        }
      }
    },
    methods: {
      /**
       * 取消操作
       * 关闭对话框并触发取消回调
       */
      cancel () {
        if (this.closing) return
        component.visible = false
        this.buttonLoading = false
        this.onCancel()
        this.remove()
      },
      
      /**
       * 确认操作
       * 处理确认按钮点击，支持异步操作
       */
      ok () {
        if (this.closing) return
        if (this.loading) {
          this.buttonLoading = true
        } else {
          component.visible = false
          this.remove()
        }
        this.onOk()
      },
      
      /**
       * 移除对话框
       * 延迟销毁对话框，提供动画效果
       */
      remove () {
        this.closing = true
        setTimeout(() => {
          this.closing = false
          this.destroy()
        }, 300)
      },
      
      /**
       * 销毁对话框
       * 从DOM中移除对话框元素
       */
      destroy () {
        if (this.$el) document.body.removeChild(this.$el)
        this.onRemove()
      },
      
      /**
       * 确认回调（空实现，由外部覆盖）
       */
      onOk () {},
      
      /**
       * 取消回调（空实现，由外部覆盖）
       */
      onCancel () {},
      
      /**
       * 移除回调（空实现，由外部覆盖）
       */
      onRemove () {}
    },
    render () {
      const footerVNodes = []
      if (this.showCancel) {
        footerVNodes.push(h(Button, {
          type: 'text',
          onClick: this.cancel
        }, { default: () => this.localeCancelText }))
      }
      footerVNodes.push(h(Button, {
        type: 'primary',
        loading: this.buttonLoading,
        onClick: this.ok
      }, { default: () => this.localeOkText }))

      // 渲染内容部分
      let body_render
      if (this.render) {
        // 使用自定义渲染函数
        body_render = h('div', {
          class: `${prefixCls}-body ${prefixCls}-body-render`
        }, [this.render(h)])
      } else {
        // 使用默认HTML内容
        body_render = h('div', {
          class: `${prefixCls}-body`
        }, [
          h('div', {
            innerHTML: this.body
          })
        ])
      }

      // 当没有标题时，隐藏头部
      let head_render
      if (this.title) {
        head_render = h('div', {
          class: `${prefixCls}-head`
        }, [
          h('div', {
            class: this.iconTypeCls
          }, [
            h('i', {
              class: this.iconNameCls
            })
          ]),
          h('div', {
            class: `${prefixCls}-head-title`,
            innerHTML: this.title
          })
        ])
      }

      node = h(Modal, Object.assign({}, _props, {
        width: this.width,
        scrollable: this.scrollable,
        closable: this.closable,
        modelValue: this.visible,
        onInput: (status) => {
          this.visible = status
        },
        onOnCancel: this.cancel
      }), () => [
        h('div', {
          class: prefixCls
        }, [
          head_render,
          body_render,
          h('div', {
            class: `${prefixCls}-footer`
          }, footerVNodes)
        ])
      ])

      return node
    }
  })

  const elem = document.createElement('div')

  document.body.appendChild(instance.mount(elem).$el)

  component = node.component.proxy

  return {
    /**
     * 显示对话框
     * 根据传入的属性配置显示对话框
     * @param {Object} props - 对话框属性配置
     */
    show (props) {
      component.$parent.showCancel = props.showCancel
      component.$parent.iconType = props.icon

      // 根据图标类型设置对应的图标名称
      switch (props.icon) {
        case 'info':
          component.$parent.iconName = 'ios-information-circle'
          break
        case 'success':
          component.$parent.iconName = 'ios-checkmark-circle'
          break
        case 'warning':
          component.$parent.iconName = 'ios-alert'
          break
        case 'error':
          component.$parent.iconName = 'ios-close-circle'
          break
        case 'confirm':
          component.$parent.iconName = 'ios-help-circle'
          break
      }

      if ('width' in props) {
        component.$parent.width = props.width
      }

      if ('closable' in props) {
        component.$parent.closable = props.closable
      }

      if ('title' in props) {
        component.$parent.title = props.title
      }

      if ('content' in props) {
        component.$parent.body = props.content
      }

      if ('okText' in props) {
        component.$parent.okText = props.okText
      }

      if ('cancelText' in props) {
        component.$parent.cancelText = props.cancelText
      }

      if ('onCancel' in props) {
        component.$parent.onCancel = props.onCancel
      }

      if ('onOk' in props) {
        component.$parent.onOk = props.onOk
      }

      // async for ok
      if ('loading' in props) {
        component.$parent.loading = props.loading
      }

      if ('scrollable' in props) {
        component.$parent.scrollable = props.scrollable
      }

      component.$parent.onRemove = props.onRemove

      component.visible = true
    },
    
    /**
     * 移除对话框
     * 关闭对话框并清理状态
     */
    remove () {
      component.visible = false
      component.$parent.buttonLoading = false
      component.$parent.remove()
    },
    
    // 组件实例
    component
  }
};

export default createInstance
