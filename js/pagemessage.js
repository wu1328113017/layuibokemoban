var area;
layui.use(['element', 'jquery', 'form', 'layedit', 'flow'], function() {
	var element = layui.element;
	var form = layui.form;
	var $ = layui.jquery;
	var layedit = layui.layedit;
	var flow = layui.flow;
	//留言的编辑器
	var remarkOptions = {
		height: 150,
		tool: ['face'],
	}
	var remarkIndex = layedit.build('remarkEditor', remarkOptions);
	//评论的编辑器
	//先记住参数设置，待会好清空
	var commentOptions = {
		height: 150,
		tool: ['face'],
	}
	var commentIndex = layedit.build('commentEditor', commentOptions);
	//回复的编辑器
	var replyOptions = {
		height: 100,
		tool: ['face'],
	}
	var replyIndex = layedit.build('replyEditor', replyOptions);
	var acceptUserId, acceptUserName, acceptUserImage, commentId;
	var $container = $('#replycontainer');
	//清除富文本
	var clearContainer = function(){
		$container.find("iframe").contents().find("body").html("");
		$(".layui-layedit-iframe").find("iframe").contents().find("body").html("");
	}
	//记忆当前点击过的回复/收起按钮
	var jy;
	var jy_c = function(){
		if(jy){
			jy.click();
		}
	}
	//编辑器的验证
	form.verify({
		//评论的验证
		commentContent: function(value) {
			value = $.trim(layedit.getContent(commentIndex));
			if (value == "") return "请输入内容";
			//验证成功后发表评论
			var data = {
				"articleId": id,
				"articleTitle": doc_container.$data.article.title,
				"content": value
			}
			//获取当前用户
			var userinfo = myapp.loca_getItem("userinfo");
			if (userinfo) {
				data.userName = userinfo.username;
				data.userId = userinfo.id;
				data.userImage = userinfo.headphoto;
			}
			myapp.myAjaxJson1({
				url: "article/publishComment",
				data: JSON.stringify(data)
			}, function(result) {
				clearContainer();
				//commentIndex = layedit.build('commentEditor', commentOptions);
				//动态的将评论内容添加到页面去
				//doc_container.$data.comments.push(th1(result));
				result.replys = [];
				var ds = [];
				ds.push(th1(result));
				Array.prototype.push.apply(ds, doc_container.$data.comments);
				doc_container.$data.comments = ds;
				jy_c();
			});
		},
		//回复的验证
		replyContent: function(value) {
			value = $.trim(layedit.getContent(replyIndex));
			if (value == "") return "请输入内容";
			//先判断是否为匿名用户，匿名用户不能回复
			//获取当前用户
			var userinfo = myapp.loca_getItem("userinfo");
			if (!userinfo) {
				return "匿名用户不能回复评论";
			}
			//验证成功后发表回复
			var data = {
				"articleId": id,
				"articleTitle": doc_container.$data.article.title,
				"content": value,
				"type": 1,
				"acceptUserName": acceptUserName,
				"acceptUserId": acceptUserId,
				"acceptUserImage": acceptUserImage,
				"commentId": commentId,
				"userId": userinfo.id,
				"userImage": userinfo.headphoto,
				"userName": userinfo.username
			}
			myapp.myAjaxJson1({
				url: "article/publishComment",
				data: JSON.stringify(data)
			}, function(result) {
				clearContainer();
				//replyIndex = layedit.build('replyEditor', replyOptions);
				for (var k in doc_container.$data.comments) {
					if (doc_container.$data.comments[k].id == commentId) {
						var dss = [];
						dss.push(th1(result));
						Array.prototype.push.apply(dss, doc_container.$data.comments[k].replys);
						doc_container.$data.comments[k].replys = dss;
						break;
					}
				}
				jy_c();
			})
		},
		//留言的验证
		remarkContent: function(value) {
			value = $.trim(layedit.getContent(remarkIndex));
			if (value == "") return "请输入内容";
			//验证成功后发表留言
			var data = {
				"content": value,
				"type": 2,
				"userId": "1",
				"userName": "匿名用户",
			}
			//获取当前用户
			var userinfo = myapp.loca_getItem("userinfo");
			if (userinfo) {
				data.userName = userinfo.username;
				data.userId = userinfo.id;
				data.userImage = userinfo.headphoto;
			}
			myapp.myAjaxJson1({
				url: "article/publishRemark",
				data: JSON.stringify(data)
			}, function(result) {
				clearContainer();
				//remarkIndex = layedit.build('remarkEditor', remarkOptions);
				//动态的将留言内容添加到页面去
				//doc_container.$data.comments.push(th1(result));
				result.replys = [];
				var ds = [];
				ds.push(th1(result));
				Array.prototype.push.apply(ds, doc_container.$data.comments);
				doc_container.$data.comments = ds;
				jy_c();
			});
		},
		//回复留言
		replyRemarkContent: function(value) {
			value = $.trim(layedit.getContent(replyIndex));
			if (value == "") return "请输入内容";
			//获取当前用户
			var userinfo = myapp.loca_getItem("userinfo");
			//先判断是否为匿名用户，匿名用户不能回复
			if (!userinfo) {
				return "匿名用户不能回复留言";
			}
			//验证成功后发表回复
			var data = {
				"content": value,
				"type": 1,
				"commentId": commentId,
				"userId": userinfo.id,
				"userName": userinfo.username,
				"userImage": userinfo.headphoto,
				"acceptUserName": acceptUserName,
				"acceptUserId": acceptUserId,
				"acceptUserImage": acceptUserImage,
			}
			myapp.myAjaxJson1({
				url: "article/publishComment",
				data: JSON.stringify(data)
			}, function(result) {
				clearContainer();
				//replyIndex = layedit.build('replyEditor', replyOptions);
				for (var k in doc_container.$data.comments) {
					if (doc_container.$data.comments[k].id == commentId) {
						var dss = [];
						dss.push(th1(result));
						Array.prototype.push.apply(dss, doc_container.$data.comments[k].replys);
						doc_container.$data.comments[k].replys = dss;
						break;
					}
				}
				jy_c();
			})
		}
	});
	//回复按钮点击事件
	$(document).on('click', '.btn-reply', function() {
		var h = $(this).parents(".comment-parent").height(),
			c = ".comment-parent",
			s = -30,
			b = 100,
			_this = $(this);
		if (_this.hasClass("reply")) {
			h = $(this).parents(".comment-child").height();
			s = -30;
			b = 90;
			c = ".comment-child";
		}
		if (_this.hasClass("remarkReply")) {
			s = 0;
		}
		acceptUserId = _this.data('userid');
		acceptUserName = _this.data('username');
		acceptUserImage = _this.data('userimage');
		commentId = _this.data('id');
		if (_this.text() == '回复') {
			if(c == ".comment-child"){
				$container.removeClass('bj');
			}else if(c == ".comment-parent"){
				$container.addClass('bj');
			}
			if(jy){
				jy.click();
			}
			jy = _this;
			$container.addClass('layui-hide');
			$container.find('textarea').attr('placeholder', '回复【' + acceptUserName + '】');
			$container.find('input[name="targetUserId"]').val(acceptUserId);
			_this.parents('#message-list').find('.btn-reply').text('回复');
			_this.text('收起');
			var th = h + replyOptions.height + b;
			_this.parents(c).animate({
				height: th + "px"
			}, 100, function() {
				var t = _this.offset().top + s + 'px';
				$container.css({
					top: t
				})
				$container.removeClass('layui-hide');
			});
		} else {
			jy = '';
			$container.addClass('layui-hide');
			$container.find('input[name="targetUserId"]').val(0);
			_this.text('回复');
			h = _this.parents(c).height() - replyOptions.height - b;
			_this.parents(c).animate({
				height: h + "px"
			}, 100);
		}
	});

});
//动态更改样式和文本
$(function() {
	//$(".leavemessage .layui-icon").html('').removeClass("layedit-tool-face");
	/* $(".leavemessage").on("mousemove", ".layui-icon", function() {
		$(this).removeClass("layui-icon-face-smile");
		$(this).addClass("layui-icon-face-surprised");
	}).on("mouseout", ".layui-icon", function() {
		$(this).removeClass("layui-icon-face-surprised");
		$(this).addClass("layui-icon-face-smile");
	}) */
});
