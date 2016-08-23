
/*
 * Qs.zLw QsLinz Javascript Library version 0.1.1
 * A simple but funny javascript library.
 * Last Update: Wed Jun 11 2014 11:39:19 GMT+0800 (中国标准时间)
 */

;(function( window, undefined ) {

var core_version = "0.1.1",
	
	isIE = !-[1,],
	
	readyList = [],	
	
	// Like sandbox
	location = window.location,
	document = window.document,
	docElem = document.documentElement,
	
	// Backup for pre-Q
	_Q = window.Q;

var Q = function( selector, container ){
	return new Q.fn.init( selector, container );
};

Q.fn = Q.prototype = {
	
	version: core_version,
	
	constructor: Q,
	
	init: function( selector, container ){
		
		if( !selector ) return this;
		
		var sType = typeof selector;
		
		if( sType === "function" ){
			return Q.ready( selector );
		}
		
		if( sType === "string" ){
			
			var elem = Q.UserCSSSelectorEngine && Q.Engine ? Q.Engine( selector, container ) : Q.Q( selector, container );	
			
			this.selector = selector;
			
			if( elem && elem.length ) {				
				for( var i = 0, j = elem.length; i < j; i++){
					this[i] = elem[i];
				}
				this.length = j;			
			} else {				
				this.length = 1;
				this[0] = elem;		
			}
		}
		
		if( sType === "object" ){
			var i = 0, j = selector.length;
			if( j === undefined ){
				this.length = 1;
				this[0] = selector;
			} else {
				for( ; i < j; i++ ){
					this[i] = selector[i];
				}
				this.length = j;
			}
		}
		
		return this;
	},
	
	selector: "",
	
	length:0,
	
	toArray:function(){
		return [].slice.call( this );
	},
	get: function( num ){
		return typeof num !== "number" ? this.toArray() : num < 0 ? this[ this.length + num ] : this[ num ];
	},
	
	// Take a trick on the console: 
	// if an object with the property length has a splice method, the console will consider it as ArrayLike.
	push: [].push,
	sort: [].sort,
	splice: [].splice
};

//产生链式方法
Q.fn.init.prototype = Q.fn;

//Prototype.js里的属性扩展方法简化版
Q.mix = Q.fn.mix = function( source ) {
	
	for( var property in source )
		this[property] = source[property];
	return this;
};

Q.extend = Q.fn.extend = function() {
	
	var target = arguments[0] || {},
		length = arguments.length,
		src = {};
		
	// extend itself
	if( length == 1 ){
		src = target;
		target = this;
	} else {
		src = arguments[1];
	}
	
	for( var name in src ){
		target[name] = src[name];
	}
	
	return target;
};

Q.extend({
	noConflict: function(){
		window.Q = _Q;
		return Q;
	},
	extendEx: function( deep, target, source ){		
		//进阶扩展，不覆盖原有属性，设置deep为真时将强制覆盖
		for( var name in source ){
			if( !deep && ( name in target ) ) continue;
			target[name] = source[name];
		}
		return target;
	},
	isReady: false,
	each : function( obj, fn ){
		var value, i = 0, length = obj.length;
		if( length === undefined ){
			for( i in obj )
				if( false === fn.call( obj[ i ], i, obj[ i ] ) ) break;
		} else {
			for ( ; i < length; i++ ) {
				if( false === fn.call( obj[ i ], i, obj[ i ] ) ) break;
			}
		}
		return obj;
	},
	error: function( msg ) {
		throw new Error( msg );
	},
	camelCase: function( string ) {
		return string.replace( /^-ms-/, "ms-" )
				.replace( /-([\da-z])/gi, function( all, letter ) { return letter.toUpperCase(); } );
	},
	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( arr.length !== undefined ) {
				Q.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				[].push.call( ret, arr );
			}
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = length !== undefined,
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return [].concat.apply( [], ret );
	},
	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( [].indexOf ) {
				return [].indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},
	now: function() {
		return ( new Date() ).getTime();
	}
});

//文档就绪相关
Q.ready = function () {
	
	var timer = null,
	
	_readyEx = function( fn ){
		if( Q.isReady ){
			//文档若已就绪，直接执行
			fn();
		} else {
			//未就绪则压入列表等待执行
			readyList.push( fn );
		}
	},
	
	_readyPro = function(){
		for( var i = 0, j = readyList.length; i < j; i++ ){
			//依次执行被压入的对象
			readyList[i]();
		}
	},
	
	_readyBind = function(e){
		
		if( Q.isReady ) return;  //已就绪
		
		Q.isReady = true;  //执行时意味已经就绪
		
		_readyPro();  //执行！
		
		if( document.removeEventListener ){
			document.removeEventListener( "DOMContentLoaded", _readyBind, false );   //事件移除			
		} else if( document.detachEvent ){
			
			document.detachEvent( "onreadystatechange", _readyBind );  //IE事件移除
			
			if( window == window.top ){
				clearInterval( timer );  //清除定时器
				timer = null;
			}
		}
	};
	
	if ( document.addEventListener ) {
		document.addEventListener( "DOMContentLoaded", _readyBind, false );	//事件侦听
	} else if ( document.attachEvent ) {
		document.attachEvent( "onreadystatechange", function () {
			if ( document.readyState == "load" || document.readyState == "complete" ) _readyBind(); //IE下文档就绪
		});
		if ( window == window.top ) {
			//兼容处理，顶级窗口下的定时执行
			timer = setInterval(function () {
				try {
					Q.isReady || document.documentElement.doScroll('left');
				} catch (e) {
					//就绪预处理操作完成，但文档无法执行doSrcoll时
					return;
				}
				_readyBind();
			}, 5);
		}
	}
	return _readyEx;
}();

//判断类型
Q.type = function( test, surface ){
	switch( test ){
		case null: return "null";
		case (void 0): return "undefined"; // For compatibility, 'undefined' can be used as a variable. 2014.5.22
	}
	// objType = "Boolean Number String Function Array Date RegExp Object Error".split(" ")
	// nodeType = [, "HTMLElement", "Attribute", "Text", , , , , "Comment", "Document", , "DocumentFragment", ]
	var _type = typeof test, bObject = !!surface, oType, rType = /\[object (\w+)\]/;
	
	if( _type === "object" && !bObject ){
		oType = Object.prototype.toString.call( test );		
		if( rType.test( oType ) ) return RegExp.$1.toString().toLowerCase();
	}
	
	return _type;
};

// 选择器
Q.$ = function( id ){ return document.getElementById( id ); };
Q.Q = function( selector, container ){
	
	//zlw ReWrite 2014.1.30
	
	//return if the selector'type is not string
	if( typeof(selector) !== "string" ) return selector || container || document;
	
	//if the container is absulute null, return null
	//fix the error of multi-selector
	if( container === null ) return null;
	
	var //set the node for container
		//if the container is a nodelist, we defualtly use the first element.
		//if the container does not exist, we use document alternatively.
		node =  container && container[0] || container || document,
		
		//split the selector by space
		selectors = selector.split(/\s+/),
		
		//core-selector
		selector_core = selectors[0],
		
		//rest-selector
		selector_rest,
		
		//elements [may] exist in the core selector
		core_tag = "*",
		core_class = "",
		core_token = "",
		core_attr = "",
		core_sn = -2;	
	
	if( selectors.length === 1 ) {
		
		//test id
		if( /#(\w+)/.test( selector_core ) ) return Q.$( RegExp.$1 );
		
		//test tag
		if( /^(\w+)/.test( selector_core ) ) core_tag = RegExp.$1;
		
		//test sn
		if( /\[([+-]?\d+)\]/.test( selector_core ) ) core_sn = parseInt( RegExp.$1, 10 );		
		
		//test attribute
		if( /\[(\D.*)\]/.test( selector_core ) ) core_attr = RegExp.$1;
		
		//test token
		if( /:(.+)/.test( selector_core ) ) {
			
			//get token
			core_token = RegExp.$1;
			
			//test attribute
			if( core_attr ) {
				
				//test classname
				if( /\.([\w.-]+).*\[/.test( selector_core ) ) core_class = RegExp.$1;
										  
			} else {
				
				if( /\.([\w.-]+).*:/.test( selector_core ) ) core_class = RegExp.$1;	
				
			}
			
		} else {
			
			if( core_attr ) {
				
				//test classname
				if( /\.([\w.-]+)\[/.test( selector_core ) ) core_class = RegExp.$1;
				
			} else {
			
				if( /\.([\w.-]+)/.test( selector_core ) ) core_class = RegExp.$1;
			
			}
		}
		
		var //for-loop and flag
			i, j, k = 0,
			p, q, m = 0;
			
			//elements by tagname
			elems = node.getElementsByTagName ?　node.getElementsByTagName( core_tag ) : null,
			
			//elements contain classname or token
			elem_class = [],
			elem_token = [],
			elem_attr = [];
		
		
		if( !elems ) return null;
		
		if( core_class !== "" ) {
			
			for( i = 0, j = elems.length; i < j; i++ ) {
				if( Q.hasClass( elems[i], core_class.replace( /\./g , " " ) ) ) elem_class[ k++ ] = elems[i];
			}
			
		} else {
			elem_class = elems;
		}
		
		k = elem_class.length;
		
		if( k === 0 ) return null;
		
		if( core_sn !== -2 ) return core_sn == -1 ? elem_class[ k - 1 ] : elem_class [ core_sn ] ? elem_class [ core_sn ] : null;
		
		if( core_token === "" ){
			
			elem_token = elem_class;
			
		}else{
		
			var token_type = core_token.substring( 0, 1 );
			
			if( "~!^".indexOf( token_type ) != -1 ) core_token = core_token.substring( 1, core_token.length );
			
			var tokens = core_token.split("|"), b_token = false;
			
			m = 0;
			
			for( i = 0; i < k; i++ )
				
				if( token_type === "!" || token_type === "^" ){
					
					//set ! as not in innerHTML, ^ as not in outerHTML
					b_token = true;
					for( p = 0, q = tokens.length; p < q; p++ ){
						if( token_type === "!" ){
							if( elem_class[ i ].innerHTML.indexOf( tokens[ p ] ) != -1 ){ b_token = false; break; }
						}else{
							if( elem_class[ i ].outerHTML.indexOf( tokens[ p ] ) != -1 ){ b_token = false; break; }
						}
					}
					if( b_token === true ) elem_token[ m++ ] = elem_class[ i ];
				} else {
					
					//set ~ as in outerHTML, other as in innerHTML
					b_token = false;
					for( p = 0, q = tokens.length; p < q; p++ ){
						if( token_type === "~" ){
							if( elem_class[ i ].outerHTML.indexOf( tokens[ p ] ) != -1 ){ b_token = true; break; }
						}else{
							if( elem_class[ i ].innerHTML.indexOf( tokens[ p ] ) != -1 ){ b_token = true; break; }
						}
					}
					if( b_token === true ) elem_token[ m++ ] = elem_class[ i ];					
				}
			// End For
		}
		
		if( core_attr === "" ){
		
			elem_attr = elem_token;
			
		} else {
			
			var attr_name, attr_value, attr_ori, b_attr, r_attr;
			
			m = 0;
			
			for( i = 0, j = elem_token.length; i < j; i++ ){
				
				attr_name = core_attr.split("=")[0];
				attr_value = core_attr.replace( attr_name, "" ).replace( "=", "" );
				
				if( /[~!^]$/.test( attr_name ) ){
					b_attr = true;
					attr_name = attr_name.replace( /[~!^]$/, "" );
				}
				
				r_attr = new RegExp( attr_value, "i" );
				
				attr_ori = elem_token[ i ].getAttribute( attr_name );
				
				if( attr_ori === null ) continue;
				
				if( b_attr === true ) {
					
					if( !r_attr.test( attr_ori ) ) elem_attr[ m++ ] = elem_token[ i ];
					
				} else {
					
					if( r_attr.test( attr_ori ) ) elem_attr[ m++ ] = elem_token[ i ];
				
				}
			}
		}
		
		return elem_attr.length > 0 ? elem_attr : null;
	//
		
	} else {
		
		//drop the first element
		selectors.shift();
		
		//join the rest selectors
		selector_rest = selectors.join(" ");
		
		//recursion
		return Q.Q( selector_rest, Q.Q( selector_core, node ) );
		
	}
};

// CSS类名操作
// 2014.7.12 修正低版本IE获取class属性时的没有className时为null的问题
Q.extend({
	hasClass: function( elem, name ){
		if( typeof elem !== "object" ) return;
		var _name = name.split(/\s+/), _ori = elem.className || "", i = 0, j = _name.length;
		
		for( ; i < j; i++ ){
			if( !_ori.match( new RegExp( "(\\s|^)" + _name[i] + "(\\s|$)" ) ) ) return false;
		}
		return true;
	},
	addClass: function( elem, name ){
		if( typeof elem !== "object" ) return;
		var _name = name.split(/\s+/), _ori = elem.className || "", i = 0, j = _name.length;
		
		if( _ori === "" ) {
			elem.className = _name.join(" ");
		} else {
			for( ; i < j; i++ ){
				if( !_ori.match( new RegExp( "(\\s|^)" + _name[i] + "(\\s|$)" ) ) ) _ori += " " + _name[i];
			}
			elem.className = _ori;
		}
		return _ori;
	},
	removeClass: function( elem, name ){
		if( typeof elem !== "object" ) return;
		var _name = name.split(/\s+/), _ori = ( elem.className || "" ).split(/\s+/),
			 i = 0, j = _ori.length, m = 0, n = _name.length,
			 k = 0, ret = [], b_remove = false;
		
		for( ; i < j; i++ ){
			b_remove = false;
			
			for( m = 0; m < n; m++ ){
				if( _name[m] === _ori[i] ){ b_remove = true; break; }
			}
			if( !b_remove ) ret[ k++ ] = _ori[i];
		}
		elem.className = ret.join( " " );
		return ret.join( " " );
	}
});

// 链式方法
Q.fn.extend({
	each:function( fn ){
		return Q.each( this, fn );
	},
	hasClass: function( name, index ){
		return Q.hasClass( this[ typeof index === "number" ? index : 0 ], name );
	},
	addClass: function( name ){
		return this.each(function(){ Q.addClass( this, name ); });
	},
	removeClass: function( name ){
		return this.each(function(){ Q.removeClass( this, name ); });
	},
	toggleClass: function( name ){
		return this.each(
			function(){ 
				Q.hasClass( this, name ) ? 
				Q.removeClass( this, name )
				: Q.addClass( this, name );
			}
		);
	}		
});

// CSS与文档属性操作相关
Q.extend({	
	setAttr: function( obj, attr, value ) {
		if( typeof obj !== "object" ) return;
		if( typeof attr == "string" ){ var _attr = attr; attr = {}; attr[ _attr ] = value; }
		for( var name in attr ){
			obj.setAttribute( name, attr[name] );
		}
	},
	removeAttr: function( obj, attr ){
		obj.removeAttribute( attr );
	},
	prop: function( obj, prop, value ){
		if( typeof prop == "string" ){ var _prop = prop; prop = {}; prop[ _prop ] = value; }
		for( var name in prop ){
			obj[ name ] = prop[ name ];
		}
	},
	curStyle: function( obj ){
		if( typeof obj !== "object" ) return;
		return document.defaultView ? document.defaultView.getComputedStyle( obj, null ) : obj.currentStyle;
	},
	setStyle: function( obj, style, value ) {
		if( typeof obj !== "object" ) return;
		if( typeof style == "string" ){ var _style = style; style = {}; style[ _style ] = value; }
		
		for( var name in style ){
			var value = style[ name ];
			if( name == "opacity" && isIE ){
				var _cur = this.currentStyle,
					_ori = _cur && _cur.filter || "",
					_value = "alpha(opacity=" + (value * 100 | 0) + ")";
				_ori = _ori === "" ? _value : _ori.replace( /alpha\([^)]*\)/, "" ) + " " + _value;					
				obj.style.filter = _value;
			}else if( name == "float" ) { 
				obj.style[ isIE ? "styleFloat" : "cssFloat" ] = value;
			}else{
				obj.style[ Q.camelCase( name )] = value;
			}
		}
	},
	getStyle: function( obj, name ){
		if( typeof obj !== "object" ) return;
		if( document.defaultView ){
			var style = document.defaultView.getComputedStyle( obj, null );
			return name in style ? style[ name ] :style.getPropertyValue( name );
		}
		
		var _style = obj.style, _cur = obj.currentStyle;
		if( name == "opacity" ){
			if( /alpha\(opacity=(.*)\)/i.test( _cur.filter ) ){
				var _op = parseFloat( RegExp.$1 );
				return _op ? _op / 100 : 0;
			}
			return 1;
		}
		if( name == "float" ) name = "styleFloat";
		
		var ret = _cur [ name ] || _cur [ Q.camelCase( name ) ];
		if( !/^-?\d+(?:px)?$/i.test( ret ) && /^\-?\d/.test( ret ) ){
			var _left = _style.left, _rts = obj.runtimeStyle, _rleft = _rts.left;
			
			_rts.left = _cur.left;
			_style.left = ret || 0;
			ret = _style.pixelLeft + "px";
			
			_style.left = _left;
			_rts.left = _rleft;
		}
		return ret;
	},
	show: function( elem ){
		if( typeof elem !== "object" ) return;
		var tagName = elem.nodeName.toLowerCase(), value = "block";
		var oDisplay = {
			li:"list-item",
			//head:"none",
			table:"table",
			tr:"table-row",
			thead:"table-header-group",
			tfoot:"table-row-group",
			col:"table-column",
			colgroup:"table-column-group",
			td:"table-cell",
			th:"table-cell",
			caption:"table-caption"
		};
		
		if( '|button|textarea|input|object|select|'.indexOf( '|' + tagName + '|' ) != -1 ) value = "inline-block";
		
		if( '|span|img|a|b|u|i|label|strong|em|'.indexOf( '|' + tagName + '|' ) != -1 ) value = "inline";
		
		if( tagName in oDisplay ) value = oDisplay[tagName];
		
		Q.setStyle( elem, "display", value);
	},
	// IE透明度
	opacity: function( obj, value ){ 
		if( typeof obj !== "object" ) return;
		obj.filters ? obj.style.filter = (obj.currentStyle && obj.currentStyle.filter || "").replace( /alpha\([^)]*\)/, "" ) + " alpha(opacity=" + value + ")" : obj.style.opacity = value/100;
	}
});

Q.fn.extend({
	attr: function( attr, name ){
		if( typeof attr === "undefined" ){ 
			var ret = {}, attrs = this[0].attributes;
			for( var i = 0, j = attrs.length; i < j; i++ ) ret[ attrs[i].name ] = attrs[i].value;
			return ret;
		}
		if( typeof attr === "string" && typeof name === "undefined" ) return this[0].getAttribute( attr );
		return this.each( function(){ Q.setAttr( this, attr, name ); });
	},
	dattr: function( attr ){
		return this.each( function(){ Q.removeAttr( this, attr ); } );
	},
	prop: function( name, value ){
		if( typeof name === "undefined" ) return this;
		if( typeof name === "string" && typeof value === "undefined" ) return this[0][name];
		return this.each( function(){ Q.prop( this, name, value ); });
	},
	css: function( style, value ){
		//.css()
		if( typeof style === "undefined" ) return Q.curStyle( this[0] );
		
		//.css("display")
		if( typeof style === "string" && typeof value === "undefined" ) return Q.getStyle( this[0], style );
		
		//.css("display",3)
		if( typeof style === "string" && typeof value === "number" ) return Q.getStyle( this[value], style );
		
		return this.each( function(){ Q.setStyle( this, style, value ); } );
	},
	hide: function(){
		return this.each( function(){ Q.setStyle( this, "display", "none" ); });
	},
	show: function(){
		return this.each( function(){ Q.show( this ); });
	},
	toggle: function(){
		return this.each( function(){ Q.getStyle( this, "display" ) === "none" ? Q.show( this ) : Q.setStyle( this, "display", "none" ); });
	}
});

// 浏览器判定相关
Q.B = function(userAgent){
	var ua = userAgent.toLowerCase(); 
	return {
		ua: userAgent,
		version: (ua.match( /.+(?:rv|it|ra|ie|chrome|version|firefox)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
		isIE: /msie/.test(ua),
		isIE6: /msie 6/.test(ua),
		isIE7: /msie 7/.test(ua),
		isIE8: /msie 8/.test(ua),
		isIE9: /msie 9/.test(ua),
		isIE10: /msie 10/.test(ua),
		isChrome: /chrome/.test(ua),
		isFirefox: /firefox/.test(ua)
		isOpera: /opera/.test(ua),
		isAndroid: /android/.test(ua),
		isSafari: /webkit/.test(ua) && !/chrome/.test(ua),  // hmhm, safari and chrome, .-_.
	}
}( window.navigator.userAgent );

//事件与绑定相关
function contains(parentNode, childNode){
	if (parentNode.contains) {
		return parentNode != childNode && parentNode.contains(childNode);
	} else {
		return !!(parentNode.compareDocumentPosition(childNode) & 16);
	}
}
//2014.7.11 修复FireFox下没有window.event对象的问题
	function getEvent(e) {
		return e || window.event || arguments.callee.caller.arguments[0];
	}
	function mouseHover(target,e){
	//var e = window.event || arguments.callee.caller.arguments[0];
	if(getEvent(e).type.toLowerCase()=="mouseover"){
	//if(e.type=="mouseover"){
		return !contains(target,getEvent(e).relatedTarget||getEvent(e).fromElement) && !((getEvent(e).relatedTarget||getEvent(e).fromElement)===target);
		//return !contains(target,e.relatedTarget||e.fromElement) && !((e.relatedTarget||e.fromElement)===target);
	} else {
		return !contains(target,getEvent(e).relatedTarget||getEvent(e).toElement) && !((getEvent(e).relatedTarget||getEvent(e).toElement)===target);
		//return !contains(target,e.relatedTarget||e.toElement) && !((e.relatedTarget||e.toElement)===target);
	}
}
	Q.extend({
	contains: contains,
	//Sizzle contains method 
	contains_Sizzle: function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && (
			adown.contains ?
				adown.contains( bup ) :
				a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
		));
	},
	//Sizzle contais method violently
	contains_Sizzle2: function( a, b ) {
		if ( b ) {
			while ( (b = b.parentNode) ) {
				if ( b === a ) {
					return true;
				}
			}
		}
		return false;
	},
	bind: function( obj, type, fun ){
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
			obj.addEventListener( type, fun, false );
		}else if( obj.attachEvent ){
			obj[ "e" + type + fun ] = fun;
			obj.attachEvent( "on" + type, function(){ obj[ "e" + type + fun ].call( obj, window.event ); } );				
		}else{
			obj[ "on" + type ] = fun;
		}
	},
	unbind: function( obj, type, fun ){
		if( !obj || Q.type(fun) !== "function" ) return;
		if( obj.removeEventListener ){
			obj.removeEventListener( type, fun, false );
		}else if( obj.detachEvent ){
			obj.detachEvent( "on" + type, obj[ "e" + type + fun ] );
			obj[ "e" + type + fun ] = null;
			
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
		if( !elem[ "ce" + type + fun ] ) return;
		var args = Array.prototype.slice.call(arguments, 2), handler = elem[ "ce" + type + fun ];
		handler.apply( elem, args );			
	},
	clear: function( elem, type, fun ){
		elem[ "ce" + type + fun ] = null;
	}
};

// 获取内容
// 不完善的实现方式，尽量避免使用此方法。
// Dom在未加载完毕或者元素大量存在并且页面复杂时会导致浏览器渲染失败，可能会出现操作中止的情况
Q.each({
	html: "innerHTML",
	HTML: "outerHTML",
	text: "innerText",
	TEXT: "outerText"
}, function( name, prop ){
	Q.fn[ name ] = function( value, index ){
		if( typeof value === "string" ){
			index === "all" ?
			this.each( function(){ this[ prop ] = value; } ) : 
			this[ typeof index === "number" ? index : 0 ][ prop ] = value;
			return this;
		} else {
			return this[ typeof value === "number" ? value : 0 ][ prop ];
		}
	}
});

// 元素过滤相关
Q.fn.extend({
	pushStack: function( elems ) {
		// 重绘对象
		var ret = Q.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.container = this.container;

		// Return the newly-formed element set
		return ret;
	},
	map: function( fun ){
		return this.pushStack( Q.map(this, function( elem, i ) {
			return fun.call( elem, i, elem );
		}));
	},
	grep: function( fun ){
		return this.pushStack( Q.grep(this, function( elem, i ) {
			return fun.call( elem, i, elem );
		}));
	},
	eq: function( i ){
		var len = this.length, j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},
	first: function(){
		return this.eq(0);
	},
	last: function(){
		return this.eq(-1);
	},
	end: function(){
		return this.prevObject || this.constructor(null);
	},
	nth: function( a, b ){
		// 仿制CSS3选择器 nth-child(an+b)
		return this.grep( function(i){ return i % a == (b||0) % a; } );
	},
	even: function(){
		return this.nth(2);
	},
	odd: function(){
		return this.nth(2,1);
	},
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return Q.inArray( this[0], Q( elem ) );
		}

		// Locate the position of the desired element
		return Q.inArray( elem.version ? elem[0] : elem, this );  // If it receives a QsLinz object, the first element is used
	}
});

// 缓存与遍历去重相关
// 代码参照自 jQuery1.10.2, jQuery1.3.1
var expando = "QsLinz" + Q.now(), qsuid = 0,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

Q.extend({
	nodeName: function( node, name ){
		var nodeName = node && node.nodeName && node.nodeName.toLowerCase() || "";
		if( typeof name === "string" ) return nodeName === name.toLowerCase();
		return nodeName;
	},
	// 数据标记
	data: function( elem ){
		elem = elem === window ? {} : elem;
		var id = elem[ expando ];
		// 元素对应ID不存在则加入新标记
		if( !id ) id = elem[ expando ] = ++qsuid;
		return id;
	},
	// 移除标记
	removeData: function( elem ) {
		elem = elem === window ? {} : elem;
		var id = elem[ expando ];
		try {
			delete elem[ expando ];
		} catch(e){
			// for IE
			if ( elem.removeAttribute ) elem.removeAttribute( expando );
		}
	},
	// 去重
	unique: function( arr ){
		var ret = [], temp = {};
		try{
			for ( var i = 0, j = arr.length; i < j; i++ ) {
				var id = Q.data( arr[ i ] );

				if ( !temp[ id ] ) {
					temp[ id ] = true;
					ret.push( arr[ i ] );
				}
			}
		}catch(e){
			ret = arr;
		}
		return ret;
	},
	// 截止
	until: function( elem, until ){
		if( typeof until === "string" )
			return !!(elem && elem.innerHTML && elem.innerHTML.indexOf( until ) != -1);
		return contains( elem.parentNode, until ) && (elem == until);
	},
	// 遍历
	dir: function( elem, dir, until ){
		var ret = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !Q.until( cur, until )) ) {
			if ( cur.nodeType === 1 ) {
				ret.push( cur );
			}
			cur = cur[dir];
		}
		return ret;
	},
	// 平级节点
	sibling: function( n, elem ) {
		var ret = [];
		
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				ret.push( n );
			}
		}
		return ret;
	},
	// 单一平级节点
	_sibling: function( cur, dir ) {
		do {
			cur = cur[ dir ];
		} while ( cur && cur.nodeType !== 1 );
	
		return cur;
	}
});

