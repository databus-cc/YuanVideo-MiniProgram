// pages/chooseBgm/chooseBgm.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: app.serverUrl,
    bgmList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var me = this;
    me.setData(
      {
        videoParams : options
      });
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

  },

  onUpload: function(e) {
    var me = this;
    var bgmId = e.detail.value.bgmId;
    var desc = e.detail.value.desc;
    console.log("bgmId: " + bgmId);
    console.log("desc: " + desc);
    console.log(me.data.videoParams);
    var duration = me.data.videoParams.duration;
    var height = me.data.videoParams.height;
    var size = me.data.videoParams.size;
    var tempFilePath = me.data.videoParams.tempFilePath;
    var thumbTempFilePath = me.data.videoParams.thumbTempFilePath;
    var width = me.data.videoParams.width;

    var form = {
      userId: app.getGlobalUserInfo().id,
      bgmId: bgmId,
      desc: desc,
      duration: duration,
      height: height,
      size: size,
      width: width
    };
    console.log("form: ");
    console.log(form);
    // 上传短视频
    var succ = false;
    var videoId = "";
    wx.uploadFile({
      url: app.serverUrl + "/videos/",
      formData: form,
      filePath: tempFilePath,
      method: "POST",
      name: 'file',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        console.log("Upload video response: ");
        console.log(res);
        if (res.statusCode != 200) {
          wx.showToast({
            title: '上传失败，HTTP状态码错误-' + res.statusCode,
            icon: 'none',
            duration: 3000
          })
        }
        else {
          var data = JSON.parse(res.data)
          if (data.status != 200) {
            wx.showToast({
              title: '上传失败-' + data.errMsg,
              icon: 'none',
              duration: 3000
            })
          }
          else {
            videoId = data.data;
            succ = true;
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 3000
            });

            wx.showToast({
              title: '视频封面上传中',
            });

            wx.uploadFile({
              url: app.serverUrl + "/videos/uploadCover",
              filePath: thumbTempFilePath,
              name: 'file',
              formData: {
                userId: app.getGlobalUserInfo().id,
                videoId: videoId
              },
              method: "POST",
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                wx.hideLoading();
                console.log("upload cover respnse");
                console.log(res);
                if (res.statusCode != 200) {
                  wx.showToast({
                    title: '上传封面失败, HTTP状态码 - ' + res.statusCode,
                    icon: 'none',
                    duration: 2000
                  });
                }
                else {
                  var data = JSON.parse(res.data);
                  if (data.status != 200) {
                    wx.showToast({
                      title: '上传封面失败-' + data.errMsg,
                      icon: 'none',
                      duration: 2000
                    });
                  }
                  else {
                    wx.showToast({
                      title: '封面上传成功',
                      duration: 2000
                    })
                  }
                }
                
              }
            })
          }
        }
      }
    });

  }
})