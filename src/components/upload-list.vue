<template>
  <!-- 上传列表容器 -->
  <ul :class="[prefixCls + '-list']">
    <!-- 文件项 -->
    <li
      v-for="file in files"
      :class="fileCls(file)"
      @click="handleClick(file)"
    >
      <!-- 文件信息 -->
      <span @click="handlePreview(file)">
        <Icon :type="format(file)" /> {{ file.name }}
      </span>
      <!-- 删除按钮 -->
      <Icon
        v-show="file.status === 'finished'"
        type="ios-close"
        :class="[prefixCls + '-list-remove']"
        @click.native="handleRemove(file)"
      />
      <!-- 进度条 -->
      <transition name="fade">
        <i-progress
          v-if="file.showProgress"
          :stroke-width="2"
          :percent="parsePercentage(file.percentage)"
          :status="file.status === 'finished' && file.showProgress ? 'success' : 'normal'"
        />
      </transition>
    </li>
  </ul>
</template>
<script>
import Icon from '../icon/icon.vue'
import iProgress from '../progress/progress.vue'
const prefixCls = 'ivu-upload'

/**
 * 上传列表组件
 * 用于显示上传文件列表的组件
 */
export default {
  name: 'UploadList',
  components: { Icon, iProgress },
  props: {
    // 文件列表
    files: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      // 样式前缀
      prefixCls: prefixCls
    }
  },
  methods: {
    // 文件项CSS类名
    fileCls (file) {
      return [
                    `${prefixCls}-list-file`,
                    {
                      [`${prefixCls}-list-file-finish`]: file.status === 'finished'
                    }
      ]
    },
    // 处理文件点击
    handleClick (file) {
      this.$emit('on-file-click', file)
    },
    // 处理文件预览
    handlePreview (file) {
      this.$emit('on-file-preview', file)
    },
    // 处理文件移除
    handleRemove (file) {
      this.$emit('on-file-remove', file)
    },
    // 格式化文件图标
    format (file) {
      const format = file.name.split('.').pop().toLocaleLowerCase() || ''
      let type = 'ios-document-outline'

      if (['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'].indexOf(format) > -1) {
        type = 'ios-image'
      }
      if (['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'].indexOf(format) > -1) {
        type = 'ios-film'
      }
      if (['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'].indexOf(format) > -1) {
        type = 'ios-musical-notes'
      }
      if (['doc', 'txt', 'docx', 'pages', 'epub', 'pdf'].indexOf(format) > -1) {
        type = 'md-document'
      }
      if (['numbers', 'csv', 'xls', 'xlsx'].indexOf(format) > -1) {
        type = 'ios-stats'
      }
      if (['keynote', 'ppt', 'pptx'].indexOf(format) > -1) {
        type = 'ios-videocam'
      }

      return type
    },
    // 解析百分比
    parsePercentage (val) {
      return parseInt(val, 10)
    }
  }
}
</script>
