//点击登录按钮
var l, r;
$("#login-btn").click(function() {
	l = layer.open({
		type: 2,
		title: "登录",
		content: "login.html",
		area: ['420px', '650px'],
		offset: '50px'
	})
})
//用户退出
var user_out = function() {
	var l = layer.confirm("确定要退出吗？", {
		icon: 3,
		title: '提示'
	}, function() {
		myapp.loca_removeItem("userinfo");
		user.$data.login_show = true;
		layer.close(l);
		layer.msg("用户退出成功");
	})
}
//修改信息
var u;
var update_userinfo = function() {
	u = layer.open({
		type: 2,
		content: "update-userinfo.html?iy=" + userinfo.id,
		title: "修改用户信息",
		area: ['420px', '620px'],
		offset: '50px'
	})
}
//更换头像
var sh;
var setHeadphoto = function() {
	sh = layer.open({
		type: 2,
		content: "set-headphoto.html?iy=" + userinfo.id,
		title: "更换头像",
		area: ['520px', '360px'],
		offset: '100px'
	})
}

//等待qq登录然后循环获取userinfo的信息来渲染到页面上
var qqUserInterval = function() {
	var t = setInterval(function() {
		if (myapp.loca_getItem("userinfo")) {
			user.$data.login_show = false;
			user.$data.user = myapp.loca_getItem("userinfo");
			clearInterval(t);
		}
	}, 1000);
}
