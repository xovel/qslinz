/*
 * Qs.zLw QsLinz Javascript Library version 0.1.3
 * A simple but funny javascript library.
 * Last Update: Tue Mar 24 2015 14:10:27 GMT+0800 CST
 */

;(function( window, undefined ) {

var core_version = "0.1.3",
	
	readyList = [],	
	
	// Like sandbox
	location = window.location,
	document = window.document,
	docElem = document.documentElement,
	
	// Backup for pre-Q
	_Q = window.Q;

var Q = function( selector, context ){
	return new Q.fn.init( selector, context );
};

Q.fn = Q.prototype = {
	
	version: core_version,
	
	constructor: Q,
	
	init: function( selector, context ){
		
		if( !selector ) return this;
		
		var sType = typeof selector;
		
		if( sType === "function" ){
			return Q.ready( selector );
		}
		
		if( sType === "string" ){
			
			var ret = Q( Q.Q( selector, context ) );
			ret.selector = selector;
			if( context ) ret.context = context;
			
			return ret;
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
	
	length: 0,
	
	toArray: function(){
		return [].slice.call( this );
	},
	get: function( num ){
		return typeof num !== "number" ? this.toArray() : num < 0 ? this[ this.length + num ] : this[ num ];
	},
	
	size: function(){
		return this.length;
	},
	
	// Take a trick on the console: 
	// if an object with the property length has a splice method, the console will consider it as ArrayLike.
	push: [].push,
	sort: [].sort,
	splice: [].splice
};

//������ʽ����
Q.fn.init.prototype = Q.fn;

//Prototype.js���������չ�����򻯰�
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
		//������չ��������ԭ�����ԣ�����deepΪ��ʱ��ǿ�Ƹ���
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
	},
	trim: function( str ){ 
		return String.prototype.trim ? 
			String.prototype.trim.call( str ) :
			str.replace( /^\s+|\s+$/g, "" );
	}
});

//�ĵ��������
Q.ready = function () {
	
	var timer = null,
	
	_readyEx = function( fn ){
		if( Q.isReady ){
			//�ĵ����Ѿ�����ֱ��ִ��
			fn();
		} else {
			//δ������ѹ���б�ȴ�ִ��
			readyList.push( fn );
		}
	},
	
	_readyPro = function(){
		for( var i = 0, j = readyList.length; i < j; i++ ){
			//����ִ�б�ѹ��Ķ���
			readyList[i]();
		}
	},
	
	_readyBind = function(e){
		
		if( Q.isReady ) return;  //�Ѿ���
		
		Q.isReady = true;  //ִ��ʱ��ζ�Ѿ�����
		
		_readyPro();  //ִ�У�
		
		if( document.removeEventListener ){
			document.removeEventListener( "DOMContentLoaded", _readyBind, false );   //�¼��Ƴ�			
		} else if( document.detachEvent ){
			
			document.detachEvent( "onreadystatechange", _readyBind );  //IE�¼��Ƴ�
			
			if( window == window.top ){
				clearInterval( timer );  //�����ʱ��
				timer = null;
			}
		}
	};
	
	if ( document.addEventListener ) {
		document.addEventListener( "DOMContentLoaded", _readyBind, false );	//�¼�����
	} else if ( document.attachEvent ) {
		document.attachEvent( "onreadystatechange", function () {
			if ( document.readyState == "load" || document.readyState == "complete" ) _readyBind(); //IE���ĵ�����
		});
		if ( window == window.top ) {
			//���ݴ������������µĶ�ʱִ��
			timer = setInterval(function () {
				try {
					Q.isReady || document.documentElement.doScroll('left');
				} catch (e) {
					//����Ԥ���������ɣ����ĵ��޷�ִ��doSrcollʱ
					return;
				}
				_readyBind();
			}, 5);
		}
	}
	return _readyEx;
}();

//�ж�����
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

//���ӹ��ߺ�����2014.10.2���
//���������жϣ����ִ���[isWindow,isNumeric,isArrayLike,isEmptyObject]����jQuery1.10.2
Q.extend({
	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},
	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},
	isString: function( unkown ){ return Q.type( unkown ) === "string"; },
	isFunction: function( unkown ){ return Q.type( unkown ) === "function"; },
	isObject: function( unkown ){ return Q.type( unkown, true ) === "object"; },
	isArray: function( unkown ){ return Q.type( unkown ) === "array"; },
	isArrayLike: function( unkown ) {
		var type = Q.type( unkown ), length;
	
		if ( Q.isWindow( unkown ) ) {
			return false;
		}
		
		if( type === "array" ) { 
			return true;
		}
		
		if( type === "object" ) length = unkown.length;
	
		if ( unkown.nodeType === 1 && length ) {
			return true;
		}
	
		return type === "array" || type !== "function" &&
			( length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in unkown );
	},
	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},
	isHTMLElement: function( unkown ){ return /element/.test( Q.type( unkown ) ); },
	isNode: function( unkown ){ return !!unkown && unkown.nodeType && unkown.nodeType === 1 || false; }
});

