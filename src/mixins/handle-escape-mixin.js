/**
 * 处理ESC键混入模块
 * 提供ESC键事件处理功能，用于颜色选择器等组件
 */

export default {
  methods: {
    /**
     * 处理ESC键按下事件
     * 向ColorPicker组件派发ESC键事件
     * @param {KeyboardEvent} e - 键盘事件对象
     */
    handleEscape (e) {
      this.dispatch('ColorPicker', 'on-escape-keydown', e)
    }
  }
}
