//QsLinz.zpic ͼƬ�������Ч��
//����ڲ�Ԫ�ؿ�Ȳ��ǵ��ο�ȵı���������ܻ����һ��������λ�붯��ʧЧ��BUG������������ĳ���
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
