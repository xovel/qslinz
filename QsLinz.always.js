
// Ԫ��ͬһ��Ұ��
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