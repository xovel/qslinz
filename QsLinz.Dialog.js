//QsLinz 对话框插件
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
	Q.setStyle(bg,{position:"absolute",width:"100%",top:"0px",left:"0px",zIndex:(options.zindex-1),backgroundColor:options.background,opacity:options.opacity,height:Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + "px"});
	
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
