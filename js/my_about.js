//个人信息-查看qq，微信
$(".blogerinfo-contact").on("mouseover", "a", function() {
	var _this = $(this);
	var content = '',
		gravity = "top";
	if (_this.hasClass("qq-chat")) {
		content = "<img src='image/page/f4791e4145fde9b59a5914bdf08b075.png' style='width:200px;'>";
		gravity = "right";
	} else if (_this.hasClass("wx-chat")) {
		content = "<img src='image/page/f57d72993b36f26177a37af9b104097.jpg' style='width:200px;'>";
	} else if (_this.hasClass("git-chat")) {
		content = "wu1328113017";
	}
	_this.justToolsTip({
		animation: "moveInTop",
		contents: content,
		gravity: gravity,
	});

});