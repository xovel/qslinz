var homePage = {  

  is : function(url) {  

    url = url || window.location.href;  

    if (document.all) {  

      // http://msdn.microsoft.com/en-us/library/ms531394.aspx  

      document.body.style.behavior='url(#default#homepage)';  

      return document.body.isHomePage(url);  

    }  

    return false;  

  },  

  set : function(url) {  

    try {  

      url = url || window.location.href;  

      if (document.all) {  

        if (!homePage.is(url)) {  

          document.body.style.behavior='url(#default#homepage)';  

          document.body.setHomePage(url);  

          return homePage.is(url);  

        }  

        return true;  

      } else if (window.sidebar) {  

        if (window.netscape) {  

          try {  

            netscape.security.PrivilegeManager  

                    .enablePrivilege("UniversalXPConnect");  

          } catch(e) {  

             // this action was aviod by your browser,  

             // if you want to enable��please enter  

             // about:config in your address line,  

             // and change the value of  

             // signed.applets.codebase_principal_support to true  

             alert("��Ǹ�������������֧��ֱ����Ϊ��ҳ��" +  

               "�����������ַ�����롰about:config�����س�" +  

               "Ȼ��[signed.applets.codebase_principal_support]" +  

               "����Ϊ��true��������������ղء�����԰�ȫ��ʾ���������óɹ���");  

          }  

        }  

        var prefs = Components.classes['@mozilla.org/preferences-service;1']  

                      .getService(Components.interfaces.nsIPrefBranch);  

        prefs.setCharPref('browser.startup.homepage',url);  

        return true;  

      }  

      // Not support exception  

      return false;  

    } catch (e) {  

      return false;  

    }  

  }  

} 
/*
��ҿ���ע�⵽homePage.is�ķ�����������ж�IE�������ҳ�Ƿ�Ϊָ����ҳ�ķ��������˵��ǰ������Ѿ���ָ��ҳ����Ϊ��ҳ����ô�Ͳ���Ҫ�ٴ���ʾ��Ϊ��ҳ����Ϣ�ˡ�Ŀǰ��ֻ�ҵ�֧��IE�İ취����ϸ��MSDN�ϵġ�isHomePage Method�� �����������������֧�֣������ͯЬ�кõİ취�ǵ÷���Ŷ:-)

��ͯЬ�������֧��Chrome��������������ź�����Ŀǰ����δ�ҵ��õİ취���������homePage.set����false��˵���޷���Ϊ��ҳ������Chrome��������������ǲ���Ч��һ��Yahoo��������



�Ǻǣ�����ȷʵ�ȽϿ��ţ��������õİ�����ʾ��ϢҲ��һ���̶ȵİ����û�ʵ�����ǵ�����ֻ����û����ô��ݰɡ�

Ҳ��һ����Ҫ��ʾ��Ϊ��ҳ�����������ҳ���û������������棬��ô��ʾ�����ղؽ��ȽϺ��ʣ�aoao���䡶�����������������Ϊ��ҳ����ʾС���ԡ� ������Ҳ��������һ�㡣��������GoogleӢ�ĵ���վ��ͯЬ���ܻ�ע�⵽����ʱGoogle����ʾ�㾭�����ʱ���վ���Ƿ񽫱���վ��Ϊ��ҳ�������ʾ�о��Ƚ����ģ���Ȼʵ�ֵķ���Ҳ�ܼ򵥣���������Cookie��¼�ϴη��ʵ�ʱ��ͷ��ʵĴ������ۺϷ�����

�Ҿ�������û���Ϊ��ҳʧ�ܵ������Ӧ�ø��û�һ��ѡ�񣬱�����ʾ�û��Ƿ�����ղأ���Ȼ����ܸо��Ƚφ��£���ҿ����ȡ��ɡ�

����IE��FireFox�Ĵ���������£�
*/
// url�Ǽ����ղص���ַ  

// title�Ǽ����ղصı���  

function addFavorite(url, title) {  

  try {  

    url = url || window.location.href;  

    title = title || document.title;  

    window.external.addFavorite(url, title);  

  } catch (e) {  

    try {  

      window.sidebar.addPanel(title, url, "");  

    } catch (e) {  

      return false;  

    }  

  }  

  return true;  

} 

//�����Ѿ���Ϊ��ҳ��IE�������������Ϊ��ҳ�����ӣ������Ϊ��ҳʧ������ʾ�����ղصĴ������£�

// ���������homePage��addFavorite����  

function setHomePage(obj, url, title) {  

  if (homePage.is(url)) {  

    obj.style.display = 'none';  

  } else {  

    obj.style.display = '';  

    obj.innerHTML = "��Ϊ��ҳ";  

    obj.onclick = function() {  

      if (!homePage.set(url)) {  

        if (window.confirm('������ҳʧ�ܣ�" +  

                    "�Ƿ񽫱�վ�����ղأ�')) {  

          if (obj.rel == undefined ||  

             obj.rel == '') {  

            obj.setAttribute('rel','sidebar');  

          }  

          if (!addFavorite(url, title)) {  

            alert("�ǳ���Ǹ���޷������ղأ�" +  

                  "�볢��ʹ��Ctrl+D����Command+D������ӡ�");  

            return false;  

          }  

        } else {  

          return false;  

        }  

      }  

      obj.innerHTML = "лл:-)";  

      return false;  

    }  

  }  

}  

// ʹ�õİ취���£�  

// <a id="home" href="#">��Ϊ��ҳ</a>  

// setHomePage(document.getElementById('home') )
