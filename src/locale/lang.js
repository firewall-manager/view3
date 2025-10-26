/**
 * 语言包注册模块
 * 用于在CDN环境中与vue-i18n配合使用
 */

// 使用vue-i18n在CDN环境中
/*eslint-disable */
// 服务器端标识
const isServer = false;

/**
 * 注册语言包到全局iview对象
 * 在浏览器环境中将语言包注册到window.iview.langs中
 * @param {Object} lang - 语言包对象
 */
export default function (lang) {
    // 只在客户端环境中执行
    if (!isServer) {
        // 检查是否存在全局iview对象
        if (typeof window.iview !== 'undefined') {
            // 如果iview对象中没有langs属性，则创建
            if (!('langs' in iview)) {
                iview.langs = {};
            }
            // 将语言包注册到iview.langs中
            iview.langs[lang.i.locale] = lang;
        }
    }
};
/* eslint-enable */
