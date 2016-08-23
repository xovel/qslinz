// JavaScript Document

;(function( Q ){
// QsLinz����ѡ����
var Q = {};
// ѡ����
Q.hasClass=function( elem, name ){
		if( typeof elem !== "object" ) return;
		var _name = name.split(/\s+/), _ori = elem.className || "", i = 0, j = _name.length;
		
		for( ; i < j; i++ ){
			if( !_ori.match( new RegExp( "(\\s|^)" + _name[i] + "(\\s|$)" ) ) ) return false;
		}
		return true;
	};
	Q.merge=function( first, second ) {
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
	};
	Q.makeArray= function( arr, results ) {
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
	};
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
	if( node.length ){
		var ret = [], one;
		for( i = 0, j = node.length; i < j; i++ ){
			one = Q.$$( selector, node[i] );
			if( one ) ret = Q.makeArray( one, ret );
		}
		return ret.length > 0 ? ret : null;
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
		elems = node.getElementsByTagName ?��node.getElementsByTagName( core_tag ) : null;
		
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
			
			rTest = new RegExp( value, "i" ); //eval(value)
						
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
			rTest = new RegExp( core_pseudo[2], "i" );
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
		
		//console.log(['Tag:'+core_tag,'Class:'+core_class,'SN:'+core_sn,'Attr:'+core_attr,'Pseudo:'+core_pseudo].join('|'));
		
		return elems.length > 0 ? elems : null;
	}else{
		//drop the first element
		selectors.shift();
		
		//join the rest selectors
		selector_rest = selectors.join(" ");
		
		//recursion
		return Q.$$( selector_rest, Q.$$( selector_core, node ) );
	}
};

Q.Q = Q.$$;

window.Q = Q;
})(window);