// ѡ��������ͨ�ã��������ţ�QinF
Q.$ = function( id ){ return document.getElementById( id ); };
Q.$$ = function( selector, node ){	
	
	if( typeof selector !== "string" ) return selector || node || document;
	
	if( node === null ) return null;
	
	var node = node || document,	
		//һ��������ʽ
		rID = /^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,
		rCLASS = /\.((?:\.|[\w-]|[^\x00-\xa0])+)/,
		rTAG = /^((?:\\.|[\w*-]|[^\x00-\xa0])+)/,
		//rATTR = /\[((?:\\.|[\w-]|[^\x00-\xa0])+)(?:([*^$|!~]?=)((?:\\.|[\w-]|[^\x00-\xa0])+))?\]/,
		//rATTR = /\[((?:\\.|[\w-]|[^\x00-\xa0])+(?:=(?:\\.|[\w-*(.)^$|!~?=+-]|[^\x00-\xa0])+)?)\]/,
		rATTR = /\[(.+)\]/,
		rSN = /\[([+-]?\d+)\]/,
		rPSEUDO = /:(?:([~!^]?))(.+)/,
		
		//split the selector by space
		selectors = selector.split(/\s+/),
		
		selector_core = selectors[0],
		selector_main = selector_core.split(":")[0],
		selector_rest,
		
		//elements [may] exist in the core selector
		core_tag = "*",
		core_class = "",
		core_attr = "",
		core_sn = null,
		core_pseudo = null,
		
		//�洢���
		elems, elemt = [],
		
		//Attr��Pseudoר�ñ���
		name, value, rTest, attr,
		
		//ѭ�����������
		i, j, k = 0, l = 0;
	
	//������ϵ����
	j = node.length
	if( j ){
		if( j === 1 ){
			// ��ǰ������ֻ��һ��ֵ��ֱ������һ��ֵ���к�����ѡ��
			node = node[0];
		}else{
			// �������кϲ�
			var ret = [], one;
			for( i = 0; i < j; i++ ){
				one = Q.$$( selector, node[i] );
				if( one ) ret = Q.makeArray( one, ret );
			}
			return ret.length > 0 ? Q.unique( ret ) : null;
		}
	}
	
	//�����������
	if( selectors.length === 1 ){
		//ID
		if( rID.test( selector_core ) ) return Q.$( RegExp.$1 );
		
		//TAG
		if( rTAG.test( selector_core ) ) core_tag = RegExp.$1;
		
		//CLASS
		if( rCLASS.test( selector_main ) ) core_class = RegExp.$1;
		
		//SN
		if( rSN.test( selector_main ) ) core_sn = parseInt( RegExp.$1, 10 );
		
		//ATTR
		if( rATTR.test( selector_main ) ) core_attr = RegExp.$1;
		
		//Pseudo
		if( rPSEUDO.test( selector_core ) ) core_pseudo = selector_core.match(rPSEUDO);
		
		//��Tag��ʽ������ӦԪ��
		elems = node.getElementsByTagName ? node.getElementsByTagName( core_tag ) : null;
		
		if( !elems ) return null;
		
		if( core_class !== "" ){
			for( i = 0, j = elems.length; i < j; i++ ){
				if( Q.hasClass( elems[i], core_class.replace( /\./g , " " ) ) ) elemt[ k++ ] = elems[i];
			}
			elems = elemt;
			elemt = [];
		}
		
		k = elems.length;		
		if( k === 0 ) return null;
		
		//�����������ţ�ֱ�ӷ�����Ŷ�Ӧ��Ԫ�أ���Ų��ڷ�Χ֮���򷵻�null
		if( core_sn !== null ){
			j = +core_sn + ( core_sn < 0 ? k : 0 );
			return j >= 0 && j < k ? elems[j] : null;
		}
		
		//�������ѡ��������ɸѡ������ɸѡ������������ʽ�����á�
		k = 0;
		if( core_attr !== "" ){
			
			name = core_attr.split("=")[0];
			value = core_attr.split("=")[1];
			
			rTest = new RegExp( value ); // eval(value)
						
			for( i = 0, j = elems.length; i < j; i++ ){
				attr = elems[i].getAttribute( name );
				if( value ){
					if( rTest.test( attr ) ) elemt[ k++ ] = elems[i];
				}else{
					if( attr != null ) elemt[ k++ ] = elems[i];
				}
			}
			elems = elemt;
			elemt = [];
		}
		
		k = elems.length;		
		if( k === 0 ) return null;
		
		//��չѡ������html�������Ƿ������أ�����������ʽƥ�䣬���á�
		k = 0;
		if( core_pseudo ){
			rTest = new RegExp( core_pseudo[2] );
			switch(core_pseudo[1]){
				case '!':
					for( i = 0, j = elems.length; i < j; i++ ){
						if( !rTest.test( elems[i].innerHTML ) ) elemt[ k++ ] = elems[i];
					}
					break;
				case '^':
					for( i = 0, j = elems.length; i < j; i++ ){
						if( !rTest.test( elems[i].outerHTML ) ) elemt[ k++ ] = elems[i];
					}				
					break;
				case '~':
					for( i = 0, j = elems.length; i < j; i++ ){
						if( rTest.test( elems[i].outerHTML ) ) elemt[ k++ ] = elems[i];
					}				
					break;
				default: 
					for( i = 0, j = elems.length; i < j; i++ ){
						if( rTest.test( elems[i].innerHTML ) ) elemt[ k++ ] = elems[i];
					}				
					break;
			}
			elems = elemt;
			elemt = [];
		}
		
		return elems.length > 0 ? Q.makeArray(elems) : null;  //�������鷵���Ա���Safari�µ�Nodelist����function��BUG�� 2014.11.8
	}else{
		//drop the first element
		selectors.shift();
		
		//join the rest selectors
		selector_rest = selectors.join(" ");
		
		//recursion
		return Q.$$( selector_rest, Q.$$( selector_core, node ) );
	}
};

