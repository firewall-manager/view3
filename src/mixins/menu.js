/**
 * 菜单混入模块
 * 提供菜单组件相关的功能，包括父菜单查找、子菜单层级计算等
 */

import { findComponentUpward, findComponentsUpward } from '../utils/assist'

export default {
  data () {
    return {
      // 查找并缓存父级Menu组件
      menu: findComponentUpward(this, 'Menu')
    }
  },
  computed: {
    /**
     * 是否有父级子菜单
     * @returns {boolean} 是否存在父级Submenu组件
     */
    hasParentSubmenu () {
      return !!findComponentUpward(this, 'Submenu')
    },
    
    /**
     * 父级子菜单数量
     * @returns {number} 父级Submenu组件数量
     */
    parentSubmenuNum () {
      return findComponentsUpward(this, 'Submenu').length
    },
    
    /**
     * 菜单模式
     * @returns {string} 菜单模式（horizontal、vertical等）
     */
    mode () {
      return this.menu.mode
    }
  }
}