Q.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return Q.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return Q.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return Q._sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return Q._sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return Q.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return Q.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return Q.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return Q.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return Q.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return Q.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return Q.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			Q.merge( [], elem.childNodes );
	}
}, function( name, fn ){
	Q.fn[ name ] = function( until ){
		var ret = Q.map( this, fn, until );
		if( this.length > 1 ){
			// 去重
			if ( !guaranteedUnique[ name ] ) ret = Q.unique( ret );
			// 转置
			if ( rparentsprev.test( name ) ) ret = ret.reverse();
		}
		return this.pushStack( ret );
	}	
});

// 文档规格与位置获取相关
function gw( elem, name, value ){
	var ret = parseInt( Q.getStyle( elem, name ), 10 );
	return isNaN( ret ) ? value || 0 : ret;
}
	Q.extend({
	getSize: function(elem) {
		var width = elem.offsetWidth, height = elem.offsetHeight;
		if ( !width && !height ) {
			var repair = !Q.contains( document.body, elem ), parent;
			if ( repair ) {//如果元素不在body上
				parent = elem.parentNode;
				document.body.insertBefore(elem, document.body.childNodes[0]);
			}
			var style = elem.style,
				cssShow = { position: "absolute", visibility: "hidden", display: "block", left: "-9999px", top: "-9999px" },
				cssBack = { position: style.position, visibility: style.visibility, display: style.display, left: style.left, top: style.top };
			Q.setStyle( elem, cssShow );
			width = elem.offsetWidth; height = elem.offsetHeight;
			Q.setStyle( elem, cssBack );
			if ( repair ) {
				parent ? parent.appendChild(elem) : document.body.removeChild(elem);
			}
		}
		return { "width": width, "height": height };
	},
	getWidth: gw,
	getInnerSize: function(elem){
		var _size = Q.getSize(elem);
		return {
			"width": _size.width - gw(elem,"paddingLeft") - gw(elem,"paddingRight") - gw(elem,"borderLeftWidth") - gw(elem,"borderRightWidth"),
			"height": _size.height - gw(elem,"paddingTop") - gw(elem,"paddingBottom") - gw(elem,"borderTopWidth") - gw(elem,"borderBottomWidth")
		}
	},
	getScrollTop: function(node) {
		var doc = node ? node.ownerDocument : document;
		return doc.documentElement.scrollTop || doc.body.scrollTop;
	},
	getScrollLeft: function(node) {
		var doc = node ? node.ownerDocument : document;
		return doc.documentElement.scrollLeft || doc.body.scrollLeft;
	},
	rect: function(node){
		var left = 0, top = 0, right = 0, bottom = 0;
		//ie8的getBoundingClientRect获取不准确
		if ( !node.getBoundingClientRect || Q.B.IE8 ) {
			var n = node;
			while (n) {
				left += n.offsetLeft, top += n.offsetTop;
				n = n.offsetParent;
			}
			right = left + node.offsetWidth; bottom = top + node.offsetHeight;
		} else {
			var rect = node.getBoundingClientRect();
			left = right = Q.getScrollLeft(node); top = bottom = Q.getScrollTop(node);
			left += rect.left; right += rect.right;
			top += rect.top; bottom += rect.bottom;
		}
		return { "left": left, "top": top, "right": right, "bottom": bottom };
	},
	clientRect: function(node) {
		var rect = Q.rect(node), sLeft = Q.getScrollLeft(node), sTop = Q.getScrollTop(node);
		rect.left -= sLeft; rect.right -= sLeft;
		rect.top -= sTop; rect.bottom -= sTop;
		return rect;
	}
});

