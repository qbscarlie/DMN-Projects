!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n||e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){!function(factory){"function"==typeof define&&define.amd?define(factory):void 0!==module&&module.exports?module.exports=factory():window.pym=factory.call(this)}(function(){var lib={},_raiseCustomEvent=function(eventName){var event=document.createEvent("Event");event.initEvent("pym:"+eventName,!0,!0),document.dispatchEvent(event)},_getParameterByName=function(name){var regex=new RegExp("[\\?&]"+name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]")+"=([^&#]*)"),results=regex.exec(location.search);return null===results?"":decodeURIComponent(results[1].replace(/\+/g," "))},_isSafeMessage=function(e,settings){if(("*"===settings.xdomain||e.origin.match(new RegExp(settings.xdomain+"$")))&&"string"==typeof e.data)return!0},_makeMessage=function(id,messageType,message){return["pym",id,messageType,message].join("xPYMx")},_makeMessageRegex=function(id){var bits=["pym",id,"(\\S+)","(.*)"];return new RegExp("^"+bits.join("xPYMx")+"$")},_cleanAutoInitInstances=function(){for(var length=lib.autoInitInstances.length,idx=length-1;idx>=0;idx--){var instance=lib.autoInitInstances[idx];instance.el.getElementsByTagName("iframe").length&&instance.el.getElementsByTagName("iframe")[0].contentWindow||lib.autoInitInstances.splice(idx,1)}};return lib.autoInitInstances=[],lib.autoInit=function(doNotRaiseEvents){var elements=document.querySelectorAll("[data-pym-src]:not([data-pym-auto-initialized])"),length=elements.length;_cleanAutoInitInstances();for(var idx=0;idx<length;++idx){var element=elements[idx];element.setAttribute("data-pym-auto-initialized",""),""===element.id&&(element.id="pym-"+idx+"-"+Math.random().toString(36).substr(2,5));var src=element.getAttribute("data-pym-src"),settings={xdomain:"string",title:"string",name:"string",id:"string",sandbox:"string",allowfullscreen:"boolean",parenturlparam:"string",parenturlvalue:"string",optionalparams:"boolean"},config={};for(var attribute in settings)if(null!==element.getAttribute("data-pym-"+attribute))switch(settings[attribute]){case"boolean":config[attribute]=!("false"===element.getAttribute("data-pym-"+attribute));break;case"string":config[attribute]=element.getAttribute("data-pym-"+attribute);break;default:console.err("unrecognized attribute type")}var parent=new lib.Parent(element.id,src,config);lib.autoInitInstances.push(parent)}return doNotRaiseEvents||_raiseCustomEvent("pym-initialized"),lib.autoInitInstances},lib.Parent=function(id,url,config){this.id=id,this.url=url,this.el=document.getElementById(id),this.iframe=null,this.settings={xdomain:"*",optionalparams:!0,parenturlparam:"parentUrl",parenturlvalue:window.location.href},this.messageRegex=_makeMessageRegex(this.id),this.messageHandlers={},config=config||{},this._constructIframe=function(){var width=this.el.offsetWidth.toString();this.iframe=document.createElement("iframe");var hash="",hashIndex=this.url.indexOf("#");for(hashIndex>-1&&(hash=this.url.substring(hashIndex,this.url.length),this.url=this.url.substring(0,hashIndex)),this.url.indexOf("?")<0?this.url+="?":this.url+="&",this.iframe.src=this.url+"initialWidth="+width+"&childId="+this.id,this.settings.optionalparams&&(this.iframe.src+="&parentTitle="+encodeURIComponent(document.title),this.iframe.src+="&"+this.settings.parenturlparam+"="+encodeURIComponent(this.settings.parenturlvalue)),this.iframe.src+=hash,this.iframe.setAttribute("width","100%"),this.iframe.setAttribute("scrolling","no"),this.iframe.setAttribute("marginheight","0"),this.iframe.setAttribute("frameborder","0"),this.settings.title&&this.iframe.setAttribute("title",this.settings.title),void 0!==this.settings.allowfullscreen&&!1!==this.settings.allowfullscreen&&this.iframe.setAttribute("allowfullscreen",""),void 0!==this.settings.sandbox&&"string"==typeof this.settings.sandbox&&this.iframe.setAttribute("sandbox",this.settings.sandbox),this.settings.id&&(document.getElementById(this.settings.id)||this.iframe.setAttribute("id",this.settings.id)),this.settings.name&&this.iframe.setAttribute("name",this.settings.name);this.el.firstChild;)this.el.removeChild(this.el.firstChild);this.el.appendChild(this.iframe),window.addEventListener("resize",this._onResize)},this._onResize=function(){this.sendWidth()}.bind(this),this._fire=function(messageType,message){if(messageType in this.messageHandlers)for(var i=0;i<this.messageHandlers[messageType].length;i++)this.messageHandlers[messageType][i].call(this,message)},this.remove=function(){window.removeEventListener("message",this._processMessage),window.removeEventListener("resize",this._onResize),this.el.removeChild(this.iframe),_cleanAutoInitInstances()},this._processMessage=function(e){if(_isSafeMessage(e,this.settings)&&"string"==typeof e.data){var match=e.data.match(this.messageRegex);if(!match||3!==match.length)return!1;var messageType=match[1],message=match[2];this._fire(messageType,message)}}.bind(this),this._onHeightMessage=function(message){var height=parseInt(message);this.iframe.setAttribute("height",height+"px")},this._onNavigateToMessage=function(message){document.location.href=message},this._onScrollToChildPosMessage=function(message){var iframePos=document.getElementById(this.id).getBoundingClientRect().top+window.pageYOffset,totalOffset=iframePos+parseInt(message);window.scrollTo(0,totalOffset)},this.onMessage=function(messageType,callback){messageType in this.messageHandlers||(this.messageHandlers[messageType]=[]),this.messageHandlers[messageType].push(callback)},this.sendMessage=function(messageType,message){this.el.getElementsByTagName("iframe").length&&(this.el.getElementsByTagName("iframe")[0].contentWindow?this.el.getElementsByTagName("iframe")[0].contentWindow.postMessage(_makeMessage(this.id,messageType,message),"*"):this.remove())},this.sendWidth=function(){var width=this.el.offsetWidth.toString();this.sendMessage("width",width)};for(var key in config)this.settings[key]=config[key];return this.onMessage("height",this._onHeightMessage),this.onMessage("navigateTo",this._onNavigateToMessage),this.onMessage("scrollToChildPos",this._onScrollToChildPosMessage),window.addEventListener("message",this._processMessage,!1),this._constructIframe(),this},lib.Child=function(config){this.parentWidth=null,this.id=null,this.parentTitle=null,this.parentUrl=null,this.settings={renderCallback:null,xdomain:"*",polling:0,parenturlparam:"parentUrl"},this.timerId=null,this.messageRegex=null,this.messageHandlers={},config=config||{},this.onMessage=function(messageType,callback){messageType in this.messageHandlers||(this.messageHandlers[messageType]=[]),this.messageHandlers[messageType].push(callback)},this._fire=function(messageType,message){if(messageType in this.messageHandlers)for(var i=0;i<this.messageHandlers[messageType].length;i++)this.messageHandlers[messageType][i].call(this,message)},this._processMessage=function(e){if(_isSafeMessage(e,this.settings)&&"string"==typeof e.data){var match=e.data.match(this.messageRegex);if(match&&3===match.length){var messageType=match[1],message=match[2];this._fire(messageType,message)}}}.bind(this),this._onWidthMessage=function(message){var width=parseInt(message);width!==this.parentWidth&&(this.parentWidth=width,this.settings.renderCallback&&this.settings.renderCallback(width),this.sendHeight())},this.sendMessage=function(messageType,message){window.parent.postMessage(_makeMessage(this.id,messageType,message),"*")},this.sendHeight=function(){var height=document.getElementsByTagName("body")[0].offsetHeight.toString();return this.sendMessage("height",height),height}.bind(this),this.scrollParentTo=function(hash){this.sendMessage("navigateTo","#"+hash)},this.navigateParentTo=function(url){this.sendMessage("navigateTo",url)},this.scrollParentToChildEl=function(id){var topPos=document.getElementById(id).getBoundingClientRect().top+window.pageYOffset;this.scrollParentToChildPos(topPos)},this.scrollParentToChildPos=function(pos){this.sendMessage("scrollToChildPos",pos.toString())};this.remove=function(){window.removeEventListener("message",this._processMessage),this.timerId&&clearInterval(this.timerId)};for(var key in config)this.settings[key]=config[key];this.id=_getParameterByName("childId")||config.id,this.messageRegex=new RegExp("^pymxPYMx"+this.id+"xPYMx(\\S+)xPYMx(.*)$");var width=parseInt(_getParameterByName("initialWidth"));return this.parentUrl=_getParameterByName(this.settings.parenturlparam),this.parentTitle=_getParameterByName("parentTitle"),this.onMessage("width",this._onWidthMessage),window.addEventListener("message",this._processMessage,!1),this.settings.renderCallback&&this.settings.renderCallback(width),this.sendHeight(),this.settings.polling&&(this.timerId=window.setInterval(this.sendHeight,this.settings.polling)),function(onMarkedEmbeddedStatus){var newClassForHtml,htmlElement=document.getElementsByTagName("html")[0],originalHtmlClasses=htmlElement.className;try{newClassForHtml=window.self!==window.top?"embedded":"not-embedded"}catch(e){newClassForHtml="embedded"}originalHtmlClasses.indexOf(newClassForHtml)<0&&(htmlElement.className=originalHtmlClasses?originalHtmlClasses+" "+newClassForHtml:newClassForHtml,onMarkedEmbeddedStatus&&onMarkedEmbeddedStatus(newClassForHtml),_raiseCustomEvent("marked-embedded"))}(config.onMarkedEmbeddedStatus),this},"undefined"!=typeof document&&lib.autoInit(!0),lib})},{}],2:[function(require,module,exports){"use strict";function parseHTML(data){function rewind(){var length=$(".cardcontent").length,currentCard=$(".viewable").index(),previousCard=currentCard-1;$(".cardcontent").removeClass("viewable"),$(".ps__nav-el").removeClass("ps--active"),0===currentCard?($(".cardcontent").eq(length-1).addClass("viewable"),$("#ps__nav-el-"+(length-1)).addClass("ps--active"),pymChild.sendHeight()):($(".cardcontent").eq(previousCard).addClass("viewable"),$("#ps__nav-el-"+previousCard).addClass("ps--active"),pymChild.sendHeight())}function fastForward(){var length=$(".cardcontent").length,currentCard=$(".viewable").index(),nextCard=currentCard+1;$(".cardcontent").removeClass("viewable"),$(".ps__nav-el").removeClass("ps--active"),currentCard===length-1?($("#card-0").addClass("viewable"),$("#ps__nav-el-0").addClass("ps--active"),pymChild.sendHeight()):($(".cardcontent").eq(nextCard).addClass("viewable"),$("#ps__nav-el-"+nextCard).addClass("ps--active"),pymChild.sendHeight())}$.each(data,function(k,v){var person=sliderTemplate(v);$("#ps__content").append(person);var circle=sliderNav(v);$("#ps__nav ul").append(circle)}),$("#card-0").addClass("viewable"),$("#ps__nav-el-0").addClass("ps--active"),pymChild.sendHeight(),setTimeout(function(){pymChild.sendHeight()},1e3),$(".ps__nav-el").on("click",function(){var target=$(this).attr("data-target");$(".cardcontent").removeClass("viewable"),$("#card-"+target).addClass("viewable"),$(".ps__nav-el").removeClass("ps--active"),$("#ps__nav-el-"+target).addClass("ps--active"),pymChild.sendHeight()}),$(".prev").on("click",function(){return rewind()}),$(".next").on("click",function(){return fastForward()}),$(".cardcontent").swipeleft(function(){return fastForward()}),$(".cardcontent").swiperight(function(){return rewind()}),function(){var ulWidth=$("#ps__nav ul").width(),margin=ulWidth/2*-1;$("#ps__nav ul").css("margin-left",margin+"px")}()}var _pym=require("pym.js"),_pym2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_pym),pymChild=new _pym2.default.Child,sliderTemplate=Handlebars.compile($("#people-slider-template").html()),sliderNav=Handlebars.compile($("#people-slider-nav").html());$.ajax({dataType:"json",url:"//interactives.dallasnews.com/data-store/2017/2017-06-people-slider.json",success:parseHTML,cache:!1})},{"pym.js":1}]},{},[2]);
//# sourceMappingURL=scripts.js.map
