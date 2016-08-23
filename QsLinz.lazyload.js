
// ҳ���������ʱ��ͼƬ���Լ��غ�����������δ�������ܲ��ԣ�������
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