// 链式下元素高宽与可视规格
// rect与clientRect返回的数据为矩形坐标，默认使用第一个元素
Q.fn.extend({
	width: function(){
		return arguments.length ? this.css("width",arguments[0]) : Q.getSize(this[0]).width;
	},
	height: function(){
		return arguments.length ? this.css("height",arguments[0]) : Q.getSize(this[0]).height;
	},
	rect: function(){
		return Q.rect(this[0]);
	},
	clientRect: function(){
		return Q.clientRect(this[0]);
	}
});

// Dom操作
Q.extend({
	clear: function( elem ){
		while( elem.firstChild ) elem.removeChild( elem.firstChild );
		return elem;
	},
	genNode: function( value ){
		var genNode = typeof value === "string" ? 
			document.createTextNode( value ) : 
				contains( document.body, value ) ? 
				value.cloneNode( true ) :
				value;
		return genNode;
	},
	append: function( elem, value ){
		elem.appendChild( Q.genNode( value ) );
		return elem;
	},
	prepend: function( elem, value ){		
		elem.insertBefore( Q.genNode( value ), elem.firstChild );
		return elem;
	},
	html: function( elem, value ){
		return Q.append( Q.clear( elem ), value );
	},
	before: function( elem, value ){
		elem.parentNode.insertBefore( Q.genNode( value ), elem );
		return elem.parentNode;
	},
	after: function( elem, value ){
		elem.parentNode.insertBefore( Q.genNode( value ), elem.nextSibling );
		return elem.parentNode;
	},
	insert: function( elem, value, pos ){
		elem.insertBefore( Q.genNode( value ), pos || null );
		return elem;
	}
});

