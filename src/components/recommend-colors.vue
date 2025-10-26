<template>
  <!-- 推荐颜色选择器容器 -->
  <div
    ref="reference"
    tabindex="0"
    @click="handleClick"
    @keydown.esc="handleEscape"
    @keydown.enter="handleEnter"
    @keydown.left="handleArrow($event, 'x', left)"
    @keydown.right="handleArrow($event, 'x', right)"
    @keydown.up="handleArrow($event, 'y', up)"
    @keydown.down="handleArrow($event, 'y', down)"
    @blur="blurColor"
    @focus="focusColor"
  >
    <!-- 颜色列表 -->
    <template
      v-for="(item, index) in list"
      :key="item + ':' + index"
    >
      <div
        :class="[prefixCls + '-picker-colors-wrapper']"
      >
        <div :data-color-id="index">
          <!-- 颜色块 -->
          <div
            :style="{background: item}"
            :class="[prefixCls + '-picker-colors-wrapper-color']"
          />
          <!-- 选中圆圈 -->
          <div
            :ref="'color-circle-' + index"
            :class="[prefixCls + '-picker-colors-wrapper-circle', hideClass]"
          />
        </div>
      </div>
      <!-- 换行 -->
      <br v-if="lineBreak(list, index)">
    </template>
  </div>
</template>

<script>
import Emitter from '../mixins/emitter'
import HandleEscapeMixin from '../mixins/handle-escape-mixin'
import Prefixes from '../mixins/color-prefix'
import { clamp } from '../utils/color'

/**
 * 推荐颜色组件
 * 用于显示推荐颜色列表的颜色选择器
 */
export default {
  name: 'RecommendedColors',

  mixins: [Emitter, HandleEscapeMixin, Prefixes],

  props: {
    // 颜色列表
    list: {
      type: Array,
      default: undefined
    }
  },

  data () {
    const columns = 12
    const rows = Math.ceil(this.list.length / columns)
    const normalStep = 1

    return {
      // 左移步长
      left: -normalStep,
      // 右移步长
      right: normalStep,
      // 上移步长
      up: -normalStep,
      // 下移步长
      down: normalStep,
      // 加速键
      powerKey: 'shiftKey',
      // 网格位置
      grid: { x: 1, y: 1 },
      // 行数
      rows,
      // 列数
      columns
    }
  },

  computed: {
    // 隐藏CSS类名
    hideClass () {
      return `${this.prefixCls}-hide`
    },
    // 线性索引
    linearIndex () {
      return this.getLinearIndex(this.grid)
    },
    // 当前圆圈
    currentCircle () {
      return this.$refs[`color-circle-${this.linearIndex}`][0]
    }
  },

  methods: {
    // 获取线性索引
    getLinearIndex (grid) {
      return this.columns * (grid.y - 1) + grid.x - 1
    },
    // 获取最大限制
    getMaxLimit (axis) {
      return axis === 'x' ? this.columns : this.rows
    },
    // 处理方向键
    handleArrow (e, axis, direction) {
      e.preventDefault()
      e.stopPropagation()

      this.blurColor()

      const grid = { ...this.grid }

      if (e[this.powerKey]) {
        if (direction < 0) {
          grid[axis] = 1
        } else {
          grid[axis] = this.getMaxLimit(axis)
        }
      } else {
        grid[axis] += direction
      }

      const index = this.getLinearIndex(grid)

      if (index >= 0 && index < this.list.length) {
        this.grid[axis] = clamp(grid[axis], 1, this.getMaxLimit(axis))
      }

      this.focusColor()
    },
    // 模糊颜色
    blurColor () {
      this.currentCircle.classList.add(this.hideClass)
    },
    // 聚焦颜色
    focusColor () {
      this.currentCircle.classList.remove(this.hideClass)
    },
    // 处理回车键
    handleEnter (e) {
      this.handleClick(e, this.currentCircle)
    },
    // 处理点击
    handleClick (e, circle) {
      e.preventDefault()
      e.stopPropagation()

      this.$refs.reference.focus()

      const target = circle || e.target
      const colorId = target.dataset.colorId || target.parentElement.dataset.colorId

      if (colorId) {
        this.blurColor()
        const id = Number(colorId) + 1
        this.grid.x = id % this.columns || this.columns
        this.grid.y = Math.ceil(id / this.columns)
        this.focusColor()
        this.$emit('picker-color', this.list[colorId])
        this.$emit('change', { hex: this.list[colorId], source: 'hex' })
      }
    },
    // 判断是否需要换行
    lineBreak (list, index) {
      if (!index) {
        return false
      }

      const nextIndex = index + 1

      return nextIndex < list.length && nextIndex % this.columns === 0
    }
  }
}
</script>
