//QsLinz.js的元素滚动插件 2014.11.22
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