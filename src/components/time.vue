<template>
  <!-- 时间显示 -->
  <span
    :class="classes"
    @click="handleClick"
  >{{ date }}</span>
</template>
<script>
import { oneOf } from '../../utils/assist'
import Locale from '../../mixins/locale'
import Time from './time'
const isServer = false

const prefixCls = 'ivu-time'

/**
 * 时间组件
 * 用于显示时间信息，支持相对时间、日期、日期时间格式
 */
export default {
  name: 'Time',
  mixins: [Locale],
  props: {
    // 时间值
    time: {
      type: [Number, Date, String],
      required: true
    },
    // 显示类型
    type: {
      type: String,
      validator (value) {
        return oneOf(value, ['relative', 'date', 'datetime'])
      },
      default: 'relative'
    },
    // 哈希值
    hash: {
      type: String,
      default: ''
    },
    // 更新间隔（秒）
    interval: {
      type: Number,
      default: 60
    }
  },
  data () {
    return {
      // 显示的时间文本
      date: ''
    }
  },
  computed: {
    // 时间组件CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-with-hash`]: this.hash
                    }
      ]
    }
  },
  watch: {
    time () {
      // https://segmentfault.com/q/1010000021110866
      if (!isServer) this.setTime()
    }
  },
  mounted () {
    this.setTime()
    if (isServer) return
    this.timer = setInterval(() => {
      this.setTime()
    }, 1000 * this.interval)
  },
  beforeUnmount () {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    // 处理点击事件
    handleClick () {
      if (this.hash !== '') window.location.hash = this.hash
    },
    // 设置时间显示
    setTime () {
      const type = typeof this.time
      let time

      if (type === 'number') {
        const timestamp = this.time.toString().length > 10 ? this.time : this.time * 1000
        time = (new Date(timestamp)).getTime()
      } else if (type === 'object') {
        time = this.time.getTime()
      } else if (type === 'string') {
        time = (new Date(this.time)).getTime()
      }

      if (this.type === 'relative') {
        this.date = Time(time, this.t)
      } else {
        const date = new Date(this.time)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

        if (this.type === 'datetime') {
          this.date = `${year}-${month}-${day} ${hour}:${minute}:${second}`
        } else if (this.type === 'date') {
          this.date = `${year}-${month}-${day}`
        }
      }
    }
  }
}
</script>
