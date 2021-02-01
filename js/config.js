try {
	//配置左上角图标
	$("#logo").text("W.A.Y");
} catch (e) {}
//logo图标地址
var logo_url = "image/icon/logo.png";
//动态加载logo
var loadLogo = function() {
	var link = document.createElement('link');
	link.rel = "shortcut icon";
	// 传参并指定回调执行函数为onBack
	link.href = logo_url;
	link.type = "image/x-icon";
	document.head.appendChild(link);
}
loadLogo();
//动态添加移动端css文件
var mobile_css = function() {
	var link = document.createElement('link');
	link.rel = "stylesheet";
	// 传参并指定回调执行函数为onBack
	link.href = "css/mobile.css";
	document.head.appendChild(link);
}
mobile_css();
//加载导航栏
layui.use('element', function() {
	var element = layui.element;
	//element.progress('blog-user', '30%');
});
//写入用户数据
var user = new Vue({
	el: "#userinfo",
	data: {
		login_show: true,
		user: {}
	}
});
//先获取浏览器缓存里的用户数据
var userinfo = myapp.loca_getItem("userinfo");
if (userinfo) {
	user.$data.login_show = false;
	user.$data.user = userinfo;
}
