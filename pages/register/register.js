// pages/register/register.js
const app = getApp()
Page({
  data: {
    
  },
  doRegist: function(e) {
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
    }
    else {
      var serverUrl = app.serverUrl + "/register/";
      console.log("POST " + serverUrl);
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
          var httpStatus = res.statusCode;
          if (httpStatus != 200) {
            wx.showToast({
              title: 'HTTP错误：' + httpStatus,
              icon: "none",
              duration: 3000
            })
          }
          else {
            var status = res.data.status;
            if (status != 200) {
              wx.showToast({
                title: res.data.errMsg,
                icon: "none",
                duration: 3000
              })
            }
            else {
              app.userInfo = res.data.data;
              console.log("userinfo: " + app.userInfo.toString())
              wx.showToast({
                title: '注册成功',
                duration: 3000
              })
            }
          }
          console.log(res);
        }
      })
    }

  }
})