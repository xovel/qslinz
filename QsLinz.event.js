//事件与绑定相关
/*
function contains(parentNode, childNode){
	if (parentNode.contains) {
		return parentNode != childNode && parentNode.contains(childNode);
	} else {
		return !!(parentNode.compareDocumentPosition(childNode) & 16);
	}
};
function mouseHover(target,e){
	var e = window.event || arguments.callee.caller.arguments[0];
	if(e.type.toLowerCase()==="mouseover"){
		return !contains(target,e.relatedTarget||e.fromElement) && !((e.relatedTarget||e.fromElement)===target);
	} else {
		return !contains(target,e.relatedTarget||e.toElement) && !((e.relatedTarget||e.toElement)===target);
	}
};

Q.extend({
	contains: contains,
	bind: function( obj, type, fun, useCapture ){
		if( !obj || Q.type(fun) !== "function" ) return;
		
		//尝试修正mouseover与mouseout相关兼容问题
		var fix = { "mouseenter": "mouseover", "mouseleave": "mouseout" };
		var oldfun = fun;
		
		if( type in fix ){
			type = fix[type];
			
			fun = function(){
				if( mouseHover( obj ) )
					oldfun.call( this, window.event );
			}
		}
		
		if( obj.addEventListener ){
			obj.addEventListener( type, fun, !!useCapture );
		}else if( obj.attachEvent ){
			//obj[ "e" + type + fun ] = fun;
			//obj.attachEvent( "on" + type, function(){ obj[ "e" + type + fun ].call( obj, window.event ); } );
			obj.attachEvent( "on" + type, function(){ fun.call( obj, window.event ); } ); // 2014.11.21 取消元素属性设置转移方法
		}else{
			obj[ "on" + type ] = fun;
		}
	},
	unbind: function( obj, type, fun, useCapture ){
		if( !obj || Q.type(fun) !== "function" ) return;
		if( obj.removeEventListener ){
			obj.removeEventListener( type, fun, !!useCapture );
		}else if( obj.detachEvent ){
			//obj.detachEvent( "on" + type, obj[ "e" + type + fun ] );
			//obj[ "e" + type + fun ] = null;
			obj.detachEvent( "on" + type, fun ); // 2014.11.21 取消元素属性设置转移方法
		}else{
			obj[ "on" + type ] = null;
		}
	},
	on: function( obj, type, fun ){
		var fix = { "mouseover": "mouseenter", "mouseout":"mouseleave" };
		if( type in fix ) type = fix[type];
		Q.bind( obj, type, fun );
	}
});

// 常规事件添加
Q.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event
	Q.fn[ name ] = function( fn ) {
		return this.each( function(){ Q.on( this, name, fn ); } );
	};
});

// 链式方法添加
Q.fn.extend({
	bind: function( type, fun ){
		return this.each( function(){ Q.bind( this, type, fun ); });
	},
	unbind: function( type, fun  ){
		return this.each( function(){ Q.unbind( this, type, fun ); });
	},
	on: function( type, fun  ){
		return this.each( function(){ Q.on( this, type, fun ); });
	},
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

// 自定义事件相关，超级精简版。需要使用fire方法进行手动触发。
Q.CE = Q.CustomEvent = {
	add: function( elem, type, fun ){
		elem[ "ce" + type + fun ] = fun;
	},
	remove: function( elem, type, fun ){
		delete elem[ "ce" + type + fun ];
	},
	fire: function( elem, type, fun ){
		var args = Array.prototype.slice.call(arguments, 2), handler = elem[ "ce" + type + fun ];
		if( !handler ) return;
		handler.apply( elem, args );	
	},
	clear: function( elem, type, fun ){
		elem[ "ce" + type + fun ] = null;
	}
} //*/

//2015.5.28 构造Q.event对象相关
Q.guid = 1;
Q.proxy = function( fn, context ) {
	var args, proxy, tmp, slice = [].slice;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !Q.isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || Q.guid++;

	return proxy;
}

// 事件处理
Q.event = {}

var eventHooks = Q.event.hook = {}
var eventCache = Q.event.cache = {}

