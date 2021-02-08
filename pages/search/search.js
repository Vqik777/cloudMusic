import request from "../../utils/request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 热门搜索
    hotList: [],
    // 搜索到的数据
    searchList: [],
    // 搜索关键字
    searchKeywords: "",
    // 搜索历史记录
    historyList: []
  },
  params: {
    keywords: "",
    limit: 60
  },
  timeId: -1,
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 获取历史记录
    let historyList = wx.getStorageSync("historyList") || [];
    this.setData({
      historyList
    })
    this.getHotList()
  },
  // 获取热门搜索数据
  async getHotList() {
    let hotListData = await request("/search/hot/detail")
    this.setData({
      hotList: hotListData.data.slice(0, 10)
    })
  },
  // 搜索框内容发生改变的回调
  handleInputChange(event) {
    this.params.keywords = event.detail.value.trim()
    this.setData({
      searchKeywords: event.detail.value.trim()
    })
    clearTimeout(this.timeId)
    this.timeId = setTimeout(() => {
      this.getSeachList()
    }, 300)
  },
  // 获取关键字搜索数据
  async getSeachList() {
    if (!this.params.keywords) {
      this.setData({
        searchList: []
      })
      return
    }
    let searchListData = await request("/search", this.params)
    this.setData({
      searchList: searchListData.result.songs
    })
  },
  // 前往播放页
  handleToPlayer(event) {
    // 历史记录相关
    let { searchKeywords, historyList } = this.data
    let hisToryindex = historyList.findIndex(v => v == searchKeywords)
    if (hisToryindex !== -1) {
      historyList.splice(hisToryindex, 1)
    }
    historyList.unshift(searchKeywords)
    wx.setStorageSync("historyList", historyList);
    // 获取音乐ID
    let { musicid, name } = event.currentTarget.dataset
    // 获取播放列表
    let playList = wx.getStorageSync("playList") || [];
    // 寻找索引
    let index = playList.findIndex(v => v.musicid == musicid)
    if (index == -1) {
      playList.push({ musicid, name })
    } else {
      playList.splice(index, 1)
      playList.push({ musicid, name })
    }
    wx.setStorageSync("playList", playList);
    // 前往播放页
    wx.navigateTo({
      url: `/pages/player/player?musicid=${musicid}`,
    });

  },
  // 清空历史记录
  handleClearHistory() {
    wx.showModal({
      content: '是否清空所有历史记录',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#6d6d6d',
      confirmText: '清空',
      confirmColor: '#6d6d6d',
      success: (result) => {
        if (result.confirm) {
          wx.clearStorageSync("historyList")
          this.setData({
            historyList: []
          })
        }
      }
    });

  },
  // 热门搜索事件
  handleHotItem(event) {
    this.params.keywords = event.currentTarget.dataset.value
    this.setData({
      searchKeywords: event.currentTarget.dataset.value
    })
    this.getSeachList()
  },
  // 点击历史记录事件
  handleHistoryItem(event){
    this.params.keywords = event.currentTarget.dataset.value
    this.setData({
      searchKeywords: event.currentTarget.dataset.value
    })
    this.getSeachList()
  },
  // 点击搜索框X号事件
  handleCancel(){
    this.setData({
      searchList: [],
      searchKeywords: "",
    })
  }
})