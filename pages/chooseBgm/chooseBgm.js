// pages/chooseBgm/chooseBgm.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: app.serverUrl,
    bgmList: [],
    // poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    // src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    wx.showLoading({
      title: '请等待...',
    });
    var serverUrl = app.serverUrl + "/bgm/";
    wx.request({
      url: serverUrl,
      method: "GET",
      header: {
        'content-type':'application/json'
      },
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showToast({
            title: 'HTTP请求错误 - ' + res.statusCode,
            icon: 'none',
            duration: 2000
          });
        }
        else if (res.data.status != 200) {
          wx.showToast({
            title: '请求失败-' + res.data.errMsg,
            icon: 'none',
            duration: 3000
          })
        }
        else {
          var bgmList = res.data.data;
          me.setData ({
            bgmList: bgmList
          }); 
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})