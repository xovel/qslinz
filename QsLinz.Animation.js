//QsLinz����CSS������
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
			s = '_timer' + name;
		
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
				//������ֵ
				if( name !== 'opacity' ) v = v + 'px';
				//ʱ��δ����ʱ����Ԫ�ص���ʽ
				Q.setStyle( elem, name, v );
			} else {
				//��ɺ�Ĳ���
				clearInterval( elem[s] );
				
				//ɾ��Ԫ�صĶ�ʱ������
				//delete elem[s];
				
				//��������ֵ
				if( name !== 'opacity' ) value = value + 'px';
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
			clearInterval(elem['_timer'+name]);
		}else{
			for(var p in elem) if(p.indexOf('_timer')!==-1) clearInterval(elem[p]);
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
	normal: 400,
	slow: 600,
	fast: 200
}

//��д��������
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
	slideUp: function( speed, easing ){
		return this.animate( 'height', 0, speed, easing );
	},
	slideDown: function( speed, height, easing ){
		return this.animate( 'height', height, speed, easing , null, 0 );
	},
	stop: function( name ){
		return this.each(function(){
			Q.stop( this, name );
		});
	}
});

//*/

//������������
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
	easeIn: Q.easing.easeInQuart,
	easeOut: Q.easing.easeOutQuart,
	easeInOut: Q.easing.easeInOutQuart
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

*/

/*
//����
Q.A.animate(Q.$('test'),'opacity',1,3000);

//*/




