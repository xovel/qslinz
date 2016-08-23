/*
 * [Qs.zLw QsLinz Javascript Library version 0.1.3]
 * TOOLs
 * Written by xovel.
 */

//QsLinz������Ч������������QsLinz.js���Ĳ���

/*
 * Ԫ��ͬһ��Ұ��
 * QsLinz.always.js
    @param:first Object/String ��һ��������Ԫ��
    @param:second Object/String �ڶ���������Ԫ��
 *  @return:�޷���ֵ
 */
Q.always = function( first, second, options ){
	options = Q.extend({
		node: window,						//�ڵ㡣ʹ��window����Ͱ汾IE��document�޷�scroll
		trigger: "scroll"					//������ʽ��һ��Ϊ����
	}, options || {} );
	
	first = Q( first ).get(0);						//��һ��Ԫ��
	second = Q( second ).get(0);					//�ڶ���Ԫ��
	if( !first || !second ) return;
	
	//
	function _always(){
		var clientHeight = document.documentElement.clientHeight,
			height1 = Q.getSize(first).height,
			height2 = Q.getSize(second).height,
			move = height1 < height2 ? first : second,
			stat = height1 > height2 ? first : second,
			ubound = Math.abs( height1 - height2 ),
			_height = Math.min( height1, height2 );
		
		if( height1 === height2 ) return;
		Q.setStyle( move, { position: "relative" } );
	
		var value = parseFloat( Q.getStyle( move, "top" ) ) || 0,
			rect1 = Q.clientRect( move ),
			rect2 = Q.clientRect( stat ),			
			top1 = rect1.top,									//�ƶ�Ԫ�صĶԶ������Ӿ���
			top2 = rect2.top,									//����Ԫ�صĶԶ������Ӿ���
			bottom = clientHeight - rect1.bottom;				//�ƶ�Ԫ�صĶԵײ����Ӿ���
		
		//�ƶ�Ԫ�ض������������ײ��ɼ�
		if( top1 < 0 && bottom > 0 ) value = Math.min( value + bottom, ubound );
		
		//�ƶ�Ԫ�ض����ɼ����ײ����ɼ�
		if( top1 > 0 && bottom < 0 ) value = top2 >=0 ? 0 : value - top1;
		
		//2013.12.23������������ӦԪ�ظ߶�С�ڴ��ڸ߶�ʱ����Ԫ��ֱ�����ײ�������
		if( _height <= clientHeight ){ value = -top2; value = value <= 0 ? 0 : value > ubound ? ubound : value; }
		
		if( value >= 0 && value <= ubound ) Q.setStyle( move, { top: value + "px" } );
	}		
	Q.on( options.node, options.trigger, function(){ _always(); });
};

/*
 * ������������
 * QsLinz.easing.js
 */
