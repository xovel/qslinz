
// 元素同一视野内
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
		var clientHeight = docElem.clientHeight,
			height1 = Q.getSize(first).height,
			height2 = Q.getSize(second).height,
			move = height1 < height2 ? first : second,
			stat = height1 > height2 ? first : second,
			ubound = Math.abs( height1 - height2 );
			_height = Math.min( height1, height2 );
		
		if( height1 === height2 ) return;
		Q.setStyle( move, { position: "relative" } );
	
		var value = gw( move, "top" ),
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