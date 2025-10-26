<template>
  <!-- 折叠面板容器 -->
  <div :class="classes">
    <slot />
  </div>
</template>
<script>
import { findComponentsDownward } from '../utils/assist'

const prefixCls = 'ivu-collapse'

/**
 * 折叠面板组件
 * 管理多个面板的展开/收起状态，支持手风琴模式
 */
export default {
  name: 'Collapse',
  props: {
    // 是否手风琴模式（同时只能展开一个面板）
    accordion: {
      type: Boolean,
      default: false
    },
    // 当前激活的面板
    modelValue: {
      type: [Array, String],
      required: false,
      default: null
    },
    // 是否简单模式
    simple: {
      type: Boolean,
      default: false
    }
  },
  emits: ['on-change', 'update:modelValue'],
  data () {
    return {
      // 当前激活的面板值
      currentValue: this.modelValue,
      // 子面板组件数组
      childrens: []
    }
  },
  computed: {
    // 折叠面板CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-simple`]: this.simple
                    }
      ]
    }
  },
  watch: {
    // 监听外部值变化
    modelValue (val) {
      this.currentValue = val
    },
    // 监听当前值变化，更新子组件状态
    currentValue () {
      this.setActive()
    }
  },
  mounted () {
    // 组件挂载后设置激活状态
    this.setActive()
  },
  methods: {
    /**
     * 设置子面板的激活状态
     */
    setActive () {
      const activeKey = this.getActiveKey()

      this.childrens = findComponentsDownward(this, 'Panel')

      this.childrens.forEach((child, index) => {
        const name = child.name || index.toString()

        child.isActive = activeKey.indexOf(name) > -1
        child.index = index
      })
    },
    /**
     * 获取当前激活的面板键值
     * @returns {Array} 激活的面板键值数组
     */
    getActiveKey () {
      let activeKey = this.currentValue || []
      const accordion = this.accordion

      if (!Array.isArray(activeKey)) {
        activeKey = [activeKey]
      }

      // 手风琴模式：只保留第一个激活的面板
      if (accordion && activeKey.length > 1) {
        activeKey = [activeKey[0]]
      }

      // 确保所有键值都是字符串
      for (let i = 0; i < activeKey.length; i++) {
        activeKey[i] = activeKey[i].toString()
      }

      return activeKey
    },
    /**
     * 切换面板的激活状态
     * @param {Object} data - 面板数据
     */
    toggle (data) {
      const name = data.name.toString()
      let newActiveKey = []

      if (this.accordion) {
        // 手风琴模式：如果当前面板未激活，则激活它
        if (!data.isActive) {
          newActiveKey.push(name)
        }
      } else {
        // 普通模式：切换面板的激活状态
        const activeKey = this.getActiveKey()
        const nameIndex = activeKey.indexOf(name)

        if (data.isActive) {
          // 如果当前激活，则移除
          if (nameIndex > -1) {
            activeKey.splice(nameIndex, 1)
          }
        } else {
          // 如果当前未激活，则添加
          if (nameIndex < 0) {
            activeKey.push(name)
          }
        }

        newActiveKey = activeKey
      }

      this.currentValue = newActiveKey
      this.setActive()

      this.$emit('update:modelValue', newActiveKey)
      this.$emit('on-change', newActiveKey)
    }
  }
}
</script>
