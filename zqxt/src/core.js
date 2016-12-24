// 倒计时功能
!function ($) {
	$.fn.countDown = function (options) {
		// 设置默认属性
		var settings = {
				"startTime":0,
				"endTime":this.attr('data-end') || 0,
				"nowTime":0,
				"interval":1000,
				"minDigit":true,
				"showDay":true,
				"timeUnitCls":{
					"day":'m-d',
					"hour":'m-h',
					"min":'m-m',
					"sec":'m-s'
				},
				"startTips":'',
				"endTips":'',
				"stopTips":'',
				"timeStamp":true
			},
			opts = $.extend({}, settings, options);

		return this.each(function () {
			var $timer = null,
				$this = $(this),
				$block = $('<span></span>'),
				nowTime,
			// 匹配时间
				startTime = isNaN(opts.startTime) ? (Date.parse(opts.startTime.replace(/-/g, '/')) / 1000) : Math.round(opts.startTime),
				endTime = isNaN(opts.endTime) ? (Date.parse(opts.endTime.replace(/-/g, '/')) / 1000) : Math.round(opts.endTime);

			// 判断当前时间
			nowTime = opts.nowTime === 0 ? Math.round(new Date().getTime() / 1000) : Math.round(opts.nowTime);

			// 补零方法
			function addZero(isAdd, time) {
				if (!isAdd) return time;
				else return time < 10 ? time = '0' + time : time;
			}

			// 天、时、分、秒
			var timeStamp = {"day":'', "hour":'', "min":'', "sec":''};
			if (opts.timeStamp) timeStamp = {"day":'天', "hour":'时', "min":'分', "sec":'秒'};

			(function remainTime() {
				var time = {},
					seconds,
					word = '';

				// 获取需要计时的毫秒数
				seconds = nowTime < startTime ? startTime - nowTime : endTime - nowTime;
				$this.html('');

				// 是否显示天数
				if (opts.showDay) {
					time.day = addZero(opts.minDigit, Math.floor(seconds / 3600 / 24));
					time.hour = addZero(opts.minDigit, Math.floor(seconds / 3600 % 24));
				} else {
					time.hour = addZero(opts.minDigit, Math.floor(seconds / 3600));
				}
				time.min = addZero(opts.minDigit, Math.floor(seconds / 60 % 60));
				time.sec = addZero(opts.minDigit, Math.floor(seconds % 60));

				// 活动开始倒计时
				if (nowTime < startTime) {
					if (opts.startTips) word = opts.startTips;
				} else {
					// 活动结束倒计时
					if (endTime > nowTime) {
						if (opts.endTips) word = opts.endTips;
					}// 倒计时停止
					else {
						if (opts.stopTips) {
							word = opts.stopTips;
							$this.html(word);
						} else {

							for (var i in time) {
								if (i == 'day' && !opts.showDay) continue;
								time[i] = 0;  // 时间置0
								$block.clone().addClass(opts.timeUnitCls[i]).text(time[i] + timeStamp[i]).appendTo($this);
							}
						}
						clearTimeout($timer);
						return false;
					}
				}

				// 写入
				$this.html(word);
				for (var i in time) {
					if (i == 'day' && !opts.showDay) continue;
					$block.clone().addClass(opts.timeUnitCls[i]).text(time[i] + timeStamp[i]).appendTo($this);
				}

				// 累加时间
				nowTime = nowTime + opts.interval / 1000;

				// 循环调用
				$timer = setTimeout(function () {
					remainTime();
					// 抓取签到数据
					getqiandao()
				}, opts.interval);
			})();
		});
	}
}(jQuery);


// 抓取签到函数
function getqiandao(){
	$.getJSON('/index.php?s=/article/sub/id/14.html', function(data) {
		// 更新公司名字
		$("#user-gs").text(data.user_gs);
		// 更新职务
		$("#user_zw").text(data.user_zw);
		// 更新名字
		$("#user_name").text(data.user_name);
		// 更新全部签到人数
		$("#allqiandao").text(data.allqiandao);
	});
}

$(function(){
	// 倒计时开始
	$('#totime').countDown({
			//开始时间 
		        "startTime":'2014/02/20 18:00:00',
		        // 结束时间
		        "endTime":'2014/03/16 18:00:00'
		});
});
