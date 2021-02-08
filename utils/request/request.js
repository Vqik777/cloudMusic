
// let baseURL="http://localhost:3000"
let baseURL = "https://nicemusic-api.lxhcool.cn"
export default (url, data = {}, method = "GET") => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseURL + url,
            data,
            method,
            success: (result) => {
                resolve(result.data)
            },
            fail: (err) => {
                reject(err)
            },
        });

    })
}