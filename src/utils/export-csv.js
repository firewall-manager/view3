/**
 * CSV导出工具模块
 * 提供跨浏览器兼容的CSV文件下载功能
 */

/**
 * 检测浏览器类型和版本
 * @param {string} browser - 浏览器名称
 * @returns {boolean|number} 如果是IE返回版本号，其他浏览器返回布尔值
 */
function has (browser) {
  const ua = navigator.userAgent
  if (browser === 'ie') {
    // 检测IE浏览器
    const isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1
    if (isIE) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(ua)
      return parseFloat(RegExp.$1)
    } else {
      return false
    }
  } else {
    // 检测其他浏览器
    return ua.indexOf(browser) > -1
  }
}

const csv = {
  /**
   * 检测是否为IE11浏览器
   * @returns {boolean} 是否为IE11
   */
  _isIE11 () {
    let iev = 0
    const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
    const trident = !!navigator.userAgent.match(/Trident\/7.0/)
    const rv = navigator.userAgent.indexOf('rv:11.0')

    if (ieold) {
      iev = Number(RegExp.$1)
    }
    if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
      iev = 10
    }
    if (trident && rv !== -1) {
      iev = 11
    }

    return iev === 11
  },

  /**
   * 检测是否为Edge浏览器
   * @returns {boolean} 是否为Edge
   */
  _isEdge () {
    return /Edge/.test(navigator.userAgent)
  },

  /**
   * 获取下载URL
   * @param {string} text - CSV文本内容
   * @returns {string} 下载URL
   */
  _getDownloadUrl (text) {
    const BOM = '\uFEFF'
    // 为Excel正确打开添加BOM
    if (window.Blob && window.URL && window.URL.createObjectURL) {
      const csvData = new Blob([BOM + text], { type: 'text/csv' })
      return URL.createObjectURL(csvData)
    } else {
      return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text)
    }
  },

  /**
   * 下载CSV文件
   * 根据不同的浏览器使用不同的下载方式
   * @param {string} filename - 文件名
   * @param {string} text - CSV文本内容
   */
  download (filename, text) {
    if (has('ie') && has('ie') < 10) {
      // IE9及以下版本：使用execCommand方式
      // has模块无法识别ie11和Edge
      const oWin = window.top.open('about:blank', '_blank')
      oWin.document.charset = 'utf-8'
      oWin.document.write(text)
      oWin.document.close()
      oWin.document.execCommand('SaveAs', filename)
      oWin.close()
    } else if (has('ie') === 10 || this._isIE11() || this._isEdge()) {
      // IE10/11和Edge：使用msSaveBlob方式
      const BOM = '\uFEFF'
      const csvData = new Blob([BOM + text], { type: 'text/csv' })
      navigator.msSaveBlob(csvData, filename)
    } else {
      // 现代浏览器：使用a标签下载
      const link = document.createElement('a')
      link.download = filename
      link.href = this._getDownloadUrl(text)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

export default csv
