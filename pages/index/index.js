import request from "../../utils/request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    personalized: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBannerData()
    this.getPersonalizedData()
  },
  // 获取轮播图数据
  async getBannerData() {
    let bannerData = await request("/banner")
    this.setData({
      banner: bannerData.banners
    })
  },
  // 获取推荐歌单数据
  async getPersonalizedData() {
    let personalizedData = await request("/personalized")

    this.setData({
      personalized: personalizedData.result
    })
  }
})