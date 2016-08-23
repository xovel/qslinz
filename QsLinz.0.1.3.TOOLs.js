/*
 * [Qs.zLw QsLinz Javascript Library version 0.1.3]
 * TOOLs
 * Written by xovel.
 */

//QsLinz常用特效。必须先引入QsLinz.js核心部分

/*
 * 元素同一视野内
 * QsLinz.always.js
    @param:first Object/String 第一个操作的元素
    @param:second Object/String 第二个操作的元素
 *  @return:无返回值
 */
Q.always = function( first, second, options ){
	options = Q.extend({
		node: window,						//节点。使用window避免低版本IE下document无法scroll
		trigger: "scroll"					//触发方式。一般为滚动
	}, options || {} );
	
	first = Q( first ).get(0);						//第一个元素
	second = Q( second ).get(0);					//第二个元素
	if( !first || !second ) return;
	
	//
	function _always(){
		var clientHeight = document.documentElement.clientHeight,
			height1 = Q.getSize(first).height,
			height2 = Q.getSize(second).height,
			move = height1 < height2 ? first : second,
			stat = height1 > height2 ? first : second,
			ubound = Math.abs( height1 - height2 ),
			_height = Math.min( height1, height2 );
		
		if( height1 === height2 ) return;
		Q.setStyle( move, { position: "relative" } );
	
		var value = parseFloat( Q.getStyle( move, "top" ) ) || 0,
			rect1 = Q.clientRect( move ),
			rect2 = Q.clientRect( stat ),			
			top1 = rect1.top,									//移动元素的对顶部可视距离
			top2 = rect2.top,									//不动元素的对顶部可视距离
			bottom = clientHeight - rect1.bottom;				//移动元素的对底部可视距离
		
		//移动元素顶部看不见，底部可见
		if( top1 < 0 && bottom > 0 ) value = Math.min( value + bottom, ubound );
		
		//移动元素顶部可见，底部不可见
		if( top1 > 0 && bottom < 0 ) value = top2 >=0 ? 0 : value - top1;
		
		//2013.12.23修正当两列相应元素高度小于窗口高度时滚动元素直接至底部的问题
		if( _height <= clientHeight ){ value = -top2; value = value <= 0 ? 0 : value > ubound ? ubound : value; }
		
		if( value >= 0 && value <= ubound ) Q.setStyle( move, { top: value + "px" } );
	}		
	Q.on( options.node, options.trigger, function(){ _always(); });
};

/*
 * 缓动方法增加
 * QsLinz.easing.js
 */
