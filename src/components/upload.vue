<template>
  <!-- 上传组件容器 -->
  <div :class="[prefixCls]">
    <!-- 上传区域 -->
    <div
      :class="classes"
      @click="handleClick"
      @drop.prevent="onDrop"
      @paste="handlePaste"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
    >
      <!-- 文件输入框 -->
      <input
        ref="input"
        type="file"
        :class="[prefixCls + '-input']"
        :multiple="multiple"
        :webkitdirectory="webkitdirectory"
        :accept="accept"
        @change="handleChange"
      >
      <slot />
    </div>
    <!-- 提示信息插槽 -->
    <slot name="tip" />
    <!-- 上传列表 -->
    <upload-list
      v-if="showUploadList"
      :files="fileList"
      @on-file-remove="handleRemove"
      @on-file-preview="handlePreview"
    />
  </div>
</template>
<script>
import UploadList from './upload-list.vue'
import ajax from './ajax'
import { oneOf } from '../utils/assist'
import Emitter from '../mixins/emitter'
import mixinsForm from '../mixins/form'

const prefixCls = 'ivu-upload'

/**
 * 上传组件
 * 用于文件上传的组件，支持拖拽上传、粘贴上传等功能
 */
export default {
  name: 'Upload',
  components: { UploadList },
  mixins: [Emitter, mixinsForm],
  props: {
    // 上传地址
    action: {
      type: String,
      required: true
    },
    // 请求头
    headers: {
      type: Object,
      default () {
        return {}
      }
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 额外数据
    data: {
      type: Object
    },
    // 文件字段名
    name: {
      type: String,
      default: 'file'
    },
    // 是否携带凭证
    withCredentials: {
      type: Boolean,
      default: false
    },
    // 是否显示上传列表
    showUploadList: {
      type: Boolean,
      default: true
    },
    // 上传类型
    type: {
      type: String,
      validator (value) {
        return oneOf(value, ['select', 'drag'])
      },
      default: 'select'
    },
    // 允许的文件格式
    format: {
      type: Array,
      default () {
        return []
      }
    },
    // 接受的文件类型
    accept: {
      type: String
    },
    // 最大文件大小
    maxSize: {
      type: Number
    },
    // 上传前钩子
    beforeUpload: Function,
    // 上传进度钩子
    onProgress: {
      type: Function,
      default () {
        return {}
      }
    },
    // 上传成功钩子
    onSuccess: {
      type: Function,
      default () {
        return {}
      }
    },
    // 上传失败钩子
    onError: {
      type: Function,
      default () {
        return {}
      }
    },
    // 移除文件钩子
    onRemove: {
      type: Function,
      default () {
        return {}
      }
    },
    // 预览文件钩子
    onPreview: {
      type: Function,
      default () {
        return {}
      }
    },
    // 文件大小超出限制钩子
    onExceededSize: {
      type: Function,
      default () {
        return {}
      }
    },
    // 文件格式错误钩子
    onFormatError: {
      type: Function,
      default () {
        return {}
      }
    },
    // 默认文件列表
    defaultFileList: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否支持粘贴上传
    paste: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否支持选择文件夹
    webkitdirectory: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 样式前缀
      prefixCls: prefixCls,
      // 是否拖拽悬停
      dragOver: false,
      // 文件列表
      fileList: [],
      // 临时索引
      tempIndex: 1
    }
  },
  computed: {
    // 上传组件CSS类名
    classes () {
      return [
                    `${prefixCls}`,
                    {
                      [`${prefixCls}-select`]: this.type === 'select',
                      [`${prefixCls}-drag`]: this.type === 'drag',
                      [`${prefixCls}-dragOver`]: this.type === 'drag' && this.dragOver
                    }
      ]
    }

  },
  watch: {
    defaultFileList: {
      immediate: true,
      handler (fileList) {
        this.fileList = fileList.map(item => {
          item.status = 'finished'
          item.percentage = 100
          item.uid = Date.now() + this.tempIndex++
          return item
        })
      }
    }
  },
  methods: {
    // 处理点击事件
    handleClick () {
      if (this.itemDisabled) return
      this.$refs.input.click()
    },
    // 处理文件选择
    handleChange (e) {
      const files = e.target.files

      if (!files) {
        return
      }
      this.uploadFiles(files)
      this.$refs.input.value = null
    },
    // 处理拖拽放置
    onDrop (e) {
      this.dragOver = false
      if (this.itemDisabled) return
      this.uploadFiles(e.dataTransfer.files)
    },
    // 处理粘贴上传
    handlePaste (e) {
      if (this.itemDisabled) return
      if (this.paste) {
        this.uploadFiles(e.clipboardData.files)
      }
    },
    // 上传文件
    uploadFiles (files) {
      let postFiles = Array.prototype.slice.call(files)
      if (!this.multiple) postFiles = postFiles.slice(0, 1)

      if (postFiles.length === 0) return

      postFiles.forEach(file => {
        this.upload(file)
      })
    },
    // 上传单个文件
    upload (file) {
      if (!this.beforeUpload) {
        return this.post(file)
      }

      const before = this.beforeUpload(file)
      if (before && before.then) {
        before.then(processedFile => {
          if (Object.prototype.toString.call(processedFile) === '[object File]') {
            this.post(processedFile)
          } else {
            this.post(file)
          }
        }, () => {
          // this.$emit('cancel', file);
        })
      } else if (before !== false) {
        this.post(file)
      } else {
        // this.$emit('cancel', file);
      }
    },
    // 提交文件
    post (file) {
      // 检查文件格式
      if (this.format.length) {
        const _file_format = file.name.split('.').pop().toLocaleLowerCase()
        const checked = this.format.some(item => item.toLocaleLowerCase() === _file_format)
        if (!checked) {
          this.onFormatError(file, this.fileList)
          return false
        }
      }

      // 检查文件大小
      if (this.maxSize) {
        if (file.size > this.maxSize * 1024) {
          this.onExceededSize(file, this.fileList)
          return false
        }
      }

      this.handleStart(file)
      const formData = new FormData()
      formData.append(this.name, file)

      ajax({
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: file,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.handleProgress(e, file)
        },
        onSuccess: res => {
          this.handleSuccess(res, file)
        },
        onError: (err, response) => {
          this.handleError(err, response, file)
        }
      })
    },
    // 处理开始上传
    handleStart (file) {
      file.uid = Date.now() + this.tempIndex++
      const _file = {
        status: 'uploading',
        name: file.name,
        size: file.size,
        percentage: 0,
        uid: file.uid,
        showProgress: true
      }

      this.fileList.push(_file)
    },
    // 获取文件
    getFile (file) {
      const fileList = this.fileList
      let target
      fileList.every(item => {
        target = file.uid === item.uid ? item : null
        return !target
      })
      return target
    },
    // 处理上传进度
    handleProgress (e, file) {
      const _file = this.getFile(file)
      this.onProgress(e, _file, this.fileList)
      _file.percentage = e.percent || 0
    },
    // 处理上传成功
    handleSuccess (res, file) {
      const _file = this.getFile(file)

      if (_file) {
        _file.status = 'finished'
        _file.response = res

        this.onSuccess(res, _file, this.fileList)
        this.dispatch('FormItem', 'on-form-change', _file)

        setTimeout(() => {
          _file.showProgress = false
        }, 1000)
      }
    },
    // 处理上传错误
    handleError (err, response, file) {
      const _file = this.getFile(file)
      const fileList = this.fileList

      _file.status = 'fail'

      fileList.splice(fileList.indexOf(_file), 1)

      this.onError(err, response, file)
    },
    // 处理移除文件
    handleRemove (file) {
      const fileList = this.fileList
      fileList.splice(fileList.indexOf(file), 1)
      this.onRemove(file, fileList)
    },
    // 处理预览文件
    handlePreview (file) {
      if (file.status === 'finished') {
        this.onPreview(file)
      }
    },
    // 清空文件列表
    clearFiles () {
      this.fileList = []
    }
  }
}
</script>
