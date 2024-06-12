import { isH5 } from '@uni-helper/uni-env'

export const appName = 'vite-uniapp-template'

// 项目主题色
export const primaryColor = '#028d71'

// 是否开启代理
export const useProxy = isH5
// 代理路径
export const proxyPath = '/proxy'
// 代理端口号
export const proxyPort = 1996
// 是否开启加密
export const useEncrypt = false
// 是否使用远程导航菜单
export const useRemoteMenu = true

// 企业信息
export const enterpriseInfo = {
  name: '鲸禾科技有限公司',
  address: '湖北省武汉市',
}

// 主页面路径
export const homePage = 'pages/index/home/index'
