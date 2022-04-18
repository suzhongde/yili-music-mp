const baseUrl = 'https://yili-music-1662738-1309887746.ap-shanghai.run.tcloudbase.com'



export const get = (uri: string) => {
    wx.showLoading({
      title: '加载中'
    })
    
    return new Promise<any>((resolve, reject)=>{
      wx.request({
        url: baseUrl + uri,
        method: 'GET',
        success: (res)=>{
          resolve(res.data)
        },
        fail: reject,
        complete: ()=>{
          wx.hideLoading()
        }
      })
    })
}