Q.Q = function( selector, context ){
	return Q.UCS ? Q.UCS( selector, context ) : Q.$$( selector, context );
};

// CSS��������
// 2014.7.12 �����Ͱ汾IE��ȡclass����ʱ��û��classNameʱΪnull������
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
		name = ret.join( " " );
		name = Q.trim( name );
		elem.className = name;
		return name;
	},
	toggleClass: function( elem, name ){
		if( typeof elem !== "object" ) return;
		var _name = name.split(/\s+/), _ori = ( elem.className || "" ).split(/\s+/),
			b, i, j, m, n, k = 0, ret = [];
		
		//��һ������������
		for( i = 0, j = _ori.length; i < j; i++ ){
			b = false;
			for( m = 0, n = _name.length; m < n; m++ ){
				if( _name[m] === _ori[i] ){ b = true; break; }
			}
			if( !b ) ret[k++] = _ori[i];
		}
		
		//�ڶ������������
		for( i = 0, j = _name.length; i < j; i++ ){
			b = true;
			for( m = 0, n = _ori.length; m < n; m++ ){
				if( _ori[m] === _name[i] ){ b = false; break; }
			}
			if( b ) ret[k++] = _name[i];
		}		
		
		name = ret.join( " " );
		name = Q.trim( name );
		elem.className = name;
		return name;
	}
});

