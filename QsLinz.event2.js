 //*/

//2015.5.28 构造Q.event对象相关
// 事件处理
Q.event = {}

var eventHooks = Q.event.hook = {}

//IE下事件修正
Q.event.fixIE = function(event){
	event = event || window.event;
    var ret = {}
    for (var i in event) {
        ret[i] = event[i]
    }
    var target = ret.target = event.srcElement
    if (event.type.indexOf("key") === 0) {
        ret.which = event.charCode != null ? event.charCode : event.keyCode
    } else if (/mouse|click/.test(event.type)) {
        var doc = target.ownerDocument || document
        var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement
        ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
        ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
        ret.wheelDeltaY = ret.wheelDelta
        ret.wheelDeltaX = 0
    }
    ret.timeStamp = new Date - 0
    ret.originalEvent = event
    ret.preventDefault = function() { //阻止默认行为
        event.returnValue = false
    }
    ret.stopPropagation = function() { //阻止事件在DOM树中的传播
        event.cancelBubble = true
    }
    return ret
}

var contains = Q.contains = function(parentNode, childNode){
	if (parentNode.contains) {
		return parentNode != childNode && parentNode.contains(childNode);
	} else {
		return !!(parentNode.compareDocumentPosition(childNode) & 16);
	}
}

var isOver = function(target,e){
	e = e || window.event || arguments.callee.caller.arguments[0];
	if(e.type.toLowerCase()==="mouseover"){
		return !contains(target,e.relatedTarget||e.fromElement) && !((e.relatedTarget||e.fromElement)===target);
	} else {
		return !contains(target,e.relatedTarget||e.toElement) && !((e.relatedTarget||e.toElement)===target);
	}
}

// 修正mouseenter, mouseleave
Q.each({
	mouseenter: 'mouseover',
	mouseleave: 'mouseout'
}, function( origType, fixType ){
	eventHooks[ origType ] = {
		type: fixType,
		handle: function(elem, fn) {
			return function(e){
				if( isOver( elem ) )
					fn.call( this, e );
			}
		},
		test: function(){
		}
	}
});

Q.extend( Q.event, {
	/**
	 * 事件绑定相关，代码由原版QsLinz更改而来
	 */
	bind: function( elem, type, fn, useCapture ){
		if( !elem || Q.type(fn) !== "function" ) return;
		var hook = eventHooks[type];
		if (typeof hook === "object") {
			type = hook.type
			if (hook.handler) {
				fn = hook.handle(elem, fn);
			}
		}
		
        if( elem.addEventListener ){
			elem.addEventListener( type, fn, !!useCapture );
		}else if( elem.attachEvent ){
			elem.attachEvent( "on" + type, function(e){ fn.call( elem, Q.event.fixIE(e) ) } );
		}else{
			elem[ "on" + type ] = fn;
		}
        return fn;
	},
	/**
	 * 事件解绑
	 */
	unbind: function( elem, type, fn, useCapture ) {
		if( !elem || Q.type(fn) !== "function" ) return;
        var hook = eventHooks[type];
        if (typeof hook === "object") {
            type = hook.type
        }
        if( elem.removeEventListener ){
			elem.removeEventListener( type, fn, !!useCapture );
		}else if( obj.detachEvent ){
			elem.detachEvent( "on" + type, fn );
		}else{
			elem[ "on" + type ] = null;
		}
    },
	add: function( elem, type, fn, useCapture ){
		if( elem.addEventListener ){
			elem.addEventListener( type, fn, !!useCapture );
		}else if( elem.attachEvent ){
			elem.attachEvent( "on" + type, fn );
		}else{
			elem[ "on" + type ] = fn;
		}		
	},
	remove: function( elem, type, fn, useCapture ){
		if( elem.removeEventListener ){
			elem.removeEventListener( type, fn, !!useCapture );
		}else if( elem.detachEvent ){
			elem.detachEvent( "on" + type, fn );
		}else{
			elem[ "on" + type ] = null;
		}		
	}
});

// 常规事件添加
Q.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event
	Q.fn[ name ] = function( fn ) {
		return this.each( function(){ Q.event.bind( this, name, fn ); } );
	};
});

