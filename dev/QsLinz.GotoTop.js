
//2014.6.28添加滚动至顶部特效，实现函数为Q.scrollTo
Q.gotoTop = function( options ){
	
	if( Q.B.isIE6 ) return; 			//IE6下该效果禁止
	
	options = Q.extend({
		value: 0,						//滚动最终位置
		speed: 20,						//滚动缓动间隔
		smooth: 10,						//柔和度
		elem: null,						//滚动操作元素
		father: document.body,			//生成追加部位
		callback: null,					//完成回调函数
		bottom: 50,						//对底部的距离
		right: 560,						//居中靠右距离
		zindex: 65535,					//z-index值
		color: "blue",
		hover: "red"
	}, options || {} );
	
	var elem;
	if( !options.elem ){
		elem = document.createElement("div");
		options.father.appendChild( elem );
	} else {
		elem = Q( options.elem ).get(0);
	}
	if( options.value == 0 ) elem.title = "\u81f3\u9876\u90e8"; //至顶部
	
	var qe = Q( elem );	
	if( !options.elem ) qe.css({position:"fixed", zIndex: options.zindex, width: "50px", height: "50px", bottom: options.bottom + "px", right: "50%", marginRight: ( -options.right ) + "px", backgroundColor: options.color, cursor: "pointer" }).hover(function(){Q(this).css({backgroundColor: options.hover});},function(){Q(this).css({backgroundColor: options.color});});	
	qe.click(function(){ Q.scrollTo( options.value, options.speed, options.smooth, options.callback );});	
};

Q.scrollTo = function( value, speed, smooth, fun ){
		
	(function(){
		var top = Q.getScrollTop();
		var dif = top - value;
		
		var move = ( top - value ) / smooth;
		var con = true;
		if( move <= value ){
			move = value;
			con = false;
		}else{
			move = top - move;
			con = true;
		}
		window.scrollTo( 0, move );
		
		if( con ){
			setTimeout( arguments.callee, speed );
		} else {
			if( typeof fun === "function" ) fun();
		};
		
	})();
	
};