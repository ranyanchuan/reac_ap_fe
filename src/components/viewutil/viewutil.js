(function(o) {
	//ajax 306 处理
	var until = {
		getParam:function(name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)return  unescape(r[2]); return null;
		},
		getQueryString:function(name){
			return this.getParam(name);
		},
		errorLogin:function(XMLHttpRequest, textStatus, errorThrown){
			if(XMLHttpRequest.status == '306'){
				location.href = '/portal/login.html?r=L3BvcnRhbC8';
			}
		},
		crosser:function(w,h,iframeid){
			var _iframeid = "__url_gadget-site-"+iframeid;
			$("#"+_iframeid).attr({'width':'100%','height':h});
		},
		addRouter:function(path, func) {
			var pos = path.indexOf('/:');
			var truePath = path;
			if (pos != -1)
				truePath = path.substring(0, pos);
			func = func || function() {
					var params = arguments;
					initLayout(contextRoot+'/data:layout' + truePath, params);
				}
			var tmparray = truePath.split("/");
			if (tmparray[1] in router.routes
				&& tmparray[2] in router.routes[tmparray[1]]
				&& tmparray[3] in router.routes[tmparray[1]][tmparray[2]]) {
				return;
			} else {
				router.on(path, func);
				router.on('before',path, function(){
					var design = $("#design");
					if(navigator.userAgent.indexOf("iPad")!=-1||getBrowserVersion()=='IE8'){}
					else {
						design.html('<i class="portalfont icon-personalized"></i>个性化').parent().show();
						design.parent().parent().find('.divider').show();
					}

					design.attr("path",path.replace(/#|\//ig, ''));
				});
				router.on('after',path, function(){
					var design = $("#design");
					if(design.attr("sortalbe") == "true"){
						var r=confirm("有尚未保存的内容,保存吗?");
						if (r==true){
							$("#design").trigger("click");
						}
					}
					design.attr({"path":"","sortalbe":"false"}).parent().hide();
					design.parent().parent().find('.divider').hide();
				});
			}
		},
		registerRouter:function (id, path) {
			var routeInit = function (p) {
				return function () {
					var module = p;
					requirejs.undef(module);
					var content = document.getElementById("content");
					window.require([module], function (module) {
						ko.cleanNode(content);
						content.innerHTML = "";
						module.init(content);
					})
				}
			};
			router.on(id, routeInit(path));
		},
		initLayout:function(p, params) {
			var module = p;
			var load = window.require;
			requirejs.undef(module);
			if (params.length == 1)
				params = params[0]
			load([ module ], function(module) {
				$('#content').html('');
				module.init(params);
			})
		},
		initLayoutTemplate:function(p, params) {
			var module = p;
			var load = window.require;
			requirejs.undef(module);
			load([ module ], function(module) {
				module.init(params);
			})
		},
		rebindView:function(oldViewId,newViewId){
			var idx = -1;
			var layoutRoutes = window.router.routes[oldViewId].on;
			if($.isArray(layoutRoutes)){
				var len = layoutRoutes.length;
				for(var k = 0;k< len;k++ ){
					if(layoutRoutes[k].toString().indexOf("initLayout") != -1){
						idx = k;
					}
				}
				layoutRoutes.splice(idx,0);
			}else{
				window.router.routes[oldViewId].on = [];
			}
			//fix:跳转到新地址
			window.addRouter("/"+oldViewId,function() {
				window.router.setRoute("/"+newViewId)
			});

			window.addRouter("/"+newViewId);

		},
		include:function(html, target) {
			$(target).load(html);
		},
		getBrowserVersion:function () {
			var userAgent = window.navigator.userAgent.toLowerCase();
			var uaMatch = [];
			if (userAgent.match(/msie ([\d.]+)/) != null) {//ie6--ie9
				uaMatch = userAgent.match(/msie ([\d.]+)/);
				return 'IE' + uaMatch[1].match(/\d/);
			} else if
			(userAgent.match(/(trident)\/([\w.]+)/)) {
				uaMatch = userAgent.match(/trident\/([\w.]+)/);
				switch (uaMatch[1]) {
					case "4.0":
						return "IE8";
						break;
					case "5.0":
						return "IE9";
						break;
					case "6.0":
						return "IE10";
						break;
					case "7.0":
						return "IE11";
						break;
					default:
						return "undefined";
				}
			}
			return "undefined";
		},
		/**
		 * 获得小部件信息的默认值
		 * @param id  小部件id
		 * @param key  属性key
		 */
		getWidgetAttr: function (id, key) {
			var res = window.container.service_.cachedMetadatas_;
			var data = {}, obj = {};
			for (var attr in res) {
				var ary = attr.split('?')[1].split('&');
				if (id == ary[0].split('=')[1]) {
					data = res[attr]['userPrefs'];
				}
			}
			if (key) {
				if(data&&data[key]&&data[key]['defaultValue']){
					return obj[key] = data[key]['defaultValue'];
				}
			} else {
				for (var attr in data) {
					obj[attr] = data[attr]['defaultValue'];
				}
				return obj;
			}
		},
		/**
		 * 提示消息
		 * @param msg  提示消息内容(不写则显示默认的操作成功和操作失败)
         * @param type 提示消息类型:成功(success),失败(error),警告(warn),默认success
         * @param time 设置提示消息显示多久后消失，单位毫秒，默认2000毫秒
         */
		message:function(msg,type,time){
			time=time||2000;
			type=type||'success';
			var message=$('body').children('.u-message');
			msg=msg||message.find('span.msg').eq(0).html();
			if(type=='success'){
				message=$('body').children('.u-message.u-mesinfo');
			}else if(type=='error'){
				message=$('body').children('.u-message.u-mesdanger');
			}else if(type=='warn'){
				message=$('body').children('.u-message.u-meswarning');
			}
			message.find('span.msg').eq(0).html(msg);
			message.show();
			message.css('left',($('body').width()-message.find('i').eq(0).width())/2);
			message.width(message.find('i').eq(0).width()+20);
			message.css('opacity',1);
			window.setTimeout(function(){
				message.hide();
				message.css('opacity','0');
			},time);
		},
		/**
		 * 显示等待效果图
		 */
		loadShow:function(){
			$('#uLoadeBack').show();
			$('#uLoad').show();
		},
		/**
		 * 隐藏等待效果图
		 */
		loadHide:function(){
			$('#uLoadeBack').hide();
			$('#uLoad').hide();
		}
	};
	$.extend(o,until);
})(window);
