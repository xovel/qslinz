//QsLinz.js ������ղ���������ҳ���

// ��ӵ��ղ�����ҳ
Q.extend({
	addFav: function( url, title ){
		if( isIE ){
			//IE�ֱ࣬�����
			window.external.AddFavorite( url, title );
		} else {
			if( window.sidebar || window.chrome ){
				//������߹ȸ����������Ҫ���������ǩ
				alert("�����������֧�ָò�������ʹ��Ctrl+D�ֶ�����.")
			}else{
				//�����������ͨ��ģ����anchor��ʽ����Ҫ��Ӧopera��������ѹ��������
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
					alert("�����������֧�ָò�������ʹ��������˵��ֶ�����.");
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
			url: document.location.href,  //document.location.host ���ڲ���Э��ͷ���ǲ��Ͻ���URL��ַ�� 2014.10.28����
			trigger: "click"
		}, options || {} );
		return this.on( options.trigger, function(){ Q.setHomepage( options.url ); } );
	}
});