// ��ʽ����
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
		return this.each(function(){ Q.toggleClass( this, name ); });
	}		
});

// ���ܼ��
// 2015.3.23��ӣ�����ժ��jQuery1.10.2
Q.support = (function(support){
	
	/*
	var all, a, div = document.createElement("div");
	
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}
	
	a.style.cssText = "top:1px;float:left;opacity:.5";
	
	support.leadingWhitespace = div.firstChild.nodeType === 3;
	support.tbody = !div.getElementsByTagName("tbody").length;
	support.style = /top/.test( a.getAttribute("style") );
	support.hrefNormalized = a.getAttribute("href") === "/a";
	support.opacity = /^0.5/.test( a.style.opacity );
	support.cssFloat = !!a.style.cssFloat;
	
	div = all = a = null; // Avoid leaks in IE	
	*/
	
	var div = document.createElement("div");
	
	//div.setAttribute( "className", "t" );
	div.style.cssText = "top:1px;float:left;opacity:.5";
	
	support.style = /top/.test( div.getAttribute("style") );
	support.opacity = /^0.5/.test( div.style.opacity );
	support.cssFloat = !!div.style.cssFloat;
	
	div = null; // Avoid leaks in IE
	
	return support;
})({});

// CSS���ĵ����Բ������
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
	setStyle: function( obj, style, valueSet ) {
		if( typeof obj !== "object" ) return;
		if( typeof style == "string" ){ var _style = style; style = {}; style[ _style ] = valueSet; }
		
		for( var name in style ){
			var value = style[ name ];
			if( name == "opacity" && !Q.support.opacity ){
				var _cur = this.currentStyle,
					_ori = _cur && _cur.filter || "",
					_value = "alpha(opacity=" + (value * 100 | 0) + ")";
				_ori = _ori === "" ? _value : _ori.replace( /alpha\([^)]*\)/, "" ) + " " + _value;
				obj.style.zoom = 1; // 2014.11.7 IE�·ǲ�����ʽ�޷�ʵ��͸���ȣ���Ҫǿ��ָ��zoomֵ��
				obj.style.filter = _ori;
			}else if( name == "float" ) { 
				//obj.style[ Q.isIE ? "styleFloat" : "cssFloat" ] = value; // IE9+��Opera��֧��cssFloat
				obj.style[ Q.support.cssFloat ? "cssFloat" : "styleFloat" ] = value; // 2015.3.23 ����support����float
			}else{
				// 2015.3.23 ���봿��ֵ�ж�
				if( typeof value === 'number' && (/width|height|top|bottom|right|left|margin|padding/i).test(name) ) {
					value = value + 'px';
				}
				
				/**/
				obj.style[ Q.camelCase( name ) ] = value;
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
		
		if( '|button|textarea|input|object|select|img|'.indexOf( '|' + tagName + '|' ) != -1 ) value = "inline-block";
		
		if( '|span|a|b|u|i|label|strong|em|'.indexOf( '|' + tagName + '|' ) != -1 ) value = "inline";
		
		if( tagName in oDisplay ) value = oDisplay[tagName];
		
		Q.setStyle( elem, "display", value );
	} /*,
	// IE͸����
	opacity: function( obj, value ){ 
		if( typeof obj !== "object" ) return;
		if( obj.filters ){
			obj.style.zoom = 1;
			obj.style.filter = (obj.currentStyle && obj.currentStyle.filter || "").replace( /alpha\([^)]*\)/, "" ) + " alpha(opacity=" + value + ")";
		}else{
			obj.style.opacity = value/100;
		}
	}*/ //2014.11.21 ȡ��������Ԫ��͸���ȷ���
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

// ������ж����
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
		isFirefox: /firefox/.test(ua),
		isAndroid: /android/.test(ua),
		isOpera: /opera/.test(ua),
		isSafari: /webkit/.test(ua) && !/chrome/.test(ua)		
	}
}( window.navigator.userAgent );

