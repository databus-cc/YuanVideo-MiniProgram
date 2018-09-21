//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    screenWidth: 350
  },
  onLoad: function(params) {
    var me = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    me.setData({screenWidth: screenWidth});
  }
})
