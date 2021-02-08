import request from "../../utils/request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImgUrl: "",
    playlistDetail: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let personalizedid = options.personalizedid
    this.getPlaylistDetail(personalizedid)
  },
  // 获取歌单详情数据
  async getPlaylistDetail(personalizedid) {
    let playlistDetailData = await request("/playlist/detail", { id: personalizedid })
    this.setData({
      playlistDetail: playlistDetailData.playlist.tracks,
      coverImgUrl: playlistDetailData.playlist.coverImgUrl
    })
  },
  // 前往播放页
  handleToPlayer(event) {
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

  }
})