Q.fn.clear = Q.fn.empty = function(){ return this.each( function(){ Q.clear(this); } )};

Q.each({
	append: "append",
	prepend: "prepend",
	before: "before",
	after: "after",
	insert: "insert"
},function( name, original ){
	Q.fn[ name ] = function( arg ){
		return this.each( function(){ Q[original]( this, arg ); } );
	}
});

Q.fn.extend({
	appendTo: function( elem ){
		return this.each( function(){
			Q(elem)[0].appendChild( Q.genNode(this) );
		});
	},
	suicide: function(){
		var parent = this.parent();
		this.each( function(){ this.parentNode.removeChild( this ); } );
		return parent;
	}
});

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
	wrapInner: function( elem, name, options ){
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
	wrap: function( name, options ){
		return this.each( function(){ Q.wrap( this, name, options );});
	},
	wrapInner: function( name, options ){
		return this.each( function(){ Q.wrapInner( this, name, options );});
	},
	wrapAll: function( name, options ){
		if( !this[0] ) return this;
		
		options = Q.extend({ nodeName: "div" }, options || {} );
		
		var wrapper = document.createElement( options.nodeName ), _location = this[0];
		_location.parentNode.insertBefore( wrapper, _location );
		
		delete options.nodeName;
		Q.extend( wrapper, options );
		
		return this.each( function(){ wrapper.appendChild( this ); });
	}
});