//IE下事件修正
Q.event.fixIE = function(event) {
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

Q.event.isOver = function(target,e){
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
		handler: function(elem, fn) {
			return function(e){
				if( Q.event.isOver( elem ) )
					fn.call( this, e );
			}
		}
	}
});

Q.extend( Q.event,{
	/**
	 * 事件绑定相关，代码由原版QsLinz更改而来
	 */
	bind: function( elem, type, fn, useCapture ){
		if( !elem || Q.type(fn) !== "function" ) return;
		var hook = eventHooks[type];
		if (typeof hook === "object") {
			type = hook.type
			if (hook.handler) {
				fn = hook.handler(elem, fn);
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
	// 事件绑定的序号
	qid: 1,
	// getData for Q.event
	_data: function( elem ){
		var _data;
		if ( elem === window ) {
			_data = '_qslinz_win_';
		} else if ( elem === document ) {
			_data = '_qslinz_doc_';
		} else {
			_data = elem.getAttribute( "_qslinz_data_" );
		};

		return _data;
	},
	add: document.addEventListener ? function( target, eventType, handle, type, selector ){
		if (!target || target.nodeType === 3 || target.nodeType === 8) { //文本或注释
			return this;
		};
		selector = selector || "";
		var _data = Q.event._data(target);
		if (!_data) {
			_data = "_qslinz_" + Q.event.qid++;
			target.setAttribute( "_qslinz_data_", _data);
		};
		var isExist = true; //是否已存在相同的事件
		if (!eventCache[_data] || !eventCache[_data][eventType]) {
			isExist = false
		};
		handle = Q.event.proxy(target, eventType, handle, type, selector);
		if (!isExist) { //没有就添加
			eventCache[_data][eventType].handle = handle;
			target.addEventListener(eventType, handle, false);
		}
	} : function( target, eventType, handle ){
		if (!target) {
			return this;
		}
		handle = Q.event.proxy(target, eventType, handle);
		target.attachEvent("on" + eventType, handle);
	},
	proxy: function(target, eventType, handle, type, selector) {
		var _data = Q.event._data(target);
		selector = selector || "";
		eventCache[_data] = eventCache[_data] || {}; //初始化缓存事件列表
		var eList = eventCache[_data][eventType] = eventCache[_data][eventType] || [];
		
		var fn = handle;
		handle = function(e) {
			e.target = e.target || e.srcElement;
			e.stop = function() {
				e.preventDefault();
				e.stopPropagation();
			};
			if (type === "delegate") {
				Q.each( Q.makeArray(Q.Q( selector, target )), function( i, elem ) {
					if (e.target === elem ) {
						fn.call(elem, e)
					};
				});
				return false;
			};
			if (!fn.call(target, e)) {
				e.preventDefault ? e.preventDefault() : null;
			};
			if (type === "one") {
				Q.event.remove(target, eventType, handle)
			}
		};
		handle.oldHandle = fn;
		eList.push(handle);
		
		return function(e) {
			Q.each(eList, function(i, fn) {
				fn.call(this, e);
			});
		};
	},
	remove: function(target, eventType, handle, type, selector) {
		var _self = this;
		var _data = Q.event._data(target);
		var evtList;
		if (!_data) {
			evtList = false;
		} else {
			evtList = eventCache[_data][eventType] || false;
		}
		if (handle) {
			var count = 0;
			Q.each(evtList, function(i, fn) {
				if (handle == fn.oldHandle) {
					delete evtList[i];
				} else {
					count++;
				};
			});
			if (count === 0) {
				Q.event.remove(target, eventType + selector);
			}
		} else {
			if (evtList) {
				//target.removeEventListener(eventType,evtList.handle,false);
				Q.each(evtList, function( i, v ) {
					delete evtList[i];
				});
				eventCache[_data][eventType + selector] = null;
				Q.event.deleteEvt(target, eventType, evtList.handle);
			}
		};
	},
	deleteEvt: function(target, eventType, handle) {
		if(target.removeEventListener){
			target.removeEventListener(eventType, handle, false);
		} else if( target.detachEvent ) {
			target.detachEvent("on" + eventType, handle);
		};
	}
});


/*Zepto*/
;(function($){
  var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={}

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eachEvent(events, fn, iterator){
    if ($.isObject(events)) $.each(events, iterator)
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
  }

  function add(element, events, fn, selector, getDelegate, capture){
    capture = !!capture
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    eachEvent(events, fn, function(event, fn){
      var delegate = getDelegate && getDelegate(fn, event),
        callback = delegate || fn
      var proxyfn = function (event) {
        var result = callback.apply(element, [event].concat(event.data))
        if (result === false) event.preventDefault()
        return result
      }
      var handler = $.extend(parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length})
      set.push(handler)
      element.addEventListener(handler.e, proxyfn, capture)
    })
  }
  function remove(element, events, fn, selector){
    var id = zid(element)
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
        element.removeEventListener(handler.e, handler.proxy, false)
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (typeof context == 'string') {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback)
    })
  }
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback)
    })
  }
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments)
          remove(element, type, fn)
          return result
        }
      })
    })
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }
  function createProxy(event) {
    var proxy = $.extend({originalEvent: event}, event)
    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue
        return event[name].apply(event, arguments)
      }
      proxy[predicate] = returnFalse
    })
    return proxy
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false
      var prevent = event.preventDefault
      event.preventDefault = function() {
        this.defaultPrevented = true
        prevent.call(this)
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    var capture = false
    if(event == 'blur' || event == 'focus'){
      if($.iswebkit)
        event = event == 'blur' ? 'focusout' : event == 'focus' ? 'focusin' : event
      else
        capture = true
    }

    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0)
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
          }
        }
      }, capture)
    })
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, callback){
    return selector == undefined || $.isFunction(selector) ?
      this.bind(event, selector) : this.delegate(selector, event, callback)
  }
  $.fn.off = function(event, selector, callback){
    return selector == undefined || $.isFunction(selector) ?
      this.unbind(event, selector) : this.undelegate(selector, event, callback)
  }

  $.fn.trigger = function(event, data){
    if (typeof event == 'string') event = $.Event(event)
    fix(event)
    event.data = data
    return this.each(function(){
      // items in the collection might not be DOM elements
      // (todo: possibly support events on plain old objects)
      if('dispatchEvent' in this) this.dispatchEvent(event)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
      e.data = data
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback){ return this.bind(event, callback) }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else if (this.length) try { this.get(0)[name]() } catch(e){}
      return this
    }
  })

  $.Event = function(type, props) {
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
    return event
  }

})(Zepto)


