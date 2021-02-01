//将结果中的url给替换进去
var th = function(data, index, length) {
	if (index >= length) {
		return data;
	}
	data[index].url = "read.html?iy=" + data[index].id;
	index++;
	return th(data, index, length);
}
//文章列表分页
var articles = {
	pageSize: 5,
	dg1: function(data, index, length) {
		if (index >= length) {
			return data;
		}
		if (data[index] != null) {
			data[index].url = "read.html?iy=" + data[index].id;
			data[index].name = data[index].title;
			data[index].category = "IT";
			//data[index].label = data[index].relationCategoryIds == null ? "" : data[index].relationCategoryIds.split(",");
			data[index].image = data[index].image == null ? "https://i04piccdn.sogoucdn.com/582ef69bc9e09c2c" : data[index]
				.image;
			data[index].year = data[index].createDate.substring(0, 4);
			data[index].month = data[index].createDate.substring(5, 7);
			data[index].day = data[index].createDate.substring(8, 10);
			data[index].is_topping = data[index].isTopping == 0 ? false : true;
			data[index].isOriginal = data[index].isOriginal == 0 ? false : true;
			data[index].content = data[index].abstract1;
		}
		index++;
		return this.dg1(data, index, length);
	},
	dg2: function(data, index, length) {
		if (index >= length) {
			return;
		}
		a.$data.article_list.push(data[index]);
		index++;
		this.dg2(data, index, length);
	}
}
//初始化模板
var a = new Vue({
	el: "#doc-container",
	data: {
		article_list: [],
		category_list: [],
		hot_list_article: [],
		topping_articles: [],
		category_list_title: "分类导航",
		hot_list_article_title: "热门文章",
		topping_articles_title: "置顶推荐"
	},
	watch: {
		'article_list': function() { //'article_list'是我要渲染的对象，也就是我要等到它渲染完才能调用函数
			this.$nextTick(function() {
				$("#right-nav").removeClass("hide");
			})
		}
	}
});
//从后台获取置顶文章数据
myapp.myAjax1({
	url: "article/queryToppingArticles",
	type: "GET"
}, function(result) {
	result = th(result, 0, result.length);
	a.$data.topping_articles = result;
});
//从后台获取热门文章数据
myapp.myAjax1({
	url: "article/queryHotArticles",
	type: "GET"
}, function(result) {
	result = th(result, 0, result.length);
	a.$data.hot_list_article = result;
});
//从后台获取数据加载分类导航
myapp.myAjax1({
	url: "article/queryOneLevelCategory",
	type: "GET"
}, function(result) {
	a.$data.category_list = result;
});
//流加载
layui.use('flow', function() {
	var flow = layui.flow;
	//文章列表流加载
	flow.load({
		elem: '#LAY_page1', //流加载容器
		isAuto: false,
		isLazyimg: true,
		done: function(page, next) { //加载下一页
			myapp.myAjax1({
				url: "/article/queryList",
				data: {
					pageNo: page,
					pageSize: articles.pageSize
				}
			}, function(result) {
				result.data = articles.dg1(result.data, 0, result.data.length);
				articles.dg2(result.data, 0, result.data.length);
				next(null, page <= Math.ceil(result.total / articles.pageSize)); //假设总页数为 10
			});
		}
	});
	//开启关闭加载框
	var openLAY_page2 = function() {
		$("#LAY_page1").hide();
		$("#LAY_page2").show();
		$("#LAY_page3").hide();
	}
	var openLAY_page3 = function() {
		$("#LAY_page1").hide();
		$("#LAY_page3").show();
		$("#LAY_page2").hide();
	}
	//分类导航点击事件
	var b = function(id) {
		a.$data.article_list = [];
		openLAY_page2();
		flow.load({
			elem: '#LAY_page2', //流加载容器
			isAuto: false,
			isLazyimg: true,
			done: function(page, next) { //加载下一页
				myapp.myAjax1({
					url: "/article/queryArticlesBOLC",
					data: {
						pageNo: page,
						pageSize: articles.pageSize,
						id: id
					}
				}, function(result) {
					result.data = articles.dg1(result.data, 0, result.data.length);
					articles.dg2(result.data, 0, result.data.length);
					next(null, page <= Math.ceil(result.total / articles.pageSize)); //假设总页数为 10
				});
			}
		});
	}
	//查询分类下的关联文章列表
	var c = function(id) {
		a.$data.article_list = [];
		openLAY_page2();
		flow.load({
			elem: '#LAY_page2', //流加载容器
			isAuto: false,
			isLazyimg: true,
			done: function(page, next) { //加载下一页
				myapp.myAjax1({
					url: "/article/queryArticlesByres",
					data: {
						pageNo: page,
						pageSize: articles.pageSize,
						id: id
					}
				}, function(result) {
					result.data = articles.dg1(result.data, 0, result.data.length);
					articles.dg2(result.data, 0, result.data.length);
					next(null, page <= Math.ceil(result.total / articles.pageSize)); //假设总页数为 10
				});
			}
		});
	}
	$("#category").on('click', 'li', function() {
		if ($(this).hasClass("active")) {
			return;
		}
		$("#category li").removeClass("active");
		$(this).addClass("active")
		var id = $(this).find("a").attr("data-id");
		b(id)
	});
	$("#category1").on('click', 'a', function() {
		if ($(this).hasClass("active")) {
			return;
		}
		$("#category a").removeClass("active");
		$(this).addClass("active")
		var id = $(this).attr("data-id");
		b(id)
	});
	$("#LAY_bloglist").on('click', '.tz', function() {
		var id = $(this).attr("data-id");
		c(id)
	});
	//判断字符串为空，且有空格
	function isKong(content) {
		if (!(content && !/^\s+$/.test(content))) {
			return true;
		}
		return false;
	}
	//搜索
	$("#search_submit").click(function() {
		var name = $("#searchtxt").val();
		a.$data.article_list = [];
		openLAY_page3();
		flow.load({
			elem: '#LAY_page3', //流加载容器
			isAuto: false,
			isLazyimg: true,
			done: function(page, next) { //加载下一页
				myapp.myAjax1({
					url: "/article/likeArticles",
					data: {
						pageNo: page,
						pageSize: articles.pageSize,
						name: name
					}
				}, function(result) {
					result.data = articles.dg1(result.data, 0, result.data.length);
					articles.dg2(result.data, 0, result.data.length);
					next(null, page < Math.ceil(result.total / articles.pageSize)); //假设总页数为 10
				});
			}
		});
	})
});
