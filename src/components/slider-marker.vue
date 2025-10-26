<script>
import { h } from 'vue'

/**
 * 滑块标记组件
 * 用于显示滑块刻度标记的功能组件
 */
export default {
  name: 'SliderMarker',
  props: {
    // 标记内容
    mark: {
      type: [String, Object]
    }
  },
  render () {
    const label = typeof this.mark === 'string' ? this.mark : [this.mark.label]

    return h('div', {
      class: 'ivu-slider-marks-item',
      style: this.mark.style || {}
    }, label)
  }
}
</script>
