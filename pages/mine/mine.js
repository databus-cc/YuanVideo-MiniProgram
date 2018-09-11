// pages/mine/mine.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    faceUrl: "../resources/images/nonface.png",
    isMe: true
  },

  logout: function() {
    console.log("Logging out... ");
    var user = app.userInfo;
    wx.showLoading({
      title: '正在注销...',
    });
    var serverUrl = app.serverUrl + "/logout?userId=" + user.id;
    wx.request({
      url: serverUrl,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();

        if (res.statusCode != 200) {
          wx.showToast({
            icon: 'none',
            title: 'Unknown HTTP response: ' + res.statusCode,
            duration: 3000
          })
          return;
        }
        else if (res.data.status != 200) {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 3000
          })
        }
        else if (res.statusCode == 200 && res.data.status == 200) {
          app.userInfo = null;
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })
  }
})