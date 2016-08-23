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

             // if you want to enable，please enter  

             // about:config in your address line,  

             // and change the value of  

             // signed.applets.codebase_principal_support to true  

             alert("抱歉！您的浏览器不支持直接设为首页。" +  

               "请在浏览器地址栏输入“about:config”并回车" +  

               "然后将[signed.applets.codebase_principal_support]" +  

               "设置为“true”，点击“加入收藏”后忽略安全提示，即可设置成功。");  

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
大家可能注意到homePage.is的方法，这个是判断IE浏览器首页是否为指定首页的方法，如果说当前浏览器已经将指定页面设为首页了那么就不需要再次提示设为首页的信息了。目前我只找到支持IE的办法，详细见MSDN上的《isHomePage Method》 ，对于其他浏览器的支持，如果有童鞋有好的办法记得分享哦:-)

有童鞋会问如何支持Chrome这样的浏览器，遗憾的是目前我尚未找到好的办法，所以如果homePage.set返回false则说明无法设为首页，对于Chrome这样的浏览器我们不妨效仿一下Yahoo的做法：



呵呵，这样确实比较夸张，但是良好的帮助提示信息也能一定程度的帮助用户实现他们的需求，只不过没有那么便捷吧。

也不一定非要显示设为首页，如果访问网页的用户来自搜索引擎，那么显示加入收藏将比较合适，aoao在其《兼容所有浏览器的设为首页与显示小策略》 文章中也阐述了这一点。经常访问Google英文的网站的童鞋可能会注意到，有时Google会提示你经常访问本网站，是否将本网站设为首页，这个提示感觉比较贴心，当然实现的方法也很简单，比如利用Cookie记录上次访问的时间和访问的次数来综合分析。

我觉得如果用户设为首页失败的情况下应该给用户一个选择，比如提示用户是否加入收藏，当然这可能感觉比较啰嗦，大家看情况取舍吧。

兼容IE和FireFox的代码具体如下：
*/
// url是加入收藏的网址  

// title是加入收藏的标题  

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

//对于已经设为首页的IE浏览器则隐藏设为首页的链接，如果设为首页失败则提示加入收藏的代码如下：

// 引入上面的homePage和addFavorite函数  

function setHomePage(obj, url, title) {  

  if (homePage.is(url)) {  

    obj.style.display = 'none';  

  } else {  

    obj.style.display = '';  

    obj.innerHTML = "设为首页";  

    obj.onclick = function() {  

      if (!homePage.set(url)) {  

        if (window.confirm('设置首页失败，" +  

                    "是否将本站加入收藏？')) {  

          if (obj.rel == undefined ||  

             obj.rel == '') {  

            obj.setAttribute('rel','sidebar');  

          }  

          if (!addFavorite(url, title)) {  

            alert("非常抱歉，无法加入收藏，" +  

                  "请尝试使用Ctrl+D或者Command+D进行添加。");  

            return false;  

          }  

        } else {  

          return false;  

        }  

      }  

      obj.innerHTML = "谢谢:-)";  

      return false;  

    }  

  }  

}  

// 使用的办法如下：  

// <a id="home" href="#">设为首页</a>  

// setHomePage(document.getElementById('home') )