//�¼�������
function contains(parentNode, childNode){
	if (parentNode.contains) {
		return parentNode != childNode && parentNode.contains(childNode);
	} else {
		return !!(parentNode.compareDocumentPosition(childNode) & 16);
	}
};
//2014.7.11 �޸�FireFox��û��window.event���������
/*function getEvent(e){ return e||window.event||arguments.callee.caller.arguments[0]; };
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
};*/
// 2015.3.30 ����FireFox�µ��ú�����ʱ������ȷ��ȡ���ö����BUG��
// ʵ�ַ�ʽ��ԭ
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
	/*
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
	}, // ����Sizzle�ڲ����� *////**/
	bind: function( obj, type, fun ){
		if( !obj || Q.type(fun) !== "function" ) return;
		
		//��������mouseover��mouseout��ؼ�������
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
			//obj[ "e" + type + fun ] = fun;
			//obj.attachEvent( "on" + type, function(){ obj[ "e" + type + fun ].call( obj, window.event ); } );
			obj.attachEvent( "on" + type, function(){ fun.call( obj, window.event ); } ); // 2014.11.21 ȡ��Ԫ����������ת�Ʒ���
		}else{
			obj[ "on" + type ] = fun;
		}
	},
	unbind: function( obj, type, fun ){
		if( !obj || Q.type(fun) !== "function" ) return;
		if( obj.removeEventListener ){
			obj.removeEventListener( type, fun, false );
		}else if( obj.detachEvent ){
			//obj.detachEvent( "on" + type, obj[ "e" + type + fun ] );
			//obj[ "e" + type + fun ] = null;
			obj.detachEvent( "on" + type, fun ); // 2014.11.21 ȡ��Ԫ����������ת�Ʒ���
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

// �����¼����
Q.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event
	Q.fn[ name ] = function( fn ) {
		return this.each( function(){ Q.on( this, name, fn ); } );
	};
});

// ��ʽ�������
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

// �Զ����¼���أ���������档��Ҫʹ��fire���������ֶ�������
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
}

// ��ȡ��ǿ��ָ��HTML����
Q.each({
	html: "innerHTML",
	HTML: "outerHTML",
	text: "innerText",
	TEXT: "outerText"
}, function( name, prop ){
	Q.fn[ name ] = function( value, index ){
		if( typeof value === "string" ){
			//index === "all" ?
			//2015.3.23 �޸ĵڶ�������Ϊ��ʱ��������Ԫ��
			index === undefined ?
			this.each( function(){ this[ prop ] = value; } ) : 
			this[ typeof index === "number" ? index : 0 ][ prop ] = value;
			return this;
		} else {
			return this[ typeof value === "number" ? value : 0 ][ prop ];
		}
	}
});