// 元素动态效果处理
Q.extend({
	fade: function( elem, options ){
		// There is a non-understand error in old-IE, whose opacity is not work as it should be.
		// So, just avoid to use this method as possible.
		if( elem.nodeType!== 1 ) return;
		if( elem["_state_"] === "fading" ) return;
		elem["_state_"] = "fading";
		options = Q.extend({ from: 0, to: 100, speed: 50, step: 5, hide: false }, options || {});
	    var from = options.from,
			to = options.to,
			speed = options.speed,
			flag =  !!( from < to ), // true为渐显，false为渐隐
			step = options.step * ( flag ? 1 : -1 );
		to = to > 100 ? 100 : to < 0 ? 0 : to;
		from = from > 100 ? 100 : from < 0 ? 0 : from;
	    if( from === to ) return; //相等?!
		Q.show( elem );
	    (function(){
	        Q.opacity( elem, from );
	        from += step;
			if( from > 100 && from - step < 100 ) from = 100;
			if( from < 0 && from - step > 0 ) from = 0;
	        if( flag ? from <= to : from >= to ){ 
				setTimeout( arguments.callee, speed );
			}else{ 
				if( !flag && options.hide && to <= 0 ){ elem.style.display = "none"; Q.opacity( elem, 100 ); }
				if( typeof options.callback === "function" ) options.callback.call( elem );
				elem["_state_"] = "ready";
			}
	    })();
	},
	scroll: function( elem, options ){
		if( elem.nodeType !== 1 ) return;
		options = Q.extend({
			direction: true,				//滚动方向
			speed: 20, 						//滚动间隔
			step: 20,						//滚动步长
			quick: true,					//快速模式
			smooth: 5,						//滚动柔和度
			auto: true,						//自动播放
			start: 500,						//自动播放的起始时间
			width: 0,						//总长
			page: 0,						//每次滚动的长度
			delay: 3000,					//下一次整体滚动的延时
			setwidth: false,				//设置内部宽度(仅在部分float混合元素时错位使用，会改变滚动特效)
			next: null,						//下一个
			prev: null,						//上一个
			nav: null,						//导航菜单
			nodename: "span",				//导航节点名称
			normal: "normal",				//导航常规类
			active: "active",				//导航活动类
			istyle: true,					//使用内部样式
			style:{
				float:"left", width:"14px", height:"14px", display:"block", margin:"0 3px", cursor: "pointer", borderRadius: "50%", opacity: 0.9
			},								//初始化样式
			normalstyle: {
				backgroundColor: "#b5b5b5"
			},								//导航常规样式
			activestyle: {
				backgroundColor: "#c80002"
			},								//导航活动样式
			trigger: "click"				//导航触发方式
		}, options || {} );
		var S = {},										//滚动操作相关函数体
			size = Q.getInnerSize( elem ),				//元素内部长宽
			frame = options.width || size.width,		//总长
			step = options.step,						//步长
			speed = options.speed,						//速度
			index = 0,									//当前滚动
			nav = [],									//导航
			_elem = elem.cloneNode( true ),				//备份
			tmr = null,									//滚动定时器
			state = "ready",							//滚动状态
			nextprev = "done",							//上一个下一个
			width, scrollWidth,							//单次滚动长度与滚动元素总长
			obj = document.createElement("div"),		//滚动操作主体
			div0 = document.createElement("div"),		//滚动包裹层
			div1 = document.createElement("div"),		//生成内部元素
			id =  "_qslinz_scroll_" + Q.now();			//滚动ID
		/*- 生成滚动内部操作代码 -*/
		Q.clear( elem );
		elem.appendChild( obj );
		Q.setStyle( obj, { overflow: "hidden", width: frame + "px" } );
		div1.innerHTML = _elem.innerHTML;
		obj.appendChild( div0 );
		div0.appendChild( div1 );
		Q.setStyle( div0, { overflow: "hidden", zoom: 1, width: "65535px" });
		Q.setStyle( div1, { float: "left" });
		if( options.setwidth ) Q.setStyle( div1, { width: size.width + "px" });
		div0.appendChild(div1.cloneNode(true));
		/*- 操作处理完毕 -*/
		
		scrollWidth = div1.scrollWidth;
		width = options.page || scrollWidth;
		
		S = {
			// 暂停状态
			pause: false,
			// 暂停时的修复状态记录
			fix: 0,
			// 暂停时的滚动方向记录
			mode: false,
			// 指定页码滚动显示处理
			setPage: function(){
				index = Math.round( obj.scrollLeft / frame );
				if ( index > Math.round( div1.offsetWidth / frame + 0.4) - 1) {
					index = 0;
				}
				for( var i = 0; i < nav.length; i++ ) {
					if (i == index ) {
						nav[i].className = options.active;
						if( options.istyle ) Q.setStyle( nav[i], options.activestyle );
					} else {
						nav[i].className = options.normal;
						if( options.istyle ) Q.setStyle( nav[i], options.normalstyle );
					}
				}
			},
			// 滚动主体实现
			scroll: function( move, mode ){
				
				state = "scrolling";
				
				var _move = move / options.smooth,
					direction = typeof mode === "boolean" ? mode : !!options.direction,
					sl;
				
				if( S.pause ){
					S.fix = move;
					S.mode = direction;
					return;
				}
				
				if( !options.quick && _move > step ) _move = step;

				_move = (Math.abs( _move ) < 1 && _move != 0) ? 1 : Math.round( _move );

				if( direction ){
					sl = obj.scrollLeft + _move;
					if( sl >= scrollWidth ) sl = sl - scrollWidth;
					obj.scrollLeft = sl;
				} else {
					sl = obj.scrollLeft - _move;
					if( sl <= 0 ) sl = sl + scrollWidth;
					obj.scrollLeft = sl;
				}
				
				move -= _move;
				
				if (Math.abs(move) == 0) {
					state = "ready";
					nextprev = "done";
					S.fix = width;
					S.mode = direction;
					if ( options.auto ) {
						S.play();
					}
					S.setPage();

				} else {
					S.setPage();
					setTimeout( function(){ S.scroll( move, direction ); }, options.speed );
				}
			},
			next: function(){
				if( state != "ready" ) return;
				state = "ending";
				S.scroll( width );
			},
			play: function (){
				if( !options.auto ) return;
				clearInterval(tmr);
				tmr = setInterval( S.next, options.delay );
			},
			stop: function(){
				clearInterval(tmr);
			},
			page: function( v ) {
				S.pause = true;
				state = "paging";
				setTimeout( function(){ 
					S.pause = false;
					var n;
					if( v === "prev" ) n = -1;
					if( v === "next" ) n = 1;
					if( typeof v === "number") n = v - index; 
					if( n > 0 ){
						S.scroll( ( S.mode ? S.fix : ( width - S.fix || width ) ) + ( n - 1 ) * frame, true );
					} else if( n < 0 ){						
						S.scroll( ( S.mode ? ( width - S.fix || width ) : S.fix ) + ( -n - 1 ) * frame, false );
					} else {
						S.scroll( 0 );
					}
				}, options.speed );
			},
			wait: function(){
				S.pause = true;
			},
			goon: function(){
				if(!S.pause) return;
					S.pause = false;
				if( state === "scrolling" )
					S.scroll( S.fix, S.mode );
			},
			clear: function(){
				elem.parentNode.replaceChild( _elem, elem );
			}
		};
		if( options.auto ) S.play();
		
		/*- 设置操作项 -*/
		Q( elem ).hover( S.wait, S.goon );
		if( options.prev ) Q( options.prev ).click( function(){ S.page("prev"); } );
		if( options.next ) Q( options.next ).click( function(){ S.page("next"); } );
		if( options.nav ){
			var objNav = Q.Q( options.nav ),
				navs = Math.round( div1.offsetWidth / frame + 0.4),
				i, objTemp;
			//
			if( objNav ){
				Q.clear(objNav);
				for( i = 0; i < navs; i++ ){
					objTemp = document.createElement( options.nodename );
					objNav.appendChild( objTemp );
					if( options.istyle ) Q.setStyle( objTemp, options.style );
					nav.push( objTemp );
					if (i == index ) {
						objTemp.className = options.active;						
						if( options.istyle ) Q.setStyle( objTemp, options.activestyle );
					} else {
						objTemp.className = options.normal;			
						if( options.istyle ) Q.setStyle( objTemp, options.normalstyle );
					}
					objTemp.title = (i + 1) + "";
					objTemp._index = i;
					Q.bind( objTemp, options.trigger, function(){ S.page( this._index ); });
				}
			}
		}
		/*- xovel 2014.6.5 scrollFunction -*/
		/*-BUG: 
			分页滚动时，如果同时操作上一个下一个，
			在index数值发生变化的情况下进行时将导致滚动完成之后来回抖动的效果出现
			且页面会一直抖动下去。当再次执行滚动操作时，由index值的未知性将会出现可能的位置错乱
		  -暂无法修复。功能未禁用。避免同时使用翻页功能与NextPrev功能可防止此BUG
		-*/
		
		return {
			elem: elem,
			obj: obj,
			stop: S.stop,
			play: S.play,
			pause: S.pause,
			goon: S.goon,
			clear: S.clear,
			next: function(){ S.page("prev"); },
			prev: function(){ S.page("next"); }
		}
	},
	udscroll: function( elem, options ){
		if( elem.nodeType !== 1 ) return;
		options = Q.extend({
			direction: true,				//滚动方向
			speed: 30,						//滚动速度
			step: 1,						//单次滚动距离
			start: 500,						//滚动起始时间
			width: 0,						//指定宽度
			height: 0						//指定高度
		}, options || {} );
		var S ={},											//操作函数体
			size = Q.getInnerSize( elem ),					//元素内部宽高
			_elem = elem.cloneNode(true),					//克隆备份
			width = options.width || size.width,			//滚动宽度
			height = options.height || size.height,			//滚动的高度
			tmr = null,										//定时器
			obj = document.createElement("div"),			//滚动操作主体
			div0 = document.createElement("div"),			//滚动包裹层
			div1 = document.createElement("div"),			//生成内部元素
			id =  "_qslinz_scroll_" + Q.now();				//滚动ID
		//
		/*- 生成滚动内部操作代码 -*/
		Q.clear( elem );
		elem.appendChild( obj );
		Q.setStyle( obj, { overflow: "hidden", width: width + "px", height: height + "px", position: "relative" } );
		div1.innerHTML = _elem.innerHTML;
		obj.appendChild( div0 );
		div0.appendChild( div1 );
		Q.setStyle( div0, { zoom: 1, position: "relative" });
		Q.setStyle( div1, { height: size.height + "px" });
		div0.appendChild(div1.cloneNode(true));
		/*- 操作处理完毕 -*/
		
		S = {
			scroll: function(){
				var top = gw( div0, "top" ) + options.step * ( !!options.direction ? -1 : 1 );
				if( top >= 0 ) top -= size.height;
				if( top < -size.height ) top += size.height;
				Q.setStyle( div0, { top: top + "px" } );
			},
			play: function(){
				clearInterval(tmr);
				tmr = setInterval( S.scroll, options.speed );
			},
			stop: function(){				
				clearInterval(tmr);
			},
			clear: function(){
				elem.parentNode.replaceChild( _elem, elem );
			}
		};
		
		setTimeout( S.play, options.start );
		
		Q( elem ).hover( S.stop, S.play );
		
		return S;		
	},
	tabs: function( elems, otabs, options ){
		options = Q.extend( {
			node: document,								//对象根节点
			trigger: "mouseover",						//切换触发方式
			normal: "normal",							//常规类
			active: "active",							//活动类
			init: 1,									//初始元素，为0时不做初始化
			fade: false,								//是否渐显
			speed: 30,									//渐显的速度
			step: 5,									//渐显的缓和度
			display:true,								//内容部分显隐方式，为false时将采用className的变更
			keep: true,									//保持手动切换后导航效果
			auto: false,								//自动切换
			start:100,									//自动切换起始时间
			delay: 3000,								//自动切换的时间间隔
			prev: null,									//切换到上一个		
			next: null,									//切换到下一个
			callback: null								//完成后的回调函数
		}, options || {} );
		var navs = Q.Q( elems, options.node ),			//导航对象集合
			cons = !otabs ? 
				null : Q.Q( otabs, options.node ),		//内容对象集合
			i = 0,
			j = navs && navs.length,
			k = cons && cons.length,					//循环与个数
			conFlag = !!( k && j === k ),				//内容切换标志
			_navs = Q( navs ),							//QDom导航
			_cons = Q( cons ),							//QDom内容
			tmr = null;									//自动切换相关定时器									
		//
		if(!j)return;
		_navs.removeClass( options.active ).addClass( options.normal );
		if( options.init && options.keep ) _navs.eq( options.init - 1 ).removeClass( options.normal ).addClass( options.active );
		
		if( cons && conFlag ){
			_cons.hide();
			if( options.init ) _cons.eq( options.init - 1 ).show();
		}
		_navs.on( options.trigger, function(){
			var index = _navs.index( this );
			if( _navs.hasClass(options.active,index)){ return; }
			_tabs( index );
		});
		
		if( !options.keep ){
			_navs.mouseout( function(){ Q( this ).removeClass( options.active ).addClass( options.normal ); _cons.hide(); });
			if( cons && conFlag ) _cons.mouseout( function(){ Q(this).hide(); });
		}
		
		function _tabs( index ){
			_navs.removeClass( options.active ).addClass( options.normal ).eq( index ).removeClass( options.normal ).addClass( options.active );
			if( cons && conFlag ) options.display ? _cons.hide().eq( index ).show() : _cons.removeClass( options.active ).addClass( options.normal ).eq( index ).removeClass( options.normal ).addClass( options.active );
			if( options.fade ) Q.fade( cons[index], { from:0, to:100, speed: options.speed, step: options.step } );
			if( typeof options.callback === "function" ) options.callback.call( cons[index], index );
		}
		//处理自动切换相关
		function _play( v ){
			var id = 0;
			v = (v == -1) ? -1 : 1;
			for( i = 0; i < j; i++ ){
				if( Q.hasClass( navs[i], options.active ) ) id = i + v;
			}
			_tabs( (id+j) % j );
		}
		if( options.prev ){
			Q( options.prev ).click( function(){
				clearInterval(tmr);
				_play(-1);
				if( options.auto ){ tmr = setInterval( function(){ _play(); }, options.delay ); }
			});
		}
		if( options.next ){
			Q( options.next ).click( function(){
				clearInterval(tmr);
				_play();
				if( options.auto ){ tmr = setInterval( function(){ _play(); }, options.delay ); }
			});

		}
		if( options.auto ){
			setTimeout( function(){
				clearInterval(tmr);
				tmr = setInterval( function(){ _play(); }, options.delay );
			}, options.start );
			//鼠标悬停与离开的开闭操作
			_cons.hover(
				function(){ clearInterval(tmr); },
				function(){ clearInterval(tmr); tmr = setInterval( function(){ _play(); }, options.delay );}
			);
			/*2014.7.11 调整导航部分悬停触发对象为父级元素，避免非块级元素在低版本IE下可能会出现的悬停全局失效*/
			_navs.eq(0).parent().hover( 
				function(){ clearInterval(tmr); },
				function(){ clearInterval(tmr); tmr = setInterval( function(){ _play(); }, options.delay );}
			);
		}
	},
	// 元素同一视野内
	always: function( first, second, options ){
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
	}
});

