window.onload = function() {
	$(".html_loading").fadeOut(500);
	setTimeout(function(){
		$(".html_loading").remove();
	},500);
};