// Ԫ�ع���������
Q.fn.extend({
	pushStack: function( elems ) {
		// �ػ����
		var ret = Q.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

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
		// ����CSS3ѡ���� nth-child(an+b)
		return this.grep( function(i){ return i % a == (b||0) % a; } );
	},
	even: function(){
		return this.nth(2,1);
	},
	odd: function(){
		return this.nth(2);
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

// ���������ȥ�����
// ��������� jQuery1.10.2, jQuery1.3.1
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
	nodeCheck: function( node, name ){
		var nodeName = node && node.nodeName && node.nodeName.toLowerCase() || "";
		if( typeof name === "string" ) return nodeName === name.toLowerCase();
		return !!nodeName;
	},
	// ���ݱ��
	data: function( elem ){
		elem = elem === window ? {} : elem;
		var id = elem[ expando ];
		// Ԫ�ض�ӦID������������±��
		if( !id ) id = elem[ expando ] = ++qsuid;
		return id;
	},
	// �Ƴ����
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
	// ȥ��
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
	// ��ֹ
	until: function( elem, until ){
		if( typeof until === "string" )
			return !!(elem && elem.innerHTML && elem.innerHTML.indexOf( until ) != -1);
		return contains( elem.parentNode, until ) && (elem == until);
	},
	// ����
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
	// ƽ���ڵ�
	sibling: function( n, elem ) {
		var ret = [];
		
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				ret.push( n );
			}
		}
		return ret;
	},
	// ��һƽ���ڵ�
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
		return Q.nodeCheck( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			Q.merge( [], elem.childNodes );
	}
}, function( name, fn ){
	Q.fn[ name ] = function( until ){
		var ret = Q.map( this, fn, until );
		if( this.length > 1 ){
			// ȥ��
			if ( !guaranteedUnique[ name ] ) ret = Q.unique( ret );
			// ת��
			if ( rparentsprev.test( name ) ) ret = ret.reverse();
		}
		return this.pushStack( ret );
	}	
});

//�ӽڵ����
Q.fn.find = function( selector ){
	if( typeof selector !== "string" ) return this.children();
	var pre_selector = this.selector, context = this.toArray(), ret;
	ret = Q( selector, context );
	ret.selector = pre_selector === "" ? selector : pre_selector + " " + selector;
	ret.prevObject = this;
	ret.context = context;
	return  ret;
};

// �ĵ������λ�û�ȡ���
function gw( elem, name, value ){
	//var ret = parseInt( Q.getStyle( elem, name ), 10 );	
	var ret = parseFloat( Q.getStyle( elem, name ) ); //2014.11.21 �ɻ�ȡ����ֵ��Ϊ��ȡ������ֵ
	//return isNaN( ret ) ? value || 0 : ret;
	return ret || value || 0;
};

Q.extend({
	getSize: function(elem) {
		var width = elem.offsetWidth, height = elem.offsetHeight;
		if ( !width && !height ) {
			var repair = !Q.contains( document.body, elem ), parent;
			if ( repair ) { //���Ԫ�ز���body��
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
		//ie8��getBoundingClientRect��ȡ��׼ȷ
		if ( !node.getBoundingClientRect || Q.B.isIE8 ) {
			var n = node;
			while (n) { left += n.offsetLeft, top += n.offsetTop; n = n.offsetParent; };
			right = left + node.offsetWidth; bottom = top + node.offsetHeight;
		} else {
			var rect = node.getBoundingClientRect();
			left = right = Q.getScrollLeft(node); top = bottom = Q.getScrollTop(node);
			left += rect.left; right += rect.right;
			top += rect.top; bottom += rect.bottom;
		};
		return { "left": left, "top": top, "right": right, "bottom": bottom };
	},
	clientRect: function(node) {
		var rect = Q.rect(node), sLeft = Q.getScrollLeft(node), sTop = Q.getScrollTop(node);
		rect.left -= sLeft; rect.right -= sLeft;
		rect.top -= sTop; rect.bottom -= sTop;
		return rect;
	}
});

// ��ʽ��Ԫ�ظ߿�����ӹ��
// rect��clientRect���ص�����Ϊ�������꣬Ĭ��ʹ�õ�һ��Ԫ��
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

// Dom����
Q.extend({
	clear: function( elem ){
		while( elem.firstChild ) elem.removeChild( elem.firstChild );
		return elem;
	},
	// 2015.3.23 ȡ������HTML�ڵ�ķ������ڴ��������ʱ������ȷ��Ԫ���Ƿ�������߿�¡
	/*
	genNode: function( value ){
		var _genNode = typeof value === "string" ? 
			document.createTextNode( value ) : 
				contains( document.body, value ) ? 
				value.cloneNode( true ) :
				value;
		return _genNode;
	},*/
	append: function( elem, value ){
		elem.appendChild( value /*Q.genNode( value )*/ );
		return elem;
	},
	prepend: function( elem, value ){		
		elem.insertBefore( value /*Q.genNode( value )*/, elem.firstChild );
		return elem;
	},
	html: function( elem, value ){
		return Q.append( Q.clear( elem ), value );
	},  // �˷���������ڶ�������Ϊ�ַ�����ʹ��Q.fn.html��� 2015.3.23
	before: function( elem, value ){
		elem.parentNode.insertBefore( value /*Q.genNode( value )*/, elem );
		return elem.parentNode;
	},
	after: function( elem, value ){
		elem.parentNode.insertBefore( value /*Q.genNode( value )*/, elem.nextSibling );
		return elem.parentNode;
	},
	insert: function( elem, value, pos ){
		elem.insertBefore( value /*Q.genNode( value )*/, pos || null );
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
			Q(elem)[0].appendChild( this /*Q.genNode(this)*/ );
		});
	},
	suicide: function(){
		var parent = this.parent();
		this.each( function(){ this.parentNode.removeChild( this ); } );
		return parent;
	}
});

