<template>
  <!-- 级联选择器面板容器 -->
  <span>
    <!-- 当前级菜单列表 -->
    <ul
      v-if="data && data.length"
      :class="[prefixCls + '-menu']"
    >
      <Casitem
        v-for="item in data"
        :key="getKey()"
        :prefix-cls="prefixCls"
        :data="item"
        :tmp-item="tmpItem"
        @click.native.stop="handleClickItem(item)"
        @mouseenter.native.stop="handleHoverItem(item)"
      />
    </ul>
    <!-- 子级面板（递归渲染） -->
    <Caspanel
      v-if="sublist && sublist.length"
      :prefix-cls="prefixCls"
      :data="sublist"
      :disabled="disabled"
      :trigger="trigger"
      :change-on-select="changeOnSelect"
    />
  </span>
</template>
<script>
import Casitem from './casitem.vue'
import Emitter from '../mixins/emitter'
import { findComponentUpward, findComponentDownward } from '../utils/assist'

// 用于生成唯一key的计数器
let key = 1

/**
 * 级联选择器面板组件
 * 负责渲染级联选择器的多级菜单面板
 */
export default {
  name: 'Caspanel',
  components: { Casitem },
  mixins: [Emitter],
  props: {
    // 当前级数据
    data: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否禁用
    disabled: Boolean,
    // 是否选择即改变
    changeOnSelect: Boolean,
    // 触发方式
    trigger: String,
    // CSS类名前缀
    prefixCls: String
  },
  data () {
    return {
      // 临时选中项
      tmpItem: {},
      // 选择结果
      result: [],
      // 子级列表
      sublist: []
    }
  },
  watch: {
    // 监听数据变化，清空子级列表
    data () {
      this.sublist = []
    }
  },
  mounted () {
    // 监听查找选中项事件
    this.mitt.on('on-find-selected', (params) => {
      const val = params.value
      const value = [...val]
      for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < this.data.length; j++) {
          if (value[i] === this.data[j].value) {
            this.handleTriggerItem(this.data[j], true)
            value.splice(0, 1)
            this.$nextTick(() => {
              this.broadcast('Caspanel', 'on-find-selected', {
                value: value
              })
            })
            return false
          }
        }
      }
    })
    // 监听清空事件
    this.mitt.on('on-clear', (deep = false) => {
      this.sublist = []
      this.tmpItem = {}
      if (deep) {
        const Caspanel = findComponentDownward(this, 'Caspanel')
        if (Caspanel) {
          Caspanel.$emit('on-clear', true)
        }
      }
    })
  },
  methods: {
    /**
     * 处理点击菜单项
     * @param {Object} item - 菜单项数据
     */
    handleClickItem (item) {
      if (this.trigger !== 'click' && item.children && item.children.length) return
      this.handleTriggerItem(item, false, true)
    },
    /**
     * 处理悬停菜单项
     * @param {Object} item - 菜单项数据
     */
    handleHoverItem (item) {
      if (this.trigger !== 'hover' || !item.children || !item.children.length) return
      this.handleTriggerItem(item, false, true)
    },
    /**
     * 处理触发菜单项
     * @param {Object} item - 菜单项数据
     * @param {Boolean} fromInit - 是否来自初始化
     * @param {Boolean} fromUser - 是否来自用户操作
     */
    handleTriggerItem (item, fromInit = false, fromUser = false) {
      if (item.disabled) return

      const cascader = findComponentUpward(this, 'Cascader')
      // 处理异步加载数据
      if (item.loading !== undefined && !item.children.length) {
        if (cascader && cascader.loadData) {
          cascader.loadData(item, () => {
            if (fromUser) {
              cascader.isLoadedChildren = true
            }
            if (item.children.length) {
              this.handleTriggerItem(item)
            }
          })
          return
        }
      }

      // 向上递归，设置临时选中值（并非真实选中）
      const backItem = this.getBaseItem(item)
      if (
        this.changeOnSelect ||
                    (backItem.label !== this.tmpItem.label || backItem.value !== this.tmpItem.value) ||
                    (backItem.label === this.tmpItem.label && backItem.value === this.tmpItem.value)
      ) {
        this.tmpItem = backItem
        this.emitUpdate([backItem])
      }

      if (item.children && item.children.length) {
        // 有子项，显示子级面板
        this.sublist = item.children
        this.dispatch('Cascader', 'on-result-change', {
          lastValue: false,
          changeOnSelect: this.changeOnSelect,
          fromInit: fromInit
        })

        if (this.changeOnSelect) {
          const Caspanel = findComponentDownward(this, 'Caspanel')
          if (Caspanel) {
            Caspanel.$emit('on-clear', true)
          }
        }
      } else {
        // 无子项，选择完成
        this.sublist = []
        this.dispatch('Cascader', 'on-result-change', {
          lastValue: true,
          changeOnSelect: this.changeOnSelect,
          fromInit: fromInit
        })
      }

      if (cascader) {
        cascader.$refs.drop.update()
      }
    },
    /**
     * 更新选择结果
     * @param {Array} item - 选择项数组
     */
    updateResult (item) {
      this.result = [this.tmpItem].concat(item)
      this.emitUpdate(this.result)
    },
    /**
     * 获取基础项（移除子项）
     * @param {Object} item - 原始项
     * @return {Object} 基础项
     */
    getBaseItem (item) {
      const backItem = Object.assign({}, item)
      if (backItem.children) {
        delete backItem.children
      }

      return backItem
    },
    /**
     * 发射更新事件
     * @param {Array} result - 结果数组
     */
    emitUpdate (result) {
      if (this.$parent.$options.name === 'Caspanel') {
        this.$parent.updateResult(result)
      } else {
        findComponentUpward(this, 'Cascader').updateResult(result)
      }
    },
    /**
     * 获取唯一key
     * @return {Number} 唯一key值
     */
    getKey () {
      return key++
    }
  }
}
</script>
