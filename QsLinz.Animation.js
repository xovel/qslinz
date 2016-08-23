//QsLinz简易CSS动画类
//Q.A = Q.Animation = Animation = {
Q.extend({
	//核心动画函数
	/*
		@param:elem Object 进行缓动的元素
		@param:name String CSS名称
		@param:value Number 最终的设定值
		@param:duration Number 持续的时间
		@param:easing Function 缓动方法
		@param:callback Function 完成后的回调函数
		@param:initForce Number 强制指定的初始值
	*/
	animate: function( elem, name, value, duration, easing, callback, initForce ){
		if(!elem) return;
		var 
			//记录当前时间
			n = Q.now(),
			//初始值，强制指定则直接使用该值。透明度渐显初值修正为0，其他默认使用元素初始CSS值
			b = typeof initForce === 'number' ? initForce : name === 'opacity' && value === 1 ? 0 : parseFloat( Q.getStyle( elem, name ) ) || 0,
			//变化值
			c = value - b,
			//持续时间
			d = (typeof duration === 'string' ? Q.animate._default[ duration ] : duration) || Q.animate._default.normal,
			//缓动方法，未定义的方法全部采用线性方法
			e = Q.easing[ easing ] || Q.easing.linear,
			//元素的定时器名称
			s = '_timer' + name;
		
		//如果当前有正在运行的定时器，取消之
		if( elem[s] ) clearInterval(elem[s]);
		
		//透明度相关修正
		if( name === 'opacity' && Q.getStyle(elem,'display') === 'none' ){
			Q.show( elem );
			Q.setStyle( elem, name, 0 );
		}
		
		//设置定时器
		elem[s] = setInterval(function(){			
			var v,t = Q.now() - n; //时间戳
			if( t < d ){
				//根据缓动方法获取当前设定的数值
				v = e(t,b,c,d);
				//修正数值
				if( name !== 'opacity' ) v = v + 'px';
				//时间未超出时设置元素的样式
				Q.setStyle( elem, name, v );
			} else {
				//完成后的操作
				clearInterval( elem[s] );
				
				//删除元素的定时器属性
				//delete elem[s];
				
				//设置最终值
				if( name !== 'opacity' ) value = value + 'px';
				Q.setStyle( elem, name, value );
				
				//函数回调
				if( typeof callback === 'function' ) callback.call( elem );
			}		
		},Q.animate._default.interval);
		
		return elem;
	},
	//停止缓动特效
	stop: function( elem, name ){
		if( typeof name === 'string' ){
			clearInterval(elem['_timer'+name]);
		}else{
			for(var p in elem) if(p.indexOf('_timer')!==-1) clearInterval(elem[p]);
		}
	},
	/*
	t: current time（当前时间）；
	b: beginning value（初始值）；
	c: change in value（变化量）；
	d: duration（持续时间）。
	p,s：Elastic和Back有其他可选参数，里面都有说明。
	*/
	easing:{		
		linear:function(t,b,c,d){return c*t/d + b;},
		swing:function(t,b,c,d) {return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;}		
	}
});

//动画执行的一些默认参数
Q.animate._default={
	interval: 10,
	normal: 400,
	slow: 600,
	fast: 200
}

//重写动画方法
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

//缓动方法增加
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
	//简化的ease方法采用四次方
	easeIn: Q.easing.easeInQuart,
	easeOut: Q.easing.easeOutQuart,
	easeInOut: Q.easing.easeInOutQuart
});

/*
原AS文件说明

Linear：无缓动效果；
Quadratic：二次方的缓动（t^2）；
Cubic：三次方的缓动（t^3）；
Quartic：四次方的缓动（t^4）；
Quintic：五次方的缓动（t^5）；
Sinusoidal：正弦曲线的缓动（sin(t)）；
Exponential：指数曲线的缓动（2^t）；
Circular：圆形曲线的缓动（sqrt(1-t^2)）；
Elastic：指数衰减的正弦曲线缓动；
Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
Bounce：指数衰减的反弹缓动。
=============================================
easeIn：从0开始加速的缓动；
easeOut：减速到0的缓动；
easeInOut：前半段从0开始加速，后半段减速到0的缓动。

*/

/*
//测试
Q.A.animate(Q.$('test'),'opacity',1,3000);

//*/




