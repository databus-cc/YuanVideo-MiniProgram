// pages/login/login.js
const app = getApp()
Page({
  doLogin: function(e) {
    var formObj = e.detail.value;
    var username = formObj.username;
    var password = formObj.password;

    // simple validate
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 3000
      })
      return;
    }

    var serverUrl = app.serverUrl + "/login/";
    wx.showLoading({
      title: '登录中...',
    })
    wx.request({
      url: serverUrl,
      method: "POST",
      data: {
        username: username,
        password: password
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log("login response: " + res.data);
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
            app.setGlobalUserInfo(res.data.data);
            console.log("Login Done.");
            wx.showToast({
              title: '登录成功',
            });
            wx.navigateTo({
              url: '../mine/mine',
            })
          }
        }
      }
    })
  },

  goRegister: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  }
})