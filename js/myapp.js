var myapp = {};
(function(myapp) {
	myapp.getApi = function(url) {
		return "/qt_api/" + url.replace(/^\/+/g, '');
	}
	myapp.openpage = function(url) {
		if ('string' != typeof url || '' == url) {
			return;
		}
		window.parent.location.href = url;
		//window.location.href = url;
	};
	myapp.myAjax = function(options) {
		if (typeof options['url'] == 'undefined') {
			throw "url为空";
		}
		var my_options = {
			async: true,
			dataType: "JSON",
			type: "POST",
			success: function(result) {},
			error: function(error) {
				parent.layer.msg(error);
			}
		}
		if (typeof options != 'undefined') {
			for (var k in options) {
				my_options[k] = options[k];
			}
		}
		return $.ajax(my_options);
	}

	//升级版Ajax方法
	myapp.myAjax1 = function(options, success_callback) {

		if (typeof options != 'undefined') {
			options['url'] = myapp.getApi(options['url']);
			options['success'] = function(result) {
				if (result.status != 0) {
					parent.layer.msg(result.message);
					return;
				}
				if (success_callback) {
					success_callback(result.data);
				}
			}
		}

		return myapp.myAjax(options);
	}
	//封装request headers参数
	var headers = function(options) {
		options.headers = {
			token: myapp.loca_getItem("token"),
			'Content-Type': 'application/json;charset=utf-8'
		}
	};
	//json传参
	myapp.myAjaxJson = function(options) {
		headers(options);
		return myapp.myAjax(options);
	}
	//升级版json传参
	myapp.myAjaxJson1 = function(options, success_callback) {
		headers(options);
		return myapp.myAjax1(options, success_callback);
	}
	//发送验证码
	myapp.sendVC = function(obj, time) {
		$(obj).text(time + "s后发送");
		var timeour = setInterval(function() {
			time--;
			$(obj).text(time + "s后发送");
		}, 1000);
		setTimeout(function() {
			clearInterval(timeour);
			$(obj).text("发送验证码");
			$(obj).removeClass('disabled');
		}, time * 1000);
	}
	/**
	 * 封装存储localStorage，可以设定过期时间
	 * @param {Object} key 存放的key值
	 * @param {Object} val 存放的value值
	 * @param {Object} time 设定的过期时间,单位为秒
	 */
	myapp.loca_setItem = function(key, val, time) {
		if (time) {
			var value = {
				val: val,
				c_time: new Date().getTime(),
				time: time * 1000
			}
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			localStorage.setItem(key, JSON.stringify(val));
		}
	}
	/**
	 * 封装localStorage的getItem函数
	 * @param {Object} key 需要获取的key值
	 */
	myapp.loca_getItem = function(key) {
		if (localStorage.getItem(key)) {
			var val = JSON.parse(localStorage.getItem(key));
			if (val.c_time) {
				var n_time = new Date().getTime();
				if (n_time <= (val.c_time + val.time)) {
					return val.val;
				} else {
					localStorage.removeItem(key);
					return "";
				}
			} else {
				return val;
			}
		} else {
			return "";
		}
	}

	/**
	 * 封装localStorage的removeItem函数
	 * @param {Object} key 需要删除的key值
	 */
	myapp.loca_removeItem = function(key) {
		localStorage.removeItem(key);
	}

	/**
	 * 循环删除key数组
	 * @param {Object} keys 需要删除的key数组
	 */
	myapp.loca_removeItems = function(keys) {
		for (var k in keys) {
			myapp.loca_removeItem(keys[k]);
		}
	}

	//判断是否在前面加0
	function getNow(s) {
		return s < 10 ? '0' + s : s;
	}

	//生成当前时间
	myapp.getNowTime = function() {
		var myDate = new Date();

		var year = myDate.getFullYear(); //获取当前年
		var month = myDate.getMonth() + 1; //获取当前月
		var date = myDate.getDate(); //获取当前日


		var h = myDate.getHours(); //获取当前小时数(0-23)
		var m = myDate.getMinutes(); //获取当前分钟数(0-59)
		var s = myDate.getSeconds();

		var now = year + '-' + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ':' + getNow(m) + ":" + getNow(s);
		return now;
	}
	/* async function getAdmin(){
		console.log(await setAdmin());
		return await setAdmin();
	} */
	//获取url？后面的参数
	myapp.getPathId = function(type) {
		var url = location.search; //获取url中"?"符后的字串 ('?modFlag=business&role=1')
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；
			var strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
			//console.log( theRequest[type] ); //此时的theRequest就是我们需要的参数；
			return theRequest[type];
		}
		return null;
	}
	//获取json长度
	myapp.getJsonObjLength = function(jsonObj) {
		var Length = 0;
		for (var item in jsonObj) {
			Length++;
		}
		return Length;
	}
	//判断字符串为空，且有空格
	myapp.isKong = function(content) {
		if (!(content && !/^\s+$/.test(content))) {
			return true;
		}
		return false;
	}
})(myapp);
