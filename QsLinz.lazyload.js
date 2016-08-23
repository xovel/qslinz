
// 页面纵向滚动时的图片惰性加载函数，本方法未经过严密测试，请慎用
Q.lazyload = function( elems, options ){
	
	if( typeof options === "undefined" ){
		options = elems;
		elems = Q.Q( options.selector || "img" );
	}
	
	// 参数设置转移
	options = Q.extend({
		attr: "original",		// 原有存储的属性
		threshold: 0,			// 预加载的距离
		fade: false,			// 是否渐显
		fades: {},				// 渐显参数
		node: window,			// 滚动触发节点
		trigger: "scroll",		// 触发方式
		placeholder:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"	// 1x1的png
	}, options || {} );
	
	var lazy = [], i, j, k = 0;
	
	//需要进行lazyload的元素
	for( i = 0, j = elems.length; i < j; i++ ){
		if( !isInSight( elems[i] ) ) lazy[k++] = elems[i];
	}
	
	// 初始化
	Q.each( lazy, function(){ lazyInit(this); });
	
	// 事件触发
	Q.on( options.node, options.trigger, lazyCore );
	
	// 主体函数
	function lazyCore(){
		if( k === 0 ){
			// 已经全部加载完毕，则进行事件解除
			Q.unbind( options.node, options.trigger, lazyCore );
			return;
		}
		for(var i = 0,j = lazy.length; i < j; i++ ){
			var obj = lazy[i];
			// 未加载的元素进行加载
			if( obj.getAttribute( "lazyload" ) === "false" ){
				if( isInSight( obj ) ) {
					lazyLoad( obj );
				}
			}
		}
	}
	
	// 私有函数，判定元素是否在可见范围之内
	function isInSight( elem ){
		var clientHeight = document.documentElement.clientHeight,
			clientRect = Q.clientRect( elem ),
			top = clientRect.top,
			bottom = clientHeight - clientRect.bottom;
		return top + options.threshold < 0 || bottom + options.threshold  < 0 ? false : true;
	}
	
	//私有函数，惰性加载的初始化操作
	function lazyInit( elem ){
		var src = elem.src;
		elem.setAttribute( options.attr, src );
		elem.setAttribute( "src", options.placeholder );
		elem.setAttribute( "lazyload", "false" );
	}
	
	//私有函数，惰性加载图片
	function lazyLoad( elem ){
		var src = elem.getAttribute( options.attr );
		elem.src = src;
		elem.setAttribute( "lazyload", "true" );
		elem.removeAttribute( options.attr );
		--k;
		if( options.fade ){ Q.animate( elem, 'opacity', 1); };
	}
};
