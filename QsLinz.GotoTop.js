
//2014.6.28��ӹ�����������Ч��ʵ�ֺ���ΪQ.scrollTo
Q.gotoTop = function( options ){
	
	if( Q.B.isIE6 ) return; 			//IE6�¸�Ч����ֹ
	
	options = Q.extend({
		value: 0,						//��������λ��
		speed: 20,						//�����������
		smooth: 10,						//��Ͷ�
		elem: null,						//��������Ԫ��
		father: document.body,			//����׷�Ӳ�λ
		callback: null,					//��ɻص�����
		bottom: 50,						//�Եײ��ľ���
		right: 560,						//���п��Ҿ���
		zindex: 65535,					//z-indexֵ
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
	if( options.value == 0 ) elem.title = "\u81f3\u9876\u90e8"; //������
	
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
		};
		
	})();
	
};