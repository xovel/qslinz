//QsLinz.js Tabģ���� 2014.11.22�ع�
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