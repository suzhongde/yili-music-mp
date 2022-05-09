import { getToken, removeToken, setToken } from "../utils/auth"

// const baseUrl = 'https://yili-music-1662738-1309887746.ap-shanghai.run.tcloudbase.com'
const baseUrl = 'http://localhost:8080'

wx.cloud.init()

interface PageableResponseData {
  content: Array<never>
}

export const get = (uri: string, params?:Object) => {
    wx.showLoading({
      title: '加载中'
    })
    
    const header = getToken() ?  {'Authorization': 'Bearer ' + getToken()} : {} 
    return new Promise<PageableResponseData>((resolve, reject)=>{
      wx.request({
        url: baseUrl + uri,
        header,
        data: params,
        method: 'GET',
        success: (res)=>{
          if(res.statusCode === 401) {
            removeToken()
            const currentPages = getCurrentPages()
            const currentRoute = currentPages[currentPages.length - 1].route
            if (currentRoute !== 'pages/login/index') {
              wx.navigateTo({
                url: `/pages/login/index`
              })
            }
            wx.showToast({
              title: '用户未登录',
              icon: 'error'
            })
          }
          resolve(res.data)
        },
        fail: () => {
          wx.showToast({
            title: '请求错误',
            icon: 'error'
          })
          reject
        },
        complete: ()=>{
          wx.hideLoading()
        }
      })
    })
}

export const post = (uri: string, data: object) => {
  wx.showLoading({
    title: '加载中'
  })
  
  return new Promise<Object>((resolve, reject)=>{
    wx.request({
      url: baseUrl + uri,
      method: 'POST',
      data,
      success: (res)=>{
        if(res.statusCode === 401) {
          removeToken()
          const currentPages = getCurrentPages()
          const currentRoute = currentPages[currentPages.length - 1].route
          if ( currentRoute !== 'page/login/index') {
            wx.navigateTo({
              url: `/pages/login/index`
            })
          }
          wx.showToast({
            title: '用户未登录',
            icon: 'error'
          })
        }

        _handleToken(res.header)

        resolve(res.data)
      },
      fail: reject,
      complete: ()=>{
        wx.hideLoading()
      }
    })
  })
}



const _handleToken = (header: any) => {
  // 微信调用远程服务端authorization需要首字母小写-问题为解决
  // const token = header['authorization'] || null
  // 本地服务器(localhost)-Authorization
  const token = header['Authorization'] || null
  if (token && getToken() !== token) {
    setToken(token)
    wx.navigateBack()
  }
}