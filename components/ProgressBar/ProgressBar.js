let movableAreaWidth = 0
let movableViewWidth = 0
let backAudioManager = wx.getBackgroundAudioManager();
let duration = 0
// 优化
let currentSec = -1
let isMoveing = false
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00"
    },
    movableDist: 0,
    progress: 0
  },
  lifetimes: {
    ready() {
      if (this.properties.isSame && this.data.showTime.totalTime == "00:00") {
        this.setTime()
      }
      this.getMovableWidth()
      this.bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取movable宽度
    getMovableWidth() {
      let selQuery = this.createSelectorQuery();
      selQuery.select('.movable-area').boundingClientRect()
      selQuery.select('.movable-view').boundingClientRect()
      selQuery.exec((res) => {
        movableAreaWidth = res[0].width
        movableViewWidth = res[1].width
      })
    },
    // 绑定相关音频事件
    bindBGMEvent() {
      backAudioManager.onPlay(() => {
        isMoveing = false
        this.triggerEvent("onPlay")
      })
      backAudioManager.onStop(() => {

      })
      backAudioManager.onPause(() => {
        this.triggerEvent("onPause")
      })
      backAudioManager.onWaiting(() => {

      })
      backAudioManager.onCanplay(() => {
        // 设置总时长
        if (typeof backAudioManager.duration != "undefined") {
          this.setTime()
        } else {
          setTimeout(() => {
            this.setTime()
          }, 1000)
        }
      })
      backAudioManager.onTimeUpdate(() => {
        if (!isMoveing) {
          // 获取总时长
          let duration = backAudioManager.duration
          // 获取当前播放时间
          let currentTime = backAudioManager.currentTime
          // 格式化当前播放时间(用于数据渲染)
          let formatCurrentTime = this.timeFormat(currentTime)
          // movable移动距离
          let movableDist = (movableAreaWidth - movableViewWidth) * currentTime / duration
          // 进度条百分比
          let progress = currentTime / duration * 100
          if (currentSec != currentTime.toString().split(".")[0]) {
            // 数据绑定
            this.setData({
              movableDist,
              progress,
              ['showTime.currentTime']: `${formatCurrentTime.min}:${formatCurrentTime.sec}`
            })
          }
          currentSec = currentTime.toString().split(".")[0]
          // 联动歌词
          this.triggerEvent("timeUpdate", { currentTime })
        }
      })
      backAudioManager.onEnded(() => {
        this.triggerEvent("musicEnd")
      })
    },
    // 设置总时长
    setTime() {
      duration = backAudioManager.duration
      let formatDuration = this.timeFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${formatDuration.min}:${formatDuration.sec}`
      })
    },
    // 时间格式化
    timeFormat(sec) {
      let min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        min: this.parse0(min),
        sec: this.parse0(sec)
      }
    },
    // 补0
    parse0(time) {
      return time < 10 ? '0' + time : time
    },
    // 拖拽事件
    onChange(event) {
      if (event.detail.source == "touch") {
        isMoveing = true
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDist = event.detail.x
      }
    },
    // 拖拽结束
    touchEnd() {
      isMoveing = false
      this.setData({
        progress: this.data.progress,
        movableDist: this.data.movableDist
      })
      backAudioManager.seek(duration * this.data.progress / 100)
    }
  }
})