// 链式方法添加
Q.fn.extend({
	bind: function( type, fun ){
		return this.each( function(){ Q.event.bind( this, type, fun ); });
	},
	unbind: function( type, fun  ){
		return this.each( function(){ Q.event.unbind( this, type, fun ); });
	},
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

// 事件缓存对象，所有参与事件处理的函数均缓存在其中
var eventCache = Q.event.Cache = {}
Q.event.cache = {
	/**
	 * 从缓存对象中取出对应函数
	 */
	get: function( elem, type, fn, ns ){
		var qid = Q.data( elem ), fid = Q.data( fn, true );
		var data = eventCache[ qid ]; //去除元素QID对应的缓存对象
		if( typeof data === 'object' && fid ){			
			return data[ type + fid + (ns || '') ];
		}
	},
	/**
	 * 将事件加入到缓存对象
	 */
	add: function( handler, elem, type, fn, ns ){
		var qid = Q.data( elem ), fid = Q.data( fn );
		var data = eventCache[ qid ] = eventCache[ qid ] || {};
		data[ type + fid + (ns || '') ] = handler;	
	},
	remove: function( elem, type, fn, ns ){
		var qid = Q.data( elem ), fid = Q.data( fn, true );
		var data = eventCache[ qid ];
		if( typeof data === 'object' && fid ){
			delete data[ type + fid + (ns || '') ];
		}
	}
};
Q.extend(Q.event,{
	on: function( elem, types, fn, one ){
		var _type = types.split(/\s+/), es, type, ns, i = 0, j = types.length;
		var hooks, name, _listener;
		for( ; i < j; i++ ){
			es = (_type[i]||'').split('.');
			type = es[0];
			if( !type ) continue;
			
			ns = es.slice(1).sort().join(' ');
			hooks = Q.event._EventHooks[ type ];
			if( hooks ){
				for( name in hooks ){
					_listener = listener( elem, name, fn, type );
					Q.event.cache.add( _listener, elem, name, fn, ns );
					if( name === type ){
						Q.event.add( elem, name, _listener );
					} else {
						Q.event.on( elem, name, _listener );
					}
				}
			} else {
				_listener = listener( elem, type, fn );
				Q.event.add( elem, type, _listener );
				Q.event.cache.add( _listener, elem, type, fn, ns );
			}			
		}
	},
	off: function( elem, types, fn ){
		var _type = types.split(/\s+/), es, type, ns, i = 0, j = types.length;
		var hooks, name, _listener;
		for( ; i < j; i++ ){
			es = (_type[i]||'').split('.');
			type = es[0];
			if( !type ) continue;
			
			if( !fn ){
				//Q.event.cache.removeEvents( elem, type );
				continue;
			}
			
			ns = es.slice(1).sort().join(' ');
			hooks = Q.event._EventHooks[ type ];
			
			if (hooks) {
				for ( name in hooks) {
					var _listener = listener( elem, name, fn, type );
					if( name == type ){
						//避免死循环
						Q.event.remove( elem, name, _listener );
					}else{
						Q.event.off( elem, name, _listener );
					}
					Q.event.cache.remove( elem, name, fn, ns );
				}
			} else {
				_listener = listener( elem, type, fn );
				Q.event.remove( elem, type, _listener );
				Q.event.cache.remove( elem, type, fn, ns );
			}
		}
	},
	/* 指定事件的单个触发 */
	one: function( elem, type, fn ){
		var handler = function(){
			fn.apply( this, arguments );
			Q.event.off( elem, type, handler );
		}
		Q.event.on( elem, type, handler );
	},
	fire: function( elem, type ){
		if( document.dispatchEvent ){
			var evt = null, doc = elem.ownerDocument || elem;
			if(/mouse|click/i.test(type)){
				evt = doc.createEvent('MouseEvents');
				evt.initMouseEvent(type, true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			} else {
				evt = doc.createEvent('Events');
				evt.initEvent(type, true, true, doc.defaultView);
			}
			return elem.dispatchEvent(evt);
		} else {
			return elem.fireEvent('on' + type);
		}
	}
});