//app.js
App({
  serverUrl: "http://127.0.0.1:8080",
  userInfo: null,

  setGlobalUserInfo: function(user) {
    wx.setStorageSync('userInfo', user);
  },

  getGlobalUserInfo: function() {
    return wx.getStorageSync('userInfo');
  }
})