// Cookie
Q.C = Q.Cookie = {
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

// Ajax���
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
		};
		
		xhr.open( options.method, options.url, options.async );
		
		xhr.send( options.post );
		
	},
	load: function( options ){
		options = Q.extend({
			url: "",																	// ���ص�URL��ַ
			tag: "script",																// ���صĽڵ�����
			type: "text/javascript",													// ���ص���������
			charset: "",																// ���ض�����ַ���
			head: document.getElementsByTagName( "head" ).item( 0 ),					// ���ص�λ��
			id: "",																		// ���ص�ID��
			keep: true,																	// ������ɺ���
			callback: null																// �ص�����
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

// Ԫ�ذ������
// 2015.3.23 ȡ���÷�����
/*
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
*/

// Mount to window
window.Q = window.QsLn = Q;

// 2014.11.21 ȡ���˷���������animate���
/*
// Ԫ�ض�̬Ч������
Q.fade = function( elem, options ){
	// There is a non-understand error in old-IE, whose opacity is not work as it should be.
	// So, just avoid to use this method as possible.
	if( elem.nodeType!== 1 ) return;
	if( elem["_state_"] === "fading" ) return;
	elem["_state_"] = "fading";
	options = Q.extend({ from: 0, to: 100, speed: 50, step: 5, hide: false }, options || {});
	var from = options.from,
		to = options.to,
		speed = options.speed,
		flag =  !!( from < to ), // trueΪ���ԣ�falseΪ����
		step = options.step * ( flag ? 1 : -1 );
	to = to > 100 ? 100 : to < 0 ? 0 : to;
	from = from > 100 ? 100 : from < 0 ? 0 : from;
	if( from === to ) return; //���?!
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
};

//���Խ�����ʽ����
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
	}
});
*///2014.11.21 ȡ���˷���������animate���

//QsLinz����CSS������ 2014.11.21
//Q.A = Q.Animation = Animation = {
Q.extend({
	//���Ķ�������
	/*
		@param:elem Object ���л�����Ԫ��
		@param:name String CSS����
		@param:value Number ���յ��趨ֵ
		@param:duration Number ������ʱ��
		@param:easing Function ��������
		@param:callback Function ��ɺ�Ļص�����
		@param:initForce Number ǿ��ָ���ĳ�ʼֵ
	*/
	animate: function( elem, name, value, duration, easing, callback, initForce ){
		if(!elem) return;
		var 
			//��¼��ǰʱ��
			n = Q.now(),
			//��ʼֵ��ǿ��ָ����ֱ��ʹ�ø�ֵ��͸���Ƚ��Գ�ֵ����Ϊ0������Ĭ��ʹ��Ԫ�س�ʼCSSֵ
			b = typeof initForce === 'number' ? initForce : name === 'opacity' && value === 1 ? 0 : parseFloat( Q.getStyle( elem, name ) ) || 0,
			//�仯ֵ
			c = value - b,
			//����ʱ��
			d = (typeof duration === 'string' ? Q.animate._default[ duration ] : duration) || Q.animate._default.normal,
			//����������δ����ķ���ȫ���������Է���
			e = Q.easing[ easing ] || Q.easing.linear,
			//Ԫ�صĶ�ʱ������
			s = Q.animate._default.timer + name;
		
		//�����ǰ���������еĶ�ʱ����ȡ��֮
		if( elem[s] ) clearInterval(elem[s]);
		
		//͸�����������
		if( name === 'opacity' && Q.getStyle(elem,'display') === 'none' ){
			Q.show( elem );
			Q.setStyle( elem, name, 0 );
		}
		
		//���ö�ʱ��
		elem[s] = setInterval(function(){			
			var v,t = Q.now() - n; //ʱ���
			if( t < d ){
				//���ݻ���������ȡ��ǰ�趨����ֵ
				v = e(t,b,c,d);
				
				//ʱ��δ����ʱ����Ԫ�ص���ʽ
				//if( name !== 'opacity' ) v = v + 'px'; // 2015.3.23 ����������ֵ�趨
				Q.setStyle( elem, name, v );
			} else {
				//��ɺ�Ĳ���
				clearInterval( elem[s] );
				
				//ɾ��Ԫ�صĶ�ʱ������
				//delete elem[s];
				
				//��������ֵ
				//if( name !== 'opacity' ) value = value + 'px'; // 2015.3.23 ����������ֵ�趨
				Q.setStyle( elem, name, value );
				
				//�����ص�
				if( typeof callback === 'function' ) callback.call( elem );
			}		
		},Q.animate._default.interval);
		
		return elem;
	},
	//ֹͣ������Ч
	stop: function( elem, name ){
		if( typeof name === 'string' ){
			clearInterval(elem[Q.animate._default.timer+name]);
		}else{
			for(var p in elem) if(p.indexOf(Q.animate._default.timer)!==-1) clearInterval(elem[p]);
		}
	},
	/*
	t: current time����ǰʱ�䣩��
	b: beginning value����ʼֵ����
	c: change in value���仯������
	d: duration������ʱ�䣩��
	p,s��Elastic��Back��������ѡ���������涼��˵����
	*/
	easing:{		
		linear:function(t,b,c,d){return c*t/d + b;},
		swing:function(t,b,c,d) {return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;}		
	}
});

//����ִ�е�һЩĬ�ϲ���
Q.animate._default={
	interval: 10,
	timer: "timer-",
	normal: 400,
	slow: 600,
	fast: 200
};

//��������
Q.fn.extend({
	animate: function( name, value, duration, easing, callback, initForce ){
		return this.each(function(){
			Q.animate( this, name, value, duration, easing, callback, initForce );
		});
	},
	fadein: function( speed, callback ){
		return this.animate( 'opacity', 1, speed, 'linear', callback, 0 );
	},
	fadeout: function( speed, callback ){
		return this.animate( 'opacity', 0, speed, 'linear', callback, 1 );
	},
	fade: function( speed, start, end, callback ){
		return this.animate( 'opacity', end, speed, 'linear', callback, start );
	},
	slideUp: function( speed, easing, callback ){
		return this.animate( 'height', 0, speed, easing, callback );
	},
	// 2015.3.23 �޸Ĵ������˳������Ϊ�߶ȣ��ٶ�/����ʱ�䣬��������
	slideDown: function( height, speed, easing, callback ){
		return this.animate( 'height', height, speed, easing , callback, 0 );
	},
	stop: function( name ){
		return this.each(function(){
			Q.stop( this, name );
		});
	}
});

// 2015.3.24 ���AMD֧��
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	module.exports = Q;
}
if ( typeof define === "function" && define.amd ) {
	define( "qslinz", [], function() {
		return Q;
	});
}
/**/

})(window);





