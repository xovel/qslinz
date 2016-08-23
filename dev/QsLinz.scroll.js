//QsLinz.js��Ԫ�ع������ 2014.11.22
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