Q.fn.extend({
	fade: function( options ){
		return this.each( function(){ Q.fade( this, options ) });
	},
	fadein: function( options ){
		options = options || {};
		options.from = 0;
		options.to = 100;
		return this.each( function(){ Q.fade( this, options ) });
	},
	fadeout: function( options ){
		options = options || {};
		options.from = 100;
		options.to = 0;
		return this.each( function(){ Q.fade( this, options ) });
	},
	marquee: function( options ){
		options = options || {};
		if( !options.direction ) options.direction = "left";
		return this.each( function(){
			if( options.direction === "up" || options.direction === "down" ){
				options.direction = options.direction === "up" ? true : false;
				var _x = Q.udscroll( this, options );
				if( options.ret ) window[ options.ret ] = _x;
			}
			if( options.direction === "left" || options.direction === "right" ){
				options.direction = options.direction === "left" ? true : false;
				options.smooth = 1;
				options.quick = false;
				options.speed = options.speed || 30;
				options.delay = options.speed;
				options.step = options.step || 1;
				var _x = Q.scroll( this, options );
				if( options.ret ) window[ options.ret ] = _x;
			}
		});
	}
});

// Ajax相关
Q.extend({
	createXHR: function() {
		if( window.XMLHttpRequest ) return new window.XMLHttpRequest();
		if( window.ActiveXObject ) return new window.ActiveXObject("Microsoft.XMLHTTP");
		Q.error("Failed to create an XMLHttpRequest");
		return null;
	},
	ajax: function( options ){
		options = Q.extend({
			url: "",
			method: "post",
			post: null,
			async: true,
			callback: null
		}, options || {} );
		
		var xhr = Q.createXHR();
		if(!xhr) return;		
		
		if( typeof options.callback === "function" ){
			xhr.onreadystatechange = function(){
				if( xhr.readyState == 4 && xhr.status == 200 ){
					options.callback.call( this, xhr.responseText );
				}
			}
		}
		xhr.open( options.method, options.url, options.async );
		
		xhr.send( options.post );
		
	},
	load: function( options ){
		options = Q.extend({
			url: "",																	// 加载的URL地址
			tag: "script",																// 加载的节点名称
			type: "text/javascript",													// 加载的数据类型
			charset: "",																// 加载对象的字符集
			head: document.getElementsByTagName( "head" ).item( 0 ),					// 加载的位置
			id: "",																		// 加载的ID号
			keep: true,																	// 加载完成后保留
			callback: null																// 回调函数
		}, options || {} );
		if( options.url === "" ) return;
		var el = document.createElement( options.tag );
		if( options.type ) el.type = options.type;
		if( options.id ) el.id = options.id;
		if( options.url ) el.src = options.url;
		if( options.charset ) el.charset = options.charset;
		if( el.readyState ){
			el.onreadystatechange = function(){
				if( el.readyState == "loaded" || el.readyState == "complete" ){
					el.onreadystatechange = null;
					if( !options.keep ) options.head.removeChild( el );
					if( typeof options.callback === "function" ) options.callback();
				}
			}
		} else {
			el.onload = function(){
				if( !options.keep ) options.head.removeChild( el );
				if( typeof options.callback === "function" ) options.callback();
			}
		}
		options.head.appendChild( el );
	}
});

