//QsLinz.zpic 图片间隔播放效果
//如果内部元素宽度不是单次宽度的倍数，则可能会产生一个滚动错位与动画失效的BUG，请避免此问题的出现
Q.zpic = function( elem, options ){
	options = Q.extend({
		prev: null,								//上一个
		next: null,								//下一个
		width: 0,								//总宽度
		height: 0,								//总高度
		page: 0,								//切换的单元距离
		easing: 'easeOutCirc',					//切换的缓动方式
		duration: 300,							//缓动持续时间
		auto: 3000,								//自动播放的时间间隔
		init: 500								//自动播放效果初始等待时间
	}, options||{} );
	
	var
		//元素内部的规格
		size = Q.getInnerSize(elem),
		//元素克隆备份
		_elem = elem.cloneNode(true),
		//包裹层
		wrap = document.createElement("div"),
		//滚动核心对象
		container = document.createElement("div"),
		//实际元素
		inner = document.createElement("div"),
		//操作函数
		S = {},
		//自动播放定时器
		tmr = null;
	
	//生成滚动主体
	Q.clear( elem );
	elem.appendChild(wrap);
	Q.setStyle( wrap, { overflow: "hidden", width: (options.width || size.width) + "px", height: (options.height || size.height) + "px", position: "relative" } );
	inner.innerHTML = _elem.innerHTML;
	wrap.appendChild( container );
	container.appendChild( inner );
	Q.setStyle( container, { zoom: 1, position: "relative" });
	Q.setStyle(container,"width","65535px");
	Q.setStyle(inner,{float:"left"});
	
	size = Q.getSize(inner); 	//重新获取内部元素规格
	
	container.appendChild(inner.cloneNode(true));
	//生成完毕
	
	S.play = function(v){		
		if(S.s==="ing") return;		//上一个动画进行之中则什么也不做
		v = v === -1 ? -1 : 1;		
		var nLeft = parseFloat(Q.getStyle(container,"left"))||0;
		
		//实现无缝循环
		if( v=== -1 && nLeft >= 0){nLeft = -size.width;}
		if( v===1 && Math.abs(nLeft) >= size.width ) {nLeft = 0} 
		
		//设置标志并执行动画效果
		S.s = "ing";	
		Q.animate( container, "left", nLeft - v * options.page, options.duration, options.easing, function(){S.s="done";}, nLeft );
		
	}
	
	//自动播放相关
	if(options.auto){
		setTimeout(function(){tmr = setInterval( S.play, options.auto );}, options.init);
		Q(container).hover(function(){
			clearTimeout(tmr);
		},function(){
			clearTimeout(tmr);
			tmr = setInterval( S.play, options.auto );
		});
	}
	
	//上一个下一个事件绑定
	Q.bind(options.prev,"click",function(){clearTimeout(tmr);S.play(-1);if(options.auto){tmr=setInterval(S.play,options.auto);}});
	Q.bind(options.next,"click",function(){clearTimeout(tmr);S.play();if(options.auto){tmr=setInterval(S.play,options.auto);}});
		
	//清除效果
	S.clear = function(){clearTimeout(tmr);Q.stop(container,"left");elem.parentNode.replaceChild( _elem, elem );};
	return S;  //to min: return语句前必须进行截断，类似break 2014.12.4
}
