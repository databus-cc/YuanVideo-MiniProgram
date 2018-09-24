//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    // 用于分页的数据
    totalPage: 1,
    page: 1,
    videoList: [],
    serverUrl: "",
    screenWidth: 350
  },

  getAllVideosList: function (page) {
    var me = this;
    var serverUrl = app.serverUrl;

    wx.showLoading({
      title: '请等待，加载中...',
    })

    wx.request({
      url: serverUrl + "/videos/showAll?page=" + page,
      method: "POST",
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        // 判断当前页是否是第一页，如果是第一页，要清空videoList为空
        if (page == 1) {
          me.setData({ videoList: [] });
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
  },

  onLoad: function (params) {
    var me = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    me.setData({
      screenWidth: screenWidth
    });
    var page = me.data.page;
    me.getAllVideosList(page);
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    var me = this;
    // re-get the first page
    me.getAllVideosList(1);
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {
    var me = this;
    var currentPage = me.data.page;
    var totalpage = me.data.totalPage;
    // 判断是否已经是最后一页
    if (currentPage == totalpage) {
      wx.showToast({
        title: '已经没有视频了~~',
        icon: 'none'
      });
      return;
    }

    var page = currentPage + 1;
    me.getAllVideosList(page);
  },
})