Q.extend(Q.easing,{
	easeInQuad: function(t,b,c,d){
		return c*(t/=d)*t + b;
	},		
	easeOutQuad: function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (t, b, c, d) {
		return c - Q.easing.easeOutBounce (d-t, 0, c, d) + b;
	},
	easeOutBounce: function (t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (t, b, c, d) {
		if (t < d/2) return Q.easing.easeInBounce (t*2, 0, c, d) * .5 + b;
		return Q.easing.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	},
	//简化的ease方法采用四次方
	easeIn: function(t, b, c, d){ return Q.easing.easeInQuart(t,b,c,d);},
	easeOut: function(t, b, c, d){ return Q.easing.easeOutQuart(t,b,c,d);},
	easeInOut: function(t, b, c, d){ return Q.easing.easeInOutQuart(t,b,c,d);}
});

/*
原AS文件说明

Linear：无缓动效果；
Quadratic：二次方的缓动（t^2）；
Cubic：三次方的缓动（t^3）；
Quartic：四次方的缓动（t^4）；
Quintic：五次方的缓动（t^5）；
Sinusoidal：正弦曲线的缓动（sin(t)）；
Exponential：指数曲线的缓动（2^t）；
Circular：圆形曲线的缓动（sqrt(1-t^2)）；
Elastic：指数衰减的正弦曲线缓动；
Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
Bounce：指数衰减的反弹缓动。
=============================================
easeIn：从0开始加速的缓动；
easeOut：减速到0的缓动；
easeInOut：前半段从0开始加速，后半段减速到0的缓动。

//*/



/*
 * QsLinz.js Tab模拟插件 2014.11.22重构 
 * QsLinz.tabs.js
 */
Q.tabs = function( nav, con, options ){
	if( arguments.length === 1 ){
		options = nav;
	}	
	options = Q.extend( {
		node: document,						//根节点
		nav: nav,							//导航
		con: con,							//内容
		trigger: "mouseover",				//切换的触发方式
		normal: "normal",					//常规类名
		active: "active",					//活动类名
		init: 1,							//初始化显示的元素。为0则不做初始化
		fade: 0,							//切换后的部分渐显开关。数值指定渐显的速度
		keep: true,							//保持切换效果，为false时则在鼠标离开时取消效果
		conc: false,						//内容部分也通过更改类名的方式进行响应
		auto: 0,							//自动切换。数值将指定时间间隔
		start: 100,							//自动切换效果初始化等待时间
		callback: null						//每一个切换效果完成后的回调函数
	}, options||{} );
	
	var 
		//导航节点
		Qn = Q( options.nav, options.node ),
		//内容节点
		Qc = Q( options.con, options.node ),
		//循环变量
		i = 0, j = Qn.size(), k = Qc.size(),
		//内容是否存在或者对称
		bCon = !!( k && j === k ),
		//自动切换相关定时器
		tmr = null;
		
	//如果导航不存在
	if( !j ) return;
	//导航的类名清理
	Qn.removeClass( options.active ).addClass( options.normal );
	//导航类名的初始化
	if( options.init && options.keep ){
		Qn.eq( options.init - 1 ).removeClass( options.normal ).addClass( options.active );
	}
	//内容模块的初始化效果
	if( bCon ){
		options.conc ? Qc.removeClass( options.active ).addClass( options.normal ) : Qc.hide();
		//内容初始化
		if( options.init ){
			options.conc ? Qc.eq( options.init - 1 ).removeClass( options.normal ).addClass( options.active ) : Qc.eq( options.init - 1 ).show();
		}
	}
	//效果切换操作
	function tabs( index ){
		//导航类名处理
		Qn.removeClass( options.active ).addClass( options.normal ).eq( index ).removeClass( options.normal ).addClass( options.active );
		//内容处理
		if( bCon ){
			//显隐的处理
			var oCon = options.conc ? Qc.removeClass( options.active ).addClass( options.normal ).eq( index ).removeClass( options.normal ).addClass( options.active ).get(0) : Qc.hide().eq( index ).show().get(0);
			//元素渐显操作
			if( options.fade ){
				Q.animate( oCon, 'opacity', 1, options.fade, 'linear', null, 0 );
			}
			if( typeof options.callback === "function" ) options.callback.call( oCon, index );
		}
	}
	//导航效果添加
	Qn.on( options.trigger, function(){
		//当前编号获取
		var index = Qn.index(this);
		//如果本身就是这个元素，则什么也不做
		if(Qn.hasClass( options.active, index )) return;
		//进行切换效果的操作
		tabs(index);
	});
	
	//效果保持
	if( !options.keep ){
		Qn.mouseout( function(){ Q( this ).removeClass( options.active ).addClass( options.normal ); Qc.hide(); });
		if( bCon ) Qc.mouseout( function(){ options.conc ? Q(this).removeClass( options.active ).addClass( options.normal ) : Q(this).hide(); });
	}
	
	//自动切换效果实现
	function play(){
		var id = 0;
		//获取自动播放的下一个元素
		for( i = 0; i < j; i++ ){
			if( Qn.hasClass( options.active, i )) id = i + 1;
		}
		//调用下一个切换效果
		tabs( (id+j) % j );
	}
	
	//自动切换效果添加
	if( options.auto ){		
		setTimeout( function(){
			clearInterval(tmr);
			tmr = setInterval( function(){ play(); }, options.auto );
		}, options.start );
		//鼠标悬停与离开的开闭操作
		Qc.hover(
			function(){ clearInterval(tmr); },
			function(){ clearInterval(tmr); tmr = setInterval( function(){ play(); }, options.auto );}
		);
		/*2014.7.11 调整导航部分悬停触发对象为父级元素，避免非块级元素在低版本IE下可能会出现的悬停全局失效*/
		Qn.eq(0).parent().hover( 
			function(){ clearInterval(tmr); },
			function(){ clearInterval(tmr); tmr = setInterval( function(){ play(); }, options.auto );}
		);
	}
};

/*
 * 页面纵向滚动时的图片惰性加载函数，本方法未经过严密测试，请慎用
 * QsLinz.lazyload.js
 */
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

/*
 * QsLinz.js的元素滚动插件 2014.11.22
 * QsLinz.scroll.js
 */
/*
	@param:elem Object 进行滚动操作的元素
	@param:direction String/Number 滚动的方向。1为向上，2为向下，3为向左，4为向右
	@param:speed Number 滚动的速度，距离的倍数，越大滚的越慢
	@param:height Number 强行指定包裹层的高度
*/
Q.scroll = function( elem, direction, speed, width, height ){
	if(!elem) return;
	
	var
		//元素内部的规格
		size = Q.getInnerSize(elem),
		//元素克隆备份
		_elem = elem.cloneNode(true),
		//滚动的速度倍数，越大越慢
		speed = speed || 20,
		//包裹层
		wrap = document.createElement("div"),
		//滚动核心对象
		container = document.createElement("div"),
		//实际元素
		inner = document.createElement("div"),
		//滚动函数集合
		S = {},
		//方向转为数字
		dirArray = { up: 1, top: 1, bottom: 2, down: 2, left: 3, right: 4 },
		//以数字表明的方向
		dir = typeof direciton === "number" ? direction : (dirArray[(direction||"").toLowerCase()] || 1 ),
		//CSS名称
		name = dir === 1 || dir === 2 ? "top" : "left";
	
	//console.log( dir +'@'+ name +'@'+ value+'|'+init + '|'+dir); return new Date()
	
	//生成滚动主体
	Q.clear( elem );
	elem.appendChild(wrap);
	Q.setStyle( wrap, { overflow: "hidden", width: (width || size.width) + "px", height: (height || size.height) + "px", position: "relative" } );
	inner.innerHTML = _elem.innerHTML;
	wrap.appendChild( container );
	container.appendChild( inner );
	Q.setStyle( container, { zoom: 1, position: "relative" });
	if( name === "left") { Q.setStyle(container,"width","65535px"); Q.setStyle(inner,{float:"left"}); }
	
	var
		//重新获取规格
		yize = Q.getSize( container.firstChild ),
		//终值与初值
		vArray = [0,-yize.height,0,-yize.width,0],
		//最终值
		value = vArray[dir],
		//初始值
		init = vArray[dir-1]
	
	container.appendChild(inner.cloneNode(true));
	//生成完毕
	
	S.play = function(){
		//获取初始设置值
		var duration, set = parseFloat( Q.getStyle( container, name ) );
		
		if( isNaN(set) ) set = init;
		
		duration = Math.abs(value - set) * speed
		
		Q.animate( container, name, value, duration, 'linear', function(){
			//本次动画完成，进行善后处理
			Q.setStyle( container, name, init + "px" );
			S.play();
		}, set );
	}
	S.stop = function(){
		Q.stop(container,name);
	}
	S.clear = function(){
		//清除效果
		S.stop();
		elem.parentNode.replaceChild( _elem, elem );
	}
	
	Q(container).hover(S.stop,S.play);
	
	S.play(); //开始播放
	
	return S;
}

/*
 * QsLinz.zpic 图片间隔播放效果
 * QsLinz.zpic.js
 * 如果内部元素宽度不是单次宽度的倍数，则可能会产生一个滚动错位与动画失效的BUG，请避免此问题的出现
 */
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

/*
 * QsLinz 对话框插件
 * QsLinz.Dialog.js
 */
Q.dialog = Q.dialogue = function( options ){
	options = Q.extend({
		drag: true,				//可拖拽
		fadein: 0,				//打开时渐显
		fadeout: 0,				//关闭时渐隐
		top: 200,				//初始高度
		left: 300,				//初始左边距
		width: 600,				//弹窗的宽度
		title: "\u63d0\u793a",	//标题，默认为“提示”
		core: "",				//正文内容
		tip: "",				//提示内容
		confirm: true,			//确认按钮
		onshow: null,			//窗口弹出后执行的函数
		callback: null,			//窗口关闭后执行的函数
		auto: 0,				//自动消失，为0则不消失
		opacity: 0.8,			//背景透明度
		background: "#ccc",		//背景色
		zindex: 99999			//z-index级别
	}, options || {} );
		
	//创建背景
	var bg = document.createElement("div");
	document.body.appendChild( bg );
	
	//设定背景的样式
	Q.setStyle(bg,{position:"absolute",width:"100%",top:"0px",left:"0px",zIndex:(options.zindex-1),backgroundColor:options.background,opacity:options.opacity,height:Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + "px",cursor:"not-allowed"});
	
	//创建主窗体
	var qd = document.createElement("div");
	document.body.appendChild( qd );
	
	//设置主窗体的样式
	Q.setStyle(qd,{position:Q.B.isIE6?"absolute":"fixed",top:options.top+"px",left:options.left+"px",border:"1px solid #ccc",padding:"5px",zIndex:options.zindex,backgroundColor:"#999",width:options.width+"px"});
	
	//创建头部
	var head = document.createElement('div');
	qd.appendChild(head);
	head.style.cssText = 'height: 30px; background-color: blue; line-height: 30px; width: 100%;'
	head.innerHTML = '<h3 style="float: left; color: white; font-size: 14px; text-indent: 1em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 80%;">'+options.title+'</h3>'
	
	//头部关闭按钮
	var off = document.createElement('div');
	head.appendChild(off);
	off.style.cssText = 'float: right; height: 20px; line-height: 20px; font-family: microsoft yahei; margin-right: 5px; margin-top: 5px; color: red; font-weight: bolder; cursor: pointer; width: 20px; background-color: #ccc; text-align: center;'
	off.title = '\u5173\u95ed';
	off.innerHTML = 'X';
	
	//展示正文
	var core = document.createElement('div');
	qd.appendChild(core);
	core.style.cssText = 'background-color: white; padding: 20px;';
	if(options.core.nodeType === 1){core.appendChild(options.core);}else{core.innerHTML = options.core;}
	
	//提示相关
	var tip = document.createElement('div');
	core.appendChild(tip);
	tip.style.cssText='font-size:12px;margin-top:10px;border-top:2px solid #333;';
	tip.innerHTML = options.tip;
	if(!options.tip) tip.style.display="none";
	
	//确定按钮
	if(options.confirm){
		var cfmbox = document.createElement('div');
		qd.appendChild(cfmbox);
		cfmbox.style.cssText='padding: 8px 10px; height: 26px; text-align: right; border-top: 1px solid #ccc;background-color:#F2F2F2;';
		var cfm = document.createElement('button');
		cfmbox.appendChild(cfm);
		cfm.style.cssText='background-color: rgb(0, 102, 204); vertical-align: middle; overflow: hidden; margin-right: 3px; padding: 0px; height: 23px; border: 1px solid rgb(153, 153, 153); cursor: pointer; box-shadow: rgb(229, 229, 229) 0px 1px 0px;';
		cfm.innerHTML = '<strong style="padding: 0px 10px; line-height: 21px; color: white; font-size: 14px; font-family: microsoft yahei;">\u786e\u5b9a</strong>';
	}
	
	//初始化相关
	if( options.fadein ){
		Q.animate(qd,"opacity",1,options.fadein,"linear",options.onshow,0);
	}else{
		if( typeof options.onshow === "function" ) options.onshow.call(qd);
	}
	
	//关闭操作
	function qClose(){
		if( options.fadeout ){
			Q.animate(qd,"opacity",0,options.fadeout,"linear",_close,1);
		} else {
			_close();
		}
	}
	function _close(){
		bg.style.display = "none";
		qd.style.display = "none";
		
		//移除背景和主窗体
		document.body.removeChild(bg);
		document.body.removeChild(qd);
		
		if( typeof options.callback === "function" ){
			options.callback();
		}
	}
	
	//关闭效果侦听
	Q.bind(off,"click",qClose);
	if(options.confirm) Q.bind(cfm,"click",qClose);
	
	//自动关闭效果处理
	if(options.auto){
		var tmcd = parseInt( options.auto, 10 ), _tmrTip = null;
		tip.style.display = "block";
		(function(){
			if( qd.style.display === "none" ){
				clearTimeout( _tmrTip );
				tip.innerHTML = options.tip;
				return; //关闭则直接退出操作
			}
			if( tmcd > 0 ){
				tip.innerHTML = options.tip + "" +  tmcd + "\u79d2\u540e\u5173\u95ed"; //指定秒之后关闭
				--tmcd;
				_tmrTip = setTimeout( arguments.callee, 1000 );
			} else{
				tip.innerHTML = options.tip;
				qClose();
			}			
		})();
	}
	
	//拖拽的实现
	if( options.drag ){
		var dragData = {};		
		head.style.cursor = "move";
		
		head.onmousedown = function( e ){
			try{ dragObj( qd, e, 1 ); }catch(ex){}
		};
	}
	
	//私有函数，拖拽对象
	function dragObj( obj, e, mode ){
		e = e ? e : window.event || arguments.callee.caller.arguments[0];
		switch( mode ){
			case 1:
				dragData.x = e.clientX;
				dragData.y = e.clientY;
				dragData.left = parseInt(qd.style.left,10);
				dragData.top = parseInt(qd.style.top,10);
				head.onmousemove = function(e){ try{ dragObj( qd, e, 2 );}catch(ex){} }
				head.onmouseup = function(e){ try{ dragObj( qd, e, 3 );}catch(ex){} }
				break;
			case 2:
				qd.style.left = (dragData.left  + e.clientX - dragData.x) + 'px';
				qd.style.top = (dragData.top + e.clientY - dragData.y) + 'px';
				_e(e);
				break;
			case 3:
				dragData.x = 0;
				dragData.y = 0;
				head.onmousemove = null;
				head.onmouseup = null;
				break;
		}
	}
	
	//阻止事件的冒泡与默认行为
	function _e(e) {
		if(e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	
		if(e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
		return e;
	}//*/
	
};

// QsLinz.js 0.1.2 遗弃的方法
// 元素包裹相关
Q.extend({
	wrap: function( elem, options ){
		options = Q.extend({ nodeName: "div" }, options || {} );
		var wrapper = document.createElement( options.nodeName );
		elem.parentNode.insertBefore( wrapper, elem.nextSibling );
		wrapper.appendChild( elem );
		delete options.nodeName;
		Q.extend( wrapper, options );
		return wrapper;
	},
	wrapInner: function( elem, options ){
		options = Q.extend({ nodeName: "div" }, options || {} );
		var wrapper = document.createElement( options.nodeName );
		wrapper.innerHTML = elem.innerHTML; // Failed to use childNodes or cloneNode 'cause old-IE does not support it
		Q.html( elem, wrapper );
		delete options.nodeName;
		Q.extend( wrapper, options );
		return elem;
	}
});

Q.fn.extend({
	wrap: function( options ){
		return this.each( function(){ Q.wrap( this, options );});
	},
	wrapInner: function( options ){
		return this.each( function(){ Q.wrapInner( this, options );});
	},
	wrapAll: function( options ){
		if( !this[0] ) return this;
		
		options = Q.extend({ nodeName: "div" }, options || {} );
		
		var wrapper = document.createElement( options.nodeName ), _location = this[0];
		_location.parentNode.insertBefore( wrapper, _location );
		
		delete options.nodeName;
		Q.extend( wrapper, options );
		
		return this.each( function(){ wrapper.appendChild( this ); });
	}
});
