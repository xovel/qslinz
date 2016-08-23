//QsLinz.js 的添加收藏与设置首页插件

// 添加到收藏与首页
Q.extend({
	addFav: function( url, title ){
		if( isIE ){
			//IE类，直接添加
			window.external.AddFavorite( url, title );
		} else {
			if( window.sidebar || window.chrome ){
				//火狐或者谷歌浏览器，需要自行添加书签
				alert("您的浏览器不支持该操作，请使用Ctrl+D手动设置.")
			}else{
				//其他浏览器将通过模拟点击anchor方式，主要适应opera浏览器，搜狗浏览器等
				var _a = document.createElement("a");
				_a.href = "javascript:window.external.AddFavorite('" + url + "','" + title + "');";
				_a.click();
			}
		}
	},
	setHomepage: function(pageURL){
		if (document.all) {
			document.body.style.behavior = 'url(#default#homepage)';
			document.body.setHomePage(pageURL);
		} else {
			try { //IE
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			} catch (e) {
				try { //Firefox
					var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
					prefs.setCharPref('browser.startup.homepage', pageURL);
				} catch (e) {
					alert("您的浏览器不支持该操作，请使用浏览器菜单手动设置.");
				}
			}
		}
	}	
});

Q.fn.extend({
	fav: function( options ){
		options = Q.extend({
			url: document.location.href,
			title: document.title,
			trigger: "click"
		}, options || {} );
		return this.on( options.trigger, function(){ Q.addFav( options.url, options.title ); } );
	},
	homepage: function( options ){
		options = Q.extend({
			url: document.location.href,  //document.location.host 由于不带协议头，是不严谨的URL地址。 2014.10.28修正
			trigger: "click"
		}, options || {} );
		return this.on( options.trigger, function(){ Q.setHomepage( options.url ); } );
	}
});