// 添加到收藏与首页
Q.extend({
	addFav: function( url, title ){
		if( isIE ){
			//IE类，直接添加
			window.external.AddFavorite( url, title );
		} else {
			if( window.sidebar || window.chrome ){
				//火狐或者谷歌浏览器，需要自行添加书签
				alert("您的浏览器不支持该操作，请使用Ctrl+D手动设置.")
			}else{
				//其他浏览器将通过模拟点击anchor方式，主要适应opera浏览器，搜狗浏览器等
				var _a = document.createElement("a");
				_a.href = "javascript:window.external.AddFavorite('" + url + "','" + title + "');";
				_a.click();
			}
		}
	},
	setHomepage: function(pageURL){
		if (document.all) {
			document.body.style.behavior = 'url(#default#homepage)';
			document.body.setHomePage(pageURL);
		} else {
			try { //IE
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			} catch (e) {
				try { //Firefox
					var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
					prefs.setCharPref('browser.startup.homepage', pageURL);
				} catch (e) {
					alert("您的浏览器不支持该操作，请使用浏览器菜单手动设置.");
				}
			}
		}
	}	
});

Q.fn.extend({
	fav: function( options ){
		options = Q.extend({
			url: document.location.href,
			title: document.title,
			trigger: "click"
		}, options || {} );
		return this.on( options.trigger, function(){ Q.addFav( options.url, options.title ); } );
	},
	homepage: function( options ){
		options = Q.extend({
			url: document.location.host,
			trigger: "click"
		}, options || {} );
		return this.on( options.trigger, function(){ Q.setHomepage( options.url ); } );
	}
});

