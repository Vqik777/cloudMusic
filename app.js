App({
    globalData: {
        playingMusicId: -1
    },
    setPlayingMusicId(id) {
        this.globalData.playingMusicId = id
    },
    getPlayingMusicId() {
        return this.globalData.playingMusicId
    }
})