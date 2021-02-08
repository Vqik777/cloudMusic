import request from "../../utils/request/request"
let playList = []
let currentPlayIndex = 0
let backAudioManager = wx.getBackgroundAudioManager()
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 背景图
    picUrl: "",
    // 播放状态
    isPlaying: false,
    // 是否同一首歌曲
    isSame: false,
    // 歌词显示隐藏
    isHiddenLyric: true,
    // 歌词
    lyric: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicid = options.musicid
    playList = wx.getStorageSync("playList");
    currentPlayIndex = playList.findIndex(v => v.musicId == musicid)
    this.getMusicDetail(musicid)
  },
  // 获取歌曲详情
  async getMusicDetail(musicid) {
    if (musicid == app.getPlayingMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backAudioManager.stop()
    }
    let songDetail = await request("/song/detail", { ids: musicid })
    // 给全局赋值当前音乐ID
    app.setPlayingMusicId(musicid)
    this.setData({
      picUrl: songDetail.songs[0].al.picUrl
    })
    wx.setNavigationBarTitle({
      title: songDetail.songs[0].name,
    });
    // 获取歌曲URL
    let musicUrlData = await request("/song/url", { id: musicid })
    if (!this.data.isSame) {
      // 给背景音频赋值
      backAudioManager.src = musicUrlData.data[0].url
      backAudioManager.title = songDetail.songs[0].name
      backAudioManager.singer = songDetail.songs[0].ar[0].name
      backAudioManager.coverImgUrl = songDetail.songs[0].al.picUrl
    }
    // 设置播放状态
    this.setData({
      isPlaying: true
    })

    // 获取歌词
    let lyricData = await request("/lyric", { id: musicid })
    let lyric = "暂无歌词"
    let lrc = lyricData.lrc
    if (lrc) {
      lyric = lrc.lyric
    }
    this.setData({
      lyric
    })
  },
  // 切换播放状态
  handleTogglePlayState() {
    if (this.data.isPlaying) {
      backAudioManager.pause()
    } else {
      backAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  // 上一首
  handlePrev() {
    currentPlayIndex--
    if (currentPlayIndex < 0) {
      currentPlayIndex = playList.length - 1
    }
    this.getMusicDetail(playList[currentPlayIndex].musicid)
  },
  // 下一首
  handleNext() {
    currentPlayIndex++
    if (currentPlayIndex > playList.length) {
      currentPlayIndex = 0
    }
    this.getMusicDetail(playList[currentPlayIndex].musicid)
  },
  // 点击封面切换歌词显示隐藏
  handleToggleLyricShow() {
    this.setData({
      isHiddenLyric: !this.data.isHiddenLyric
    })
  },
  // 歌词联动
  timeUpdate(event) {
    this.selectComponent(".lyric").update(event.detail.currentTime)
  },
  onPlay(){
    this.setData({
      isPlaying:true
    })
  },
  onPause(){
    this.setData({
      isPlaying:false
    })
  }
})