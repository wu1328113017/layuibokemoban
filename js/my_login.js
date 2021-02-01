//qq登录
var qqLogin = function() {
	QC.Login.showPopup({
		appId: "101928598",
		redirectURI: "https://www.wayblogs.com/layuibokemoban/qq-redirect.html"
	});
	//触发父窗口的qqUserInterval方法来动态渲染qq用户的信息到页面
	parent.qqUserInterval();
	setTimeout(function() {
		parent.layer.close(parent.l);
	}, 500);
}
//解决浏览器记住账户密码的问题
$("input").attr("readonly", "readonly");
$("input").focus(function() {
	$(this).removeAttr("readonly");
});
$("input").blur(function() {
	$(this).attr("readonly", "readonly");
});
//点击立即注册按钮事件
var openTopRegisterDialog = function() {
	parent.layer.close(parent.l);
	parent.r = parent.layer.open({
		type: 2,
		title: "注册",
		content: "register.html",
		area: ['420px', '620px'],
		offset: '50px'
	})
}
layui.use(['form', 'layedit', 'laydate'], function() {
	var form = layui.form,
		layer = layui.layer;
	form.verify({
		//数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
		pass: [
			/^[\S]{6,12}$/, '请正确输入密码'
		],
		sliderV: function(value) {
			if (value == "false") {
				return "安全验证不通过"
			}
		}
	});
	//提交
	form.on('submit(login-submit)', function(data) {
		//console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
		//console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
		//console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
		//return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		console.log(data);
		var d = {
			username: data.field.username,
			password: data.field.password,
		}
		myapp.myAjax1({
			url: "article/login",
			data: d
		}, function(result) {
			parent.layer.msg("登录成功");
			parent.layer.close(parent.l);
			result.headphoto = result.headphoto == null ? "image/t2.png" : result.headphoto;
			result.type = 1;
			parent.user.$data.user = result;
			parent.user.$data.login_show = false;
			//将用户数据保存进浏览器数据库里
			myapp.loca_setItem("userinfo", result, 2 * 60 * 60);
		})
	});
});
//滑块验证
$('#captcha').sliderCaptcha({
	repeatIcon: 'fa fa-redo',
	setSrc: function() {
		return 'https://picsum.photos/id/' + Math.round(Math.random() * 4) + '/280/157';
	},
	onSuccess: function() {
		parent.layer.msg("验证成功");
		$("#sliderV").val("true");
	}
});
