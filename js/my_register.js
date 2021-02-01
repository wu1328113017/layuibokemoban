//解决浏览器记住账户密码的问题
$("input").attr("readonly", "readonly");
$("input").focus(function() {
	$(this).removeAttr("readonly");
});
$("input").blur(function() {
	$(this).attr("readonly", "readonly");
});
layui.use(['form', 'layedit', 'laydate'], function() {
	var form = layui.form,
		layer = layui.layer;
	form.verify({
		//数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
		pass: [
			/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
		],
		confirmPass: function(value) { //value：表单的值、item：表单的DOM对象
			var p = form.val("text");
			if (value != p.userpwd) {
				return "两次输入的密码不一致"
			}
		},
		sliderV: function(value) {
			if (value == "false") {
				return "安全验证不通过"
			}
		}
	});
	//提交
	form.on('submit(reg)', function(data) {
		//console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
		//console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
		//console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
		//return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		//console.log(data);
		var d = {
			username: data.field.username,
			password: data.field.userpwd,
			email: data.field.email,
			gender: data.field.sex,
			headphoto: "image/t2.png"
		}
		myapp.myAjaxJson1({
			url: "article/register",
			data: JSON.stringify(d)
		}, function(result) {
			parent.layer.msg("注册成功");
		})
	});
});
//点击返回登录事件
var openTopLoginDialog = function() {
	parent.layer.close(parent.r);
	parent.l = parent.layer.open({
		type: 2,
		title: "登录",
		content: "login.html",
		area: ['420px', '650px'],
		offset: '50px'
	})
}
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
