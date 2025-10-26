<template>
  <!-- 弹出框容器 -->
  <div
    class="ivu-poptip-popper ivu-poptip"
    :class="{ 'ivu-poptip-confirm': confirm }"
  >
    <div class="ivu-poptip-content">
      <!-- 弹出框箭头 -->
      <div class="ivu-poptip-arrow" />
      <div class="ivu-poptip-inner">
        <!-- 弹出框主体 -->
        <div
          class="ivu-poptip-body"
          :style="bodyStyle"
        >
          <!-- 确认图标 -->
          <i
            v-if="confirm"
            class="ion ion-ios-help-circle"
          />
          <!-- 弹出框标题 -->
          <div
            v-if="title"
            class="ivu-poptip-body-message"
          >
            {{ title }}
          </div>
          <!-- 自定义渲染内容 -->
          <RenderCell
            v-if="render"
            :render="render"
          />
          <!-- 弹出框内容 -->
          <template
            v-if="content"
          >
            {{ content }}
          </template>
          <slot />
        </div>
        <!-- 确认按钮区域 -->
        <div
          v-if="confirm"
          class="ivu-poptip-footer"
        >
          <button
            type="button"
            class="ivu-btn ivu-btn-text ivu-btn-small"
            @click.prevent="$emit('on-cancel')"
          >
            <span>Cancel</span>
          </button>
          <button
            type="button"
            class="ivu-btn ivu-btn-primary ivu-btn-small"
            @click.prevent="$emit('on-ok')"
          >
            <span>OK</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RenderCell from './render-cell'

/**
 * 弹出框组件
 * 用于显示弹出内容的组件
 */
export default {
  name: 'Popover',
  components: {
    RenderCell
  },
  props: {
    // 弹出框内容
    content: {
      type: String,
      required: false,
      default: ''
    },
    // 弹出框标题
    title: {
      type: String,
      required: false,
      default: ''
    },
    // 是否为确认模式
    confirm: {
      type: Boolean,
      required: false,
      default: false
    },
    // 主体样式
    bodyStyle: {
      type: [String, Object],
      required: false,
      default: ''
    },
    // 自定义渲染函数
    render: {
      type: Function,
      required: false,
      default: null
    }
  }
}
</script>
