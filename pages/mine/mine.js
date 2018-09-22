// pages/mine/mine.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    faceUrl: "../resources/images/noneface.png",
    isMe: true
  },

  onLoad: function () {
    var me = this;
    var serverUrl = app.serverUrl + "/users/" + app.userInfo.id;
    wx.request({
      url: serverUrl,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("user info get: " + res.data);
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showToast({
            title: 'HTTP错误：' + res.statusCode,
            icon: 'none'
          })
        }
        else {
          if (res.data.status != 200) {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'none'
            })
          }
          else {
            var userInfo = res.data.data;
            console.log("获取成功." + userInfo);
            var imageUrl = '../resources/images/noneface.png';
            if (userInfo.faceImage != null && userInfo.faceImage != '' && userInfo.faceImage != undefined) {
              imageUrl = app.serverUrl + "/face/" + userInfo.faceImage;
            }

            me.setData({
              faceUrl: imageUrl,
              fansCounts: userInfo.fansCounts,
              followCounts: userInfo.followCounts,
              receiveLikeCounts: userInfo.receiveLikeCounts ,
              nickName: userInfo.nickname
            })
          }
        }
      }
    })
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
      dataType: 'json',
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
  },

  uploadVideo: function() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res)
        var duration =  res.duration;
        var height = res.height;
        var size = res.size;
        var tempFilePath = res.tempFilePath;
        var thumbTempFilePath = res.thumbTempFilePath;
        var width = res.width;
        // 超过30分钟
        if (duration > 30 * 60) {
          wx.showToast({
            title: '视频长度不能超过30分钟',
            icon: 'none',
            duration: 3000
          })
        }
        else if (duration < 1) {
          wx.showToast({
            title: '视频时长不足一秒，请重新选择',
            icon: 'none',
            duration: 3000
          })
        }
        else {
          // 打开BGM页面
          wx.navigateTo({
            url: '../chooseBgm/chooseBgm?duration=' + duration 
            + '&height=' + height
            + '&size=' + size
            + '&width=' + width
            + '&tempFilePath=' + tempFilePath
            + '&thumbTempFilePath=' + thumbTempFilePath,
          })
        }
      }
    })
  },
  
  changeFace: function() {
    var me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        // upload image
        wx.showLoading({
          title: '正在上传',
        })
        wx.uploadFile({
          url: app.serverUrl + "/users/uploadFace?userId=" + app.userInfo.id,
          filePath: tempFilePaths[0],
          method: "POST",
          name: 'file',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            wx.hideLoading();
            console.log("Upload face response: " + res.toString());
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
                var imageUrl = app.serverUrl + "/face/" + data.data;
                console.log("imageUrl=" + imageUrl)
                me.setData({
                  faceUrl: imageUrl
                });
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 3000
                })
              }
            }
          },
        })
      },
    })
  }
})