// Cookie
Q.C = Q.cookie = {
	set: function( name, value, options ){
		options = options || {};
		if( value === null ) options.expires = -1;
		var strCookie = encodeURIComponent(name) + '=' + encodeURIComponent( value );
		if( typeof options.expires === "number" ){
			var date = new Date();
			date.setTime( date.getTime() + options.expires*60*60*1000 );
			strCookie += "; expires=" + date.toGMTString();
		}
		if( options.path ) strCookie += "; path=" + options.path;
		if( options.domain ) strCookie += "; domain=" + options.domain;
		if( options.secure ) strCookie += "; secure";
		
		return document.cookie = strCookie;
	},
	get: function( name, NoDecode ){
		if( name === undefined ) return document.cookie; 
		var _c = document.cookie,
			start = _c.indexOf( name ),
			end = _c.indexOf( ';', start ),
			value = start == -1 ? '': _c.substring( start + name.length + 1, ( end > start ? end : _c.length ) );		
		return !!NoDecode ? value : decodeURIComponent( value );
	},
	del: function( name ){
		var date = new Date();
		date.setTime( date.getTime() - 10000 );
		return document.cookie = name + '=; expires=' + date.toGMTString();
	}
};

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
		}
	})();
	
};


// Mount to window
window.Q = window.QsLn = Q;
})(window);


