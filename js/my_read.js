var id = myapp.getPathId("iy");
var doc_container = new Vue({
	el: "#doc-container",
	data: {
		article: {},
		comments: []
	}
});
myapp.myAjax1({
	url: "/article/queryArticle",
	data: {
		id: id
	}
}, function(result) {
	$("#content").load(result.txtUrl);
	result.year = result.createDate.substring(0, 4);
	result.month = result.createDate.substring(5, 7);
	result.day = result.createDate.substring(8, 10);
	doc_container.$data.article = result;
});
//阅读量加1 10秒后执行，防止刷阅读量
setTimeout(function() {
	myapp.myAjax1({
		url: "article/plusCount",
		data: {
			id: id
		}
	});
}, 10 * 1000);
//点赞,收藏等等点击事件
$("#doc-container .uscp").on('click', 'a', function() {
	if ($(this).hasClass("active1")) {
		return;
	}
	//收藏
	if ($(this).hasClass("collections")) {
		layer.msg("登录后才能收藏或评论！", {
			icon: 5
		});
		return;
	}
	//不是评论就改变文本和样式
	if (!$(this).hasClass("comments")) {
		$(this).addClass("active1");
		$(this).find('span').text('已' + $(this).find("span").text());
	}
	//评论
	if ($(this).hasClass("comments")) {
		$("html").scrollTop($("#message-list").offset().top - ($(".gird-header").height() + 60));
	}
	//点赞
	if ($(this).hasClass("praise")) {
		myapp.myAjax1({
			url: "article/plusPraise",
			data: {
				id: id
			}
		}, function(result) {
			doc_container.$data.article.praise++;
		})
	}
})
//将数据中为null的值替换
var th = function(data, index, length) {
	if (index >= length) {
		return data;
	}
	data[index] = th1(data[index]);
	index++;
	return th(data, index, length);
}
var th1 = function(data) {
	data.userName = data.userName == null ? "匿名用户" : data.userName;
	data.userImage = data.userImage == null ? "http://img.zcool.cn/community/01e60f582e9123a84a0e282b5e8f89.gif" :
		data.userImage;
	data.acceptUserName = data.userName == null ? "匿名用户" : data.acceptUserName;
	data.acceptUserImage = data.acceptUserImage == null ?
		"http://img.zcool.cn/community/01e60f582e9123a84a0e282b5e8f89.gif" : data.acceptUserImage;
	data.isShowCKHF = false;
	if (data.replys != null && data.replys.length > 1) {
		data.isShowCKHF = true;
	}
	if (data.replys) {
		data.replys = th(data.replys, 0, data.replys.length);
	}
	return data;
}
//查看回复/收起回复
$("#doc-container").on('click', '.btn-xsycreply', function() {
	var _this = $(this);
	if (!$('#replycontainer').hasClass("bj")) {
		if (_this.hasClass("s")) {
			if (!$('#replycontainer').hasClass('layui-hide')) {
				$('#replycontainer').addClass('layui-hide');
				$('#replycontainer').addClass('f');
			}
		}
		if (_this.hasClass("c")) {
			if ($('#replycontainer').hasClass('f')) {
				$('#replycontainer').removeClass('layui-hide');
				$('#replycontainer').removeClass('f');
			}
		}
	}
	var id = $(this).data("id");
	for (var k in doc_container.$data.comments) {
		if (id == doc_container.$data.comments[k].id) {
			doc_container.$data.comments[k].isShowCKHF = !doc_container.$data.comments[k].isShowCKHF;
			break;
		}
	}
});
//评论列表改为分页
var pageSize = 10;
layui.use('laypage', function() {
	var laypage = layui.laypage;
	//执行一个laypage实例
	//获取评论列表
	var isP = false,
		total, l;
	myapp.myAjax1({
		url: "article/queryCommentsAndReplys",
		data: {
			id: id,
			pageNo: 1,
			pageSize: pageSize
		}
	}, function(result) {
		doc_container.$data.comments = th(result.data, 0, result.data.length);
		total = result.total;
		isP = true;
	})
	var b = setInterval(function() {
		if (isP) {
			isP = false;
			clearInterval(b);
			laypage.render({
				elem: 'LAY_page1' //注意，这里的 test1 是 ID，不用加 # 号
					,
				count: total //数据总数，从服务端得到
					,
				limit: pageSize,
				jump: function(obj, first) {
					//obj包含了当前分页的所有参数，比如：
					//console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
					//console.log(obj.limit); //得到每页显示的条数
					//console.log(this.count)
					if (!first) {
						myapp.myAjax1({
							url: "article/queryCommentsAndReplys",
							data: {
								id: id,
								pageNo: obj.curr,
								pageSize: pageSize
							}
						}, function(result) {
							doc_container.$data.comments = th(result.data, 0, result.data.length);
							total = result.total;
							isP = true;
						});
						l = setInterval(function() {
							if (isP) {
								isP = false;
								clearInterval(l);
								this.count = total;
							}
						}, 100);
					}
				}
			});
		}
	}, 100);
});
//获取文章下面的评论/回复总数
myapp.myAjax1({
	url: "article/getCommentsAndReplys",
	data: {
		id: id
	}
}, function(result) {
	doc_container.$data.article.comments = result;
})