Q.extend(Q.easing,{
	easeInQuad: function(t,b,c,d){
		return c*(t/=d)*t + b;
	},		
	easeOutQuad: function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (t, b, c, d) {
		return c - Q.easing.easeOutBounce (d-t, 0, c, d) + b;
	},
	easeOutBounce: function (t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (t, b, c, d) {
		if (t < d/2) return Q.easing.easeInBounce (t*2, 0, c, d) * .5 + b;
		return Q.easing.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	},
	//�򻯵�ease���������Ĵη�
	easeIn: function(t, b, c, d){ return Q.easing.easeInQuart(t,b,c,d);},
	easeOut: function(t, b, c, d){ return Q.easing.easeOutQuart(t,b,c,d);},
	easeInOut: function(t, b, c, d){ return Q.easing.easeInOutQuart(t,b,c,d);}
});

/*
ԭAS�ļ�˵��

Linear���޻���Ч����
Quadratic�����η��Ļ�����t^2����
Cubic�����η��Ļ�����t^3����
Quartic���Ĵη��Ļ�����t^4����
Quintic����η��Ļ�����t^5����
Sinusoidal���������ߵĻ�����sin(t)����
Exponential��ָ�����ߵĻ�����2^t����
Circular��Բ�����ߵĻ�����sqrt(1-t^2)����
Elastic��ָ��˥�����������߻�����
Back��������Χ�����η�������(s+1)*t^3 - s*t^2����
Bounce��ָ��˥���ķ���������
=============================================
easeIn����0��ʼ���ٵĻ�����
easeOut�����ٵ�0�Ļ�����
easeInOut��ǰ��δ�0��ʼ���٣����μ��ٵ�0�Ļ�����

//*/



/*
 * QsLinz.js Tabģ���� 2014.11.22�ع� 
 * QsLinz.tabs.js
 */
Q.tabs = function( nav, con, options ){
	if( arguments.length === 1 ){
		options = nav;
	}	
	options = Q.extend( {
		node: document,						//���ڵ�
		nav: nav,							//����
		con: con,							//����
		trigger: "mouseover",				//�л��Ĵ�����ʽ
		normal: "normal",					//��������
		active: "active",					//�����
		init: 1,							//��ʼ����ʾ��Ԫ�ء�Ϊ0������ʼ��
		fade: 0,							//�л���Ĳ��ֽ��Կ��ء���ֵָ�����Ե��ٶ�
		keep: true,							//�����л�Ч����Ϊfalseʱ��������뿪ʱȡ��Ч��
		conc: false,						//���ݲ���Ҳͨ�����������ķ�ʽ������Ӧ
		auto: 0,							//�Զ��л�����ֵ��ָ��ʱ����
		start: 100,							//�Զ��л�Ч����ʼ���ȴ�ʱ��
		callback: null						//ÿһ���л�Ч����ɺ�Ļص�����
	}, options||{} );
	
	var 
		//�����ڵ�
		Qn = Q( options.nav, options.node ),
		//���ݽڵ�
		Qc = Q( options.con, options.node ),
		//ѭ������
		i = 0, j = Qn.size(), k = Qc.size(),
		//�����Ƿ���ڻ��߶Գ�
		bCon = !!( k && j === k ),
		//�Զ��л���ض�ʱ��
		tmr = null;
		
	//�������������
	if( !j ) return;
	//��������������
	Qn.removeClass( options.active ).addClass( options.normal );
	//���������ĳ�ʼ��
	if( options.init && options.keep ){
		Qn.eq( options.init - 1 ).removeClass( options.normal ).addClass( options.active );
	}
	//����ģ��ĳ�ʼ��Ч��
	if( bCon ){
		options.conc ? Qc.removeClass( options.active ).addClass( options.normal ) : Qc.hide();
		//���ݳ�ʼ��
		if( options.init ){
			options.conc ? Qc.eq( options.init - 1 ).removeClass( options.normal ).addClass( options.active ) : Qc.eq( options.init - 1 ).show();
		}
	}
	//Ч���л�����
	function tabs( index ){
		//������������
		Qn.removeClass( options.active ).addClass( options.normal ).eq( index ).removeClass( options.normal ).addClass( options.active );
		//���ݴ���
		if( bCon ){
			//�����Ĵ���
			var oCon = options.conc ? Qc.removeClass( options.active ).addClass( options.normal ).eq( index ).removeClass( options.normal ).addClass( options.active ).get(0) : Qc.hide().eq( index ).show().get(0);
			//Ԫ�ؽ��Բ���
			if( options.fade ){
				Q.animate( oCon, 'opacity', 1, options.fade, 'linear', null, 0 );
			}
			if( typeof options.callback === "function" ) options.callback.call( oCon, index );
		}
	}
	//����Ч�����
	Qn.on( options.trigger, function(){
		//��ǰ��Ż�ȡ
		var index = Qn.index(this);
		//�������������Ԫ�أ���ʲôҲ����
		if(Qn.hasClass( options.active, index )) return;
		//�����л�Ч���Ĳ���
		tabs(index);
	});
	
	//Ч������
	if( !options.keep ){
		Qn.mouseout( function(){ Q( this ).removeClass( options.active ).addClass( options.normal ); Qc.hide(); });
		if( bCon ) Qc.mouseout( function(){ options.conc ? Q(this).removeClass( options.active ).addClass( options.normal ) : Q(this).hide(); });
	}
	
	//�Զ��л�Ч��ʵ��
	function play(){
		var id = 0;
		//��ȡ�Զ����ŵ���һ��Ԫ��
		for( i = 0; i < j; i++ ){
			if( Qn.hasClass( options.active, i )) id = i + 1;
		}
		//������һ���л�Ч��
		tabs( (id+j) % j );
	}
	
	//�Զ��л�Ч�����
	if( options.auto ){		
		setTimeout( function(){
			clearInterval(tmr);
			tmr = setInterval( function(){ play(); }, options.auto );
		}, options.start );
		//�����ͣ���뿪�Ŀ��ղ���
		Qc.hover(
			function(){ clearInterval(tmr); },
			function(){ clearInterval(tmr); tmr = setInterval( function(){ play(); }, options.auto );}
		);
		/*2014.7.11 ��������������ͣ��������Ϊ����Ԫ�أ�����ǿ鼶Ԫ���ڵͰ汾IE�¿��ܻ���ֵ���ͣȫ��ʧЧ*/
		Qn.eq(0).parent().hover( 
			function(){ clearInterval(tmr); },
			function(){ clearInterval(tmr); tmr = setInterval( function(){ play(); }, options.auto );}
		);
	}
};

/*
 * ҳ���������ʱ��ͼƬ���Լ��غ�����������δ�������ܲ��ԣ�������
 * QsLinz.lazyload.js
 */
Q.lazyload = function( elems, options ){
	
	if( typeof options === "undefined" ){
		options = elems;
		elems = Q.Q( options.selector || "img" );
	}
	
	// ��������ת��
	options = Q.extend({
		attr: "original",		// ԭ�д洢������
		threshold: 0,			// Ԥ���صľ���
		fade: false,			// �Ƿ���
		fades: {},				// ���Բ���
		node: window,			// ���������ڵ�
		trigger: "scroll",		// ������ʽ
		placeholder:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"	// 1x1��png
	}, options || {} );
	
	var lazy = [], i, j, k = 0;
	
	//��Ҫ����lazyload��Ԫ��
	for( i = 0, j = elems.length; i < j; i++ ){
		if( !isInSight( elems[i] ) ) lazy[k++] = elems[i];
	}
	
	// ��ʼ��
	Q.each( lazy, function(){ lazyInit(this); });
	
	// �¼�����
	Q.on( options.node, options.trigger, lazyCore );
	
	// ���庯��
	function lazyCore(){
		if( k === 0 ){
			// �Ѿ�ȫ��������ϣ�������¼����
			Q.unbind( options.node, options.trigger, lazyCore );
			return;
		}
		for(var i = 0,j = lazy.length; i < j; i++ ){
			var obj = lazy[i];
			// δ���ص�Ԫ�ؽ��м���
			if( obj.getAttribute( "lazyload" ) === "false" ){
				if( isInSight( obj ) ) {
					lazyLoad( obj );
				}
			}
		}
	}
	
	// ˽�к������ж�Ԫ���Ƿ��ڿɼ���Χ֮��
	function isInSight( elem ){
		var clientHeight = document.documentElement.clientHeight,
			clientRect = Q.clientRect( elem ),
			top = clientRect.top,
			bottom = clientHeight - clientRect.bottom;
		return top + options.threshold < 0 || bottom + options.threshold  < 0 ? false : true;
	}
	
	//˽�к��������Լ��صĳ�ʼ������
	function lazyInit( elem ){
		var src = elem.src;
		elem.setAttribute( options.attr, src );
		elem.setAttribute( "src", options.placeholder );
		elem.setAttribute( "lazyload", "false" );
	}
	
	//˽�к��������Լ���ͼƬ
	function lazyLoad( elem ){
		var src = elem.getAttribute( options.attr );
		elem.src = src;
		elem.setAttribute( "lazyload", "true" );
		elem.removeAttribute( options.attr );
		--k;
		if( options.fade ){ Q.animate( elem, 'opacity', 1); };
	}
};

/*
 * QsLinz.js��Ԫ�ع������ 2014.11.22
 * QsLinz.scroll.js
 */
/*
	@param:elem Object ���й���������Ԫ��
	@param:direction String/Number �����ķ���1Ϊ���ϣ�2Ϊ���£�3Ϊ����4Ϊ����
	@param:speed Number �������ٶȣ�����ı�����Խ�����Խ��
	@param:height Number ǿ��ָ��������ĸ߶�
*/
Q.scroll = function( elem, direction, speed, width, height ){
	if(!elem) return;
	
	var
		//Ԫ���ڲ��Ĺ��
		size = Q.getInnerSize(elem),
		//Ԫ�ؿ�¡����
		_elem = elem.cloneNode(true),
		//�������ٶȱ�����Խ��Խ��
		speed = speed || 20,
		//������
		wrap = document.createElement("div"),
		//�������Ķ���
		container = document.createElement("div"),
		//ʵ��Ԫ��
		inner = document.createElement("div"),
		//������������
		S = {},
		//����תΪ����
		dirArray = { up: 1, top: 1, bottom: 2, down: 2, left: 3, right: 4 },
		//�����ֱ����ķ���
		dir = typeof direciton === "number" ? direction : (dirArray[(direction||"").toLowerCase()] || 1 ),
		//CSS����
		name = dir === 1 || dir === 2 ? "top" : "left";
	
	//console.log( dir +'@'+ name +'@'+ value+'|'+init + '|'+dir); return new Date()
	
	//���ɹ�������
	Q.clear( elem );
	elem.appendChild(wrap);
	Q.setStyle( wrap, { overflow: "hidden", width: (width || size.width) + "px", height: (height || size.height) + "px", position: "relative" } );
	inner.innerHTML = _elem.innerHTML;
	wrap.appendChild( container );
	container.appendChild( inner );
	Q.setStyle( container, { zoom: 1, position: "relative" });
	if( name === "left") { Q.setStyle(container,"width","65535px"); Q.setStyle(inner,{float:"left"}); }
	
	var
		//���»�ȡ���
		yize = Q.getSize( container.firstChild ),
		//��ֵ���ֵ
		vArray = [0,-yize.height,0,-yize.width,0],
		//����ֵ
		value = vArray[dir],
		//��ʼֵ
		init = vArray[dir-1]
	
	container.appendChild(inner.cloneNode(true));
	//�������
	
	S.play = function(){
		//��ȡ��ʼ����ֵ
		var duration, set = parseFloat( Q.getStyle( container, name ) );
		
		if( isNaN(set) ) set = init;
		
		duration = Math.abs(value - set) * speed
		
		Q.animate( container, name, value, duration, 'linear', function(){
			//���ζ�����ɣ������ƺ���
			Q.setStyle( container, name, init + "px" );
			S.play();
		}, set );
	}
	S.stop = function(){
		Q.stop(container,name);
	}
	S.clear = function(){
		//���Ч��
		S.stop();
		elem.parentNode.replaceChild( _elem, elem );
	}
	
	Q(container).hover(S.stop,S.play);
	
	S.play(); //��ʼ����
	
	return S;
}

/*
 * QsLinz.zpic ͼƬ�������Ч��
 * QsLinz.zpic.js
 * ����ڲ�Ԫ�ؿ�Ȳ��ǵ��ο�ȵı���������ܻ����һ��������λ�붯��ʧЧ��BUG������������ĳ���
 */
Q.zpic = function( elem, options ){
	options = Q.extend({
		prev: null,								//��һ��
		next: null,								//��һ��
		width: 0,								//�ܿ��
		height: 0,								//�ܸ߶�
		page: 0,								//�л��ĵ�Ԫ����
		easing: 'easeOutCirc',					//�л��Ļ�����ʽ
		duration: 300,							//��������ʱ��
		auto: 3000,								//�Զ����ŵ�ʱ����
		init: 500								//�Զ�����Ч����ʼ�ȴ�ʱ��
	}, options||{} );
	
	var
		//Ԫ���ڲ��Ĺ��
		size = Q.getInnerSize(elem),
		//Ԫ�ؿ�¡����
		_elem = elem.cloneNode(true),
		//������
		wrap = document.createElement("div"),
		//�������Ķ���
		container = document.createElement("div"),
		//ʵ��Ԫ��
		inner = document.createElement("div"),
		//��������
		S = {},
		//�Զ����Ŷ�ʱ��
		tmr = null;
	
	//���ɹ�������
	Q.clear( elem );
	elem.appendChild(wrap);
	Q.setStyle( wrap, { overflow: "hidden", width: (options.width || size.width) + "px", height: (options.height || size.height) + "px", position: "relative" } );
	inner.innerHTML = _elem.innerHTML;
	wrap.appendChild( container );
	container.appendChild( inner );
	Q.setStyle( container, { zoom: 1, position: "relative" });
	Q.setStyle(container,"width","65535px");
	Q.setStyle(inner,{float:"left"});
	
	size = Q.getSize(inner); 	//���»�ȡ�ڲ�Ԫ�ع��
	
	container.appendChild(inner.cloneNode(true));
	//�������
	
	S.play = function(v){		
		if(S.s==="ing") return;		//��һ����������֮����ʲôҲ����
		v = v === -1 ? -1 : 1;		
		var nLeft = parseFloat(Q.getStyle(container,"left"))||0;
		
		//ʵ���޷�ѭ��
		if( v=== -1 && nLeft >= 0){nLeft = -size.width;}
		if( v===1 && Math.abs(nLeft) >= size.width ) {nLeft = 0} 
		
		//���ñ�־��ִ�ж���Ч��
		S.s = "ing";	
		Q.animate( container, "left", nLeft - v * options.page, options.duration, options.easing, function(){S.s="done";}, nLeft );
		
	}
	
	//�Զ��������
	if(options.auto){
		setTimeout(function(){tmr = setInterval( S.play, options.auto );}, options.init);
		Q(container).hover(function(){
			clearTimeout(tmr);
		},function(){
			clearTimeout(tmr);
			tmr = setInterval( S.play, options.auto );
		});
	}
	
	//��һ����һ���¼���
	Q.bind(options.prev,"click",function(){clearTimeout(tmr);S.play(-1);if(options.auto){tmr=setInterval(S.play,options.auto);}});
	Q.bind(options.next,"click",function(){clearTimeout(tmr);S.play();if(options.auto){tmr=setInterval(S.play,options.auto);}});
		
	//���Ч��
	S.clear = function(){clearTimeout(tmr);Q.stop(container,"left");elem.parentNode.replaceChild( _elem, elem );};
	return S;  //to min: return���ǰ������нضϣ�����break 2014.12.4
}

/*
 * QsLinz �Ի�����
 * QsLinz.Dialog.js
 */
Q.dialog = Q.dialogue = function( options ){
	options = Q.extend({
		drag: true,				//����ק
		fadein: 0,				//��ʱ����
		fadeout: 0,				//�ر�ʱ����
		top: 200,				//��ʼ�߶�
		left: 300,				//��ʼ��߾�
		width: 600,				//�����Ŀ��
		title: "\u63d0\u793a",	//���⣬Ĭ��Ϊ����ʾ��
		core: "",				//��������
		tip: "",				//��ʾ����
		confirm: true,			//ȷ�ϰ�ť
		onshow: null,			//���ڵ�����ִ�еĺ���
		callback: null,			//���ڹرպ�ִ�еĺ���
		auto: 0,				//�Զ���ʧ��Ϊ0����ʧ
		opacity: 0.8,			//����͸����
		background: "#ccc",		//����ɫ
		zindex: 99999			//z-index����
	}, options || {} );
		
	//��������
	var bg = document.createElement("div");
	document.body.appendChild( bg );
	
	//�趨��������ʽ
	Q.setStyle(bg,{position:"absolute",width:"100%",top:"0px",left:"0px",zIndex:(options.zindex-1),backgroundColor:options.background,opacity:options.opacity,height:Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + "px",cursor:"not-allowed"});
	
	//����������
	var qd = document.createElement("div");
	document.body.appendChild( qd );
	
	//�������������ʽ
	Q.setStyle(qd,{position:Q.B.isIE6?"absolute":"fixed",top:options.top+"px",left:options.left+"px",border:"1px solid #ccc",padding:"5px",zIndex:options.zindex,backgroundColor:"#999",width:options.width+"px"});
	
	//����ͷ��
	var head = document.createElement('div');
	qd.appendChild(head);
	head.style.cssText = 'height: 30px; background-color: blue; line-height: 30px; width: 100%;'
	head.innerHTML = '<h3 style="float: left; color: white; font-size: 14px; text-indent: 1em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 80%;">'+options.title+'</h3>'
	
	//ͷ���رհ�ť
	var off = document.createElement('div');
	head.appendChild(off);
	off.style.cssText = 'float: right; height: 20px; line-height: 20px; font-family: microsoft yahei; margin-right: 5px; margin-top: 5px; color: red; font-weight: bolder; cursor: pointer; width: 20px; background-color: #ccc; text-align: center;'
	off.title = '\u5173\u95ed';
	off.innerHTML = 'X';
	
	//չʾ����
	var core = document.createElement('div');
	qd.appendChild(core);
	core.style.cssText = 'background-color: white; padding: 20px;';
	if(options.core.nodeType === 1){core.appendChild(options.core);}else{core.innerHTML = options.core;}
	
	//��ʾ���
	var tip = document.createElement('div');
	core.appendChild(tip);
	tip.style.cssText='font-size:12px;margin-top:10px;border-top:2px solid #333;';
	tip.innerHTML = options.tip;
	if(!options.tip) tip.style.display="none";
	
	//ȷ����ť
	if(options.confirm){
		var cfmbox = document.createElement('div');
		qd.appendChild(cfmbox);
		cfmbox.style.cssText='padding: 8px 10px; height: 26px; text-align: right; border-top: 1px solid #ccc;background-color:#F2F2F2;';
		var cfm = document.createElement('button');
		cfmbox.appendChild(cfm);
		cfm.style.cssText='background-color: rgb(0, 102, 204); vertical-align: middle; overflow: hidden; margin-right: 3px; padding: 0px; height: 23px; border: 1px solid rgb(153, 153, 153); cursor: pointer; box-shadow: rgb(229, 229, 229) 0px 1px 0px;';
		cfm.innerHTML = '<strong style="padding: 0px 10px; line-height: 21px; color: white; font-size: 14px; font-family: microsoft yahei;">\u786e\u5b9a</strong>';
	}
	
	//��ʼ�����
	if( options.fadein ){
		Q.animate(qd,"opacity",1,options.fadein,"linear",options.onshow,0);
	}else{
		if( typeof options.onshow === "function" ) options.onshow.call(qd);
	}
	
	//�رղ���
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
		
		//�Ƴ�������������
		document.body.removeChild(bg);
		document.body.removeChild(qd);
		
		if( typeof options.callback === "function" ){
			options.callback();
		}
	}
	
	//�ر�Ч������
	Q.bind(off,"click",qClose);
	if(options.confirm) Q.bind(cfm,"click",qClose);
	
	//�Զ��ر�Ч������
	if(options.auto){
		var tmcd = parseInt( options.auto, 10 ), _tmrTip = null;
		tip.style.display = "block";
		(function(){
			if( qd.style.display === "none" ){
				clearTimeout( _tmrTip );
				tip.innerHTML = options.tip;
				return; //�ر���ֱ���˳�����
			}
			if( tmcd > 0 ){
				tip.innerHTML = options.tip + "" +  tmcd + "\u79d2\u540e\u5173\u95ed"; //ָ����֮��ر�
				--tmcd;
				_tmrTip = setTimeout( arguments.callee, 1000 );
			} else{
				tip.innerHTML = options.tip;
				qClose();
			}			
		})();
	}
	
	//��ק��ʵ��
	if( options.drag ){
		var dragData = {};		
		head.style.cursor = "move";
		
		head.onmousedown = function( e ){
			try{ dragObj( qd, e, 1 ); }catch(ex){}
		};
	}
	
	//˽�к�������ק����
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
	
	//��ֹ�¼���ð����Ĭ����Ϊ
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

// QsLinz.js 0.1.2 �����ķ���
// Ԫ�ذ������
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
