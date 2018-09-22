//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    totalPage: 1,
    page: 1,
    videoList: [],
    serverUrl: "",
    screenWidth: 350
  },
  onLoad: function(params) {
    var me = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    me.setData({
      screenWidth: screenWidth
    });
    var page = me.data.page;
    var serverUrl = app.serverUrl;

    wx.showLoading({
      title: '请等待，加载中...',
    })

    wx.request({
      url: serverUrl + "/videos/showAll?page=" + page ,
      method: "POST",
      success: function(res) {
        wx.hideLoading();
        console.log(res);
        // 判断当前页是否是第一页，如果是第一页，要清空videoList为空
        if (page == 1) {
          me.setData({videoList: []});
        }
        var curVideoList = me.data.videoList;
        var newVideoList = res.data.data.rows;
        me.setData({
          videoList: curVideoList.concat(newVideoList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });
      }
    })
  }
})
