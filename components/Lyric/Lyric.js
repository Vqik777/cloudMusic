let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHiddenLyric: {
      type: Boolean,
      value: true
    },
    lyric: String
  },
  observers: {
    lyric(lyric) {
      if (lyric == "暂无歌词") {
        this.setData({
          lyricList: [{
            lyric: "暂无歌词",
            time: 0
          }],
          currentLyricIndex: -1
        })
      } else {
        this.parseLyric(lyric)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lyricList: [],
    currentLyricIndex: -1,
    scrollTop: 0
  },
  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success: (result) => {
          lyricHeight = (result.screenWidth / 750) * 64
        }
      });

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 歌词解析
    parseLyric(strLyric) {
      let line = strLyric.split("\n")
      let lyricList = []
      line.forEach(v => {
        let time = v.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = v.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 把时间转换成秒
          let timeSec = timeReg[1] * 60 + parseInt(timeReg[2]) + timeReg[3] / 1000
          lyricList.push({
            time: timeSec,
            lyric: lrc
          })
        }
      })
      this.setData({
        lyricList
      })
    },
    update(currentTime) {
      let lyricList = this.data.lyricList
      if (lyricList.length == 0) {
        return
      }
      if (currentTime > lyricList[lyricList.length - 1].time) {
        if (this.data.currentLyricIndex != -1) {
          this.setData({
            currentLyricIndex: -1,
            scrollTop: lyricList.length * lyricHeight
          })
        }
      }
      for (let index = 0; index < lyricList.length; index++) {
        if (currentTime <= lyricList[index].time) {
          this.setData({
            currentLyricIndex: index - 1,
            scrollTop: (index - 1) * lyricHeight
          })
          break
        }
      }
    }
  }
})