Q.extend( Q.event,{
	/**
	 * 事件绑定相关，代码由原版QsLinz更改而来
	 */
	bind: function( elem, type, fn, useCapture ){
		if( !elem || Q.type(fn) !== "function" ) return;
		var hook = eventHooks[type];
		if (typeof hook === "object") {
			type = hook.type
			if (hook.handler) {
				fn = hook.handler(elem, fn);
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
	/**
	 * 事件的添加，包括自定义事件，同时支持事件别名
	 * 事件代理仅支持浏览器默认事件，诸如mouseenter/mouseleave不支持
	 */
	add: function( elem, events, fn, selector, delegate, useCapture ){
		var es = events.split(/\s+/), i = 0, j = es.length, _es, type, ns, qid, _cache, cache;
		
		qid = Q.data( elem );
		_cache = eventCache[ qid ] = eventCache[ qid ] || {};
		
		for( ; i < j; i++ ){
			_es = es[i].split('.');
			type = _es[0];
			
			if( !type ) continue;
			
			ns = _es.slice(1).sort().join(' ');
			
			cache = _cache[ type ] = _cache[ type ] || {};
			
			cache.ns = ns;
			cache.type = type;
			cache.oldHandle = fn;
			cache.fn = fn;
			
			//处理代理相关操作
			if( delegate === 'delegate' ){
				cache.fn = function(e){					
					Q( selector, elem ).each(function(){
						e.target = e.target || e.srcElement;
						if( e.target === this ){
							fn.call( this, e );
						}
					});
				}
			}
			
			//一次性事件
			if( delegate === 'one' ){
				cache.fn = function(e){				
					fn.call( elem, e );					
					Q.event.remove( elem, type, cache.fn, useCapture );
				}
			}
			
			Q.event.bind( elem, type, cache.fn, useCapture );
		}
	},
	remove: function( elem, events, fn, useCapture ){
		var es = events.split(/\s+/), i = 0, j = es.length, _es, type, ns, matcher;
		for( ; i < j; i++ ){
			_es = es[i].split('.');
			type = _es[0];
			ns = _es.slice(1).sort().join(' ');
			
			matcherFor(ns)
			
									
			Q.event.unbind( elem, type, fn, useCapture );
		}
	}
});

var Cache = function(){
	var cache = this;
	return {
		/**
		 * Get event handler
		 */
		get: function( elem, type, handler, ns ){
			var qid = Q.data( elem ), hid = Q.data( handler, true ), name = type + hid, handle;
			var data = cache[qid];
			if( data && hid ){
				handle = data[name] = data[name] || {};
				
				if( handle.ns && matcherFor(ns).test(handle.ns) ){
					return handle.fn;
				}
				return handle.fn;
			}
		},
		add: function( addHandler, elem, type, handler, ns ){
			var qid = Q.data( elem ), hid = Q.data( handler ), name = type + hid, handle;
			var data = cache[qid] = cache[qid] || {};
			
			handle = data[name] = data[name] || {};
			handle.ns = ns || '';
			handle.fn = addHandler;
		},
		remove: function( elem, type, handler, ns ){
			var qid = Q.data( elem ), hid = Q.data( handler, true ), name = type + hid, handle;
			var data = cache[qid];
			if( data && hid ){
				var handle = data[name];
				
				if( typeof handle !== 'object' ){
					return;
				}
				
				if( handle.ns && matcherFor(ns).test(handle.ns) ){
					delete handle;
				} else {
					delete handle;
				}
			}
		}
		
	}	
}();



/*==========================================*/
,
	/**/
	trigger: function( elem, type, ns ){		
		var qid = Q.data( elem ), data = eventCache[ qid ], name, r;
		if( typeof data === 'object' ){
			for( name in data ){
				r = new RegExp( '^' + type + '\\d.*' + (ns||'') );
				if( r.test(name) ){
					try{
						data[name].apply( this, arguments ))
					} catch(e){
						//
					} finally {
						//
					}
				}				
			}	
		}
	}







/////
// 事件处理
Q.event = {}

var eventHooks = Q.event.hook = {}

//IE下事件修正
Q.event.fixIE = function(event) {
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
	},
	removeEvents: function( elem, type ){
		var i, r, qid = Q.data( elem ), data = eventCache[ qid ];
		if( typeof data === 'object' ){
			r = new RegExp('^[a-zA-Z.]*' + (type || '') + '\\d+');
			for( i in data ){
				if( r.test(i) ){
					Q.event.remove( elem, i.split(/[^a-zA-Z]/)[0], data[i] );
					delete data[i];
				}
			}
		}		
	},
	removeDelegates: function( elem, type, selector) {
		var i, r, name, capture, qid = Q.data( elem ), data = eventCache[ qid ];
		if( typeof data === 'object' ){
			r = new RegExp('^([a-zA-Z]+\\.)?' + (type || '\\w+') + '\\d+.+');
			for( i in data){
				if( r.test(i) && (!selector || i.substr(i.length - selector.length) == selector) ){
					name = i.split(/\d+/)[0].split('.');
					capture = Q.event._DelegateCaptureEvents.indexOf(name[1]||name[0]) > -1;
					Q.event.remove( elem, i.split(/[^a-zA-Z]/)[0], data[i], capture );
					delete data[i];
				}
			}
		}
	}
};

function listener( elem, type, handler, hookType ) {
	return Q.event.cache.get( elem, type, handler, hookType ) || function(e){
		if( !hookType || hookType && Q.event._EventHooks[ hookType ][ type ]( elem, e, handler ) ){
			return Q.event.fireHandler( elem, e, handler, type );
		}
	}
}

Q.extend(Q.event,{
	_DelegateCaptureEvents: 'change,focus,blur',
	_EventHooks: {},
	_DelegateHooks: {},
	fireHandler: function( elem, e, handler, type ) {
		e = Q.B.isIE ? Q.event.fixIE(e) : e;
		e.userType = type;
		return handler.call(elem, e);
	},
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
				Q.event.cache.removeEvents( elem, type );
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
