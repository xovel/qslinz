//QsLinz.js Tab模拟插件 2014.11.22重构
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