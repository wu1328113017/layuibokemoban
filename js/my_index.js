$(".wow").hide();
setTimeout(function() {
	$(".wow").show();
}, 500);
//显示模块(平滑效果)
$("#show").on("click", "a", function() {
	if ($(this).hasClass("active")) {
		return;
	}
	var id = $(this).data("id");
	var p_id = $("#show").find(".active").data("id");
	var index = $(this).data("index");
	var p_index = $("#show").find(".active").data("index");
	if (index > p_index) {
		$("#" + p_id).animate({
			"left": "-100%"
		}, 500, function() {
			$(this).hide();
			$("#" + id).css("position", "relative");
			$(this).css("position", "absolute");
		});
		$("#" + id).show().animate({
			"left": 0,
		}, 500);
	} else {
		$("#" + p_id).animate({
			"left": "100%"
		}, 500, function() {
			$(this).hide();
			$("#" + id).css("position", "relative");
			$(this).css("position", "absolute");
		});
		$("#" + id).show().animate({
			"left": 0,
		}, 500);
	}
	if (id != 'section1') {
		$(".gird-header").removeClass("gird-header1");
	} else {
		$(".gird-header").addClass("gird-header1");
	}

	$("#show").find("a").removeClass("active");
	$(this).addClass("active");
});
//画布
/* var c = document.getElementById("myCanvas");
$("#myCanvas").attr("width", $(".gird-header").width());
$("#myCanvas").attr("height", $(".gird-header").height());
var ctx = c.getContext("2d");
var zd1 = $("#myCanvas").attr("width"),
	zd2 = $("#myCanvas").attr("height");
var index1 = 0,
	index2 = 0;
var ct; */
//鼠标移动到头部导航上的动画效果
/* $(".gird-header1").hover(function() {
	clearInterval(ct)
	ctx.strokeStyle = "#6bc30d";
	ct = setInterval(function() {
		if (index1 < zd1) {
			index1++;
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.lineCap = "butt";
			ctx.moveTo(index1-1, 0);
			ctx.lineTo(index1, 0);
			ctx.stroke();
		} else if (index2 < zd2) {
			index2++;
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.lineCap = "butt";
			ctx.moveTo(zd1, index2-1);
			ctx.lineTo(zd1, index2);
			ctx.stroke();
		} else if (zd1 > 0) {
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.lineCap = "butt";
			ctx.moveTo(zd1, zd2);
			ctx.lineTo(zd1-1, zd2);
			ctx.stroke();
			zd1--;
		} else if (zd2 > 0) {
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.lineCap = "butt";
			ctx.moveTo(zd1, zd2);
			ctx.lineTo(zd1, zd2-1);
			ctx.stroke();
			zd2--;
		} else {
			clearInterval(ct)
		}
	}, 0.01);
}, function() {
	clearInterval(ct)
	ct = setInterval(function() {
		if(zd2<index2){
			ctx.clearRect(0,0,1,zd2);
			zd2 ++;
		}else
		if(zd1<index1){
			ctx.clearRect(0,zd2-1,zd1,1);
			zd1 ++;
		}else
		if(index2>0){
			ctx.clearRect(zd1-1,index2,1,index2);
			index2--;
		}else
		if (index1 > 0) {
			index1--;
			ctx.clearRect(index1,0,index1,1);
		} else {
			clearInterval(ct)
		}
	}, 0.01);
}); */
