!function($){var SmartBanner=function(options){this.origHtmlMargin=parseFloat($('html').css('margin-top'))
this.options=$.extend({},$.smartbanner.defaults,options)
var standalone=navigator.standalone,UA=navigator.userAgent
if(this.options.force){this.type=this.options.force}else if(UA.match(/Windows Phone 8/i)!=null&&UA.match(/Touch/i)!==null){this.type='windows'}else if(UA.match(/iPhone|iPod/i)!=null||(UA.match(/iPad/)&&this.options.iOSUniversalApp)){if(UA.match(/Safari/i)!=null&&(UA.match(/CriOS/i)!=null||window.Number(UA.substr(UA.indexOf('OS ')+3,3).replace('_','.'))<6))this.type='ios'}else if(UA.match(/\bSilk\/(.*\bMobile Safari\b)?/)||UA.match(/\bKF\w/)||UA.match('Kindle Fire')){this.type='kindle'}else if(UA.match(/Android/i)!=null){this.type='android'}
if(!this.type||standalone||this.getCookie('sb-closed')||this.getCookie('sb-installed')){return}
this.scale=this.options.scale=='auto'?$(window).width()/window.screen.width:this.options.scale
if(this.scale<1)this.scale=1
var meta=$(this.type=='android'?'meta[name="google-play-app"]':this.type=='ios'?'meta[name="apple-itunes-app"]':this.type=='kindle'?'meta[name="kindle-fire-app"]':'meta[name="msApplication-ID"]');if(meta.length==0)return
if(this.type=='windows'){this.appId=$('meta[name="msApplication-PackageFamilyName"]').attr('content');}else{var parsedMetaContent=/app-id=([^\s,]+)/.exec(meta.attr('content'));if(parsedMetaContent){this.appId=parsedMetaContent[1];}else{return;}}
this.title=this.options.title?this.options.title:meta.data('title')||$('title').text().replace(/\s*[|\-·].*$/,'')
this.author=this.options.author?this.options.author:meta.data('author')||($('meta[name="author"]').length?$('meta[name="author"]').attr('content'):window.location.hostname)
this.iconUrl=meta.data('icon-url');this.price=meta.data('price');this.create()
this.show()
this.listen()}
SmartBanner.prototype={constructor:SmartBanner,create:function(){var iconURL,link=(this.options.url?this.options.url:(this.type=='windows'?'ms-windows-store:navigate?appid=':(this.type=='android'?'market://details?id=':(this.type=='kindle'?'amzn://apps/android?asin=':'https://itunes.apple.com/'+this.options.appStoreLanguage+'/app/id')))+this.appId),price=this.price||this.options.price,inStore=price?price+' - '+(this.type=='android'?this.options.inGooglePlay:this.type=='kindle'?this.options.inAmazonAppStore:this.type=='ios'?this.options.inAppStore:this.options.inWindowsStore):'',gloss=this.options.iconGloss===null?(this.type=='ios'):this.options.iconGloss
if(this.type=='android'&&this.options.GooglePlayParams){link=link+'&referrer='+this.options.GooglePlayParams;}
var banner='<div id="smartbanner" class="'+this.type+'"><div class="sb-container"><a href="#" class="sb-close">&times;</a><span class="sb-icon"></span><div class="sb-info"><strong>'+this.title+'</strong><span>'+this.author+'</span><span>'+inStore+'</span></div><a href="'+link+'" class="sb-button"><span>'+this.options.button+'</span></a></div></div>';(this.options.layer)?$(this.options.appendToSelector).append(banner):$(this.options.appendToSelector).prepend(banner);if(this.options.icon){iconURL=this.options.icon}else if(this.iconUrl){iconURL=this.iconUrl;}else if($('link[rel="apple-touch-icon-precomposed"]').length>0){iconURL=$('link[rel="apple-touch-icon-precomposed"]').attr('href')
if(this.options.iconGloss===null)gloss=false}else if($('link[rel="apple-touch-icon"]').length>0){iconURL=$('link[rel="apple-touch-icon"]').attr('href')}else if($('meta[name="msApplication-TileImage"]').length>0){iconURL=$('meta[name="msApplication-TileImage"]').attr('content')}else if($('meta[name="msapplication-TileImage"]').length>0){iconURL=$('meta[name="msapplication-TileImage"]').attr('content')}
if(iconURL){$('#smartbanner .sb-icon').css('background-image','url('+iconURL+')')
if(gloss)$('#smartbanner .sb-icon').addClass('gloss')}else{$('#smartbanner').addClass('no-icon')}
this.bannerHeight=$('#smartbanner').outerHeight()+2
if(this.scale>1){$('#smartbanner').css('top',parseFloat($('#smartbanner').css('top'))*this.scale).css('height',parseFloat($('#smartbanner').css('height'))*this.scale).hide()
$('#smartbanner .sb-container').css('-webkit-transform','scale('+this.scale+')').css('-msie-transform','scale('+this.scale+')').css('-moz-transform','scale('+this.scale+')').css('width',$(window).width()/this.scale)}
$('#smartbanner').css('position',(this.options.layer)?'absolute':'static')},listen:function(){$('#smartbanner .sb-close').on('click',$.proxy(this.close,this))
$('#smartbanner .sb-button').on('click',$.proxy(this.install,this))},show:function(callback){var banner=$('#smartbanner');banner.stop();if(this.options.layer){banner.animate({top:0,display:'block'},this.options.speedIn).addClass('shown').show();$(this.pushSelector).animate({paddingTop:this.origHtmlMargin+(this.bannerHeight*this.scale)},this.options.speedIn,'swing',callback);}else{if($.support.transition){banner.animate({top:0},this.options.speedIn).addClass('shown');var transitionCallback=function(){$('html').removeClass('sb-animation');if(callback){callback();}};$(this.pushSelector).addClass('sb-animation').one($.support.transition.end,transitionCallback).emulateTransitionEnd(this.options.speedIn).css('margin-top',this.origHtmlMargin+(this.bannerHeight*this.scale));}else{banner.slideDown(this.options.speedIn).addClass('shown');}}},hide:function(callback){var banner=$('#smartbanner');banner.stop();if(this.options.layer){banner.animate({top:-1*this.bannerHeight*this.scale,display:'block'},this.options.speedIn).removeClass('shown');$(this.pushSelector).animate({paddingTop:this.origHtmlMargin},this.options.speedIn,'swing',callback);}else{if($.support.transition){if(this.type!=='android')
banner.css('top',-1*this.bannerHeight*this.scale).removeClass('shown');else
banner.css({display:'none'}).removeClass('shown');var transitionCallback=function(){$('html').removeClass('sb-animation');if(callback){callback();}};$(this.pushSelector).addClass('sb-animation').one($.support.transition.end,transitionCallback).emulateTransitionEnd(this.options.speedOut).css('margin-top',this.origHtmlMargin);}else{banner.slideUp(this.options.speedOut).removeClass('shown');}}},close:function(e){e.preventDefault()
this.hide()
this.setCookie('sb-closed','true',this.options.daysHidden);},install:function(e){if(this.options.hideOnInstall){this.hide()}
this.setCookie('sb-installed','true',this.options.daysReminder)},setCookie:function(name,value,exdays){var exdate=new Date()
exdate.setDate(exdate.getDate()+exdays)
value=encodeURI(value)+((exdays==null)?'':'; expires='+exdate.toUTCString())
document.cookie=name+'='+value+'; path=/;'},getCookie:function(name){var i,x,y,ARRcookies=document.cookie.split(";")
for(i=0;i<ARRcookies.length;i++){x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="))
y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1)
x=x.replace(/^\s+|\s+$/g,"")
if(x==name){return decodeURI(y)}}
return null},switchType:function(){var that=this
this.hide(function(){that.type=that.type=='android'?'ios':'android'
var meta=$(that.type=='android'?'meta[name="google-play-app"]':'meta[name="apple-itunes-app"]').attr('content')
that.appId=/app-id=([^\s,]+)/.exec(meta)[1]
$('#smartbanner').detach()
that.create()
that.show()})}}
$.smartbanner=function(option){var $window=$(window),data=$window.data('smartbanner'),options=typeof option=='object'&&option
if(!data)$window.data('smartbanner',(data=new SmartBanner(options)))
if(typeof option=='string')data[option]()}
$.smartbanner.defaults={title:null,author:null,price:'FREE',appStoreLanguage:'us',inAppStore:'On the App Store',inGooglePlay:'In Google Play',inAmazonAppStore:'In the Amazon Appstore',inWindowsStore:'In the Windows Store',GooglePlayParams:null,icon:null,iconGloss:null,button:'VIEW',url:null,scale:'auto',speedIn:300,speedOut:400,daysHidden:15,daysReminder:90,force:null,hideOnInstall:true,layer:false,iOSUniversalApp:true,appendToSelector:'body',pushSelector:'html'}
$.smartbanner.Constructor=SmartBanner;function transitionEnd(){var el=document.createElement('smartbanner')
var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
if($.support.transition!==undefined)
return
$.fn.emulateTransitionEnd=function(duration){var called=false,$el=this
$(this).one($.support.transition.end,function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()})}(window.jQuery);if(typeof jQuery==='undefined'){throw new Error('Bootstrap\'s JavaScript requires jQuery')}
+function($){'use strict';var version=$.fn.jquery.split(' ')[0].split('.')
if((version[0]<2&&version[1]<9)||(version[0]==1&&version[1]==9&&version[2]<1)){throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')}}(jQuery);+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={WebkitTransition:'webkitTransitionEnd',MozTransition:'transitionend',OTransition:'oTransitionEnd otransitionend',transition:'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
$.fn.emulateTransitionEnd=function(duration){var called=false
var $el=this
$(this).one('bsTransitionEnd',function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()
if(!$.support.transition)return
$.event.special.bsTransitionEnd={bindType:$.support.transition.end,delegateType:$.support.transition.end,handle:function(e){if($(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}})}(jQuery);+function($){'use strict';var dismiss='[data-dismiss="alert"]'
var Alert=function(el){$(el).on('click',dismiss,this.close)}
Alert.VERSION='3.3.4'
Alert.TRANSITION_DURATION=150
Alert.prototype.close=function(e){var $this=$(this)
var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=$(selector)
if(e)e.preventDefault()
if(!$parent.length){$parent=$this.closest('.alert')}
$parent.trigger(e=$.Event('close.bs.alert'))
if(e.isDefaultPrevented())return
$parent.removeClass('in')
function removeElement(){$parent.detach().trigger('closed.bs.alert').remove()}
$.support.transition&&$parent.hasClass('fade')?$parent.one('bsTransitionEnd',removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION):removeElement()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.alert')
if(!data)$this.data('bs.alert',(data=new Alert(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.alert
$.fn.alert=Plugin
$.fn.alert.Constructor=Alert
$.fn.alert.noConflict=function(){$.fn.alert=old
return this}
$(document).on('click.bs.alert.data-api',dismiss,Alert.prototype.close)}(jQuery);+function($){'use strict';var Button=function(element,options){this.$element=$(element)
this.options=$.extend({},Button.DEFAULTS,options)
this.isLoading=false}
Button.VERSION='3.3.4'
Button.DEFAULTS={loadingText:'loading...'}
Button.prototype.setState=function(state){var d='disabled'
var $el=this.$element
var val=$el.is('input')?'val':'html'
var data=$el.data()
state=state+'Text'
if(data.resetText==null)$el.data('resetText',$el[val]())
setTimeout($.proxy(function(){$el[val](data[state]==null?this.options[state]:data[state])
if(state=='loadingText'){this.isLoading=true
$el.addClass(d).attr(d,d)}else if(this.isLoading){this.isLoading=false
$el.removeClass(d).removeAttr(d)}},this),0)}
Button.prototype.toggle=function(){var changed=true
var $parent=this.$element.closest('[data-toggle="buttons"]')
if($parent.length){var $input=this.$element.find('input')
if($input.prop('type')=='radio'){if($input.prop('checked')&&this.$element.hasClass('active'))changed=false
else $parent.find('.active').removeClass('active')}
if(changed)$input.prop('checked',!this.$element.hasClass('active')).trigger('change')}else{this.$element.attr('aria-pressed',!this.$element.hasClass('active'))}
if(changed)this.$element.toggleClass('active')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.button')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.button',(data=new Button(this,options)))
if(option=='toggle')data.toggle()
else if(option)data.setState(option)})}
var old=$.fn.button
$.fn.button=Plugin
$.fn.button.Constructor=Button
$.fn.button.noConflict=function(){$.fn.button=old
return this}
$(document).on('click.bs.button.data-api','[data-toggle^="button"]',function(e){var $btn=$(e.target)
if(!$btn.hasClass('btn'))$btn=$btn.closest('.btn')
Plugin.call($btn,'toggle')
e.preventDefault()}).on('focus.bs.button.data-api blur.bs.button.data-api','[data-toggle^="button"]',function(e){$(e.target).closest('.btn').toggleClass('focus',/^focus(in)?$/.test(e.type))})}(jQuery);+function($){'use strict';var Carousel=function(element,options){this.$element=$(element)
this.$indicators=this.$element.find('.carousel-indicators')
this.options=options
this.paused=null
this.sliding=null
this.interval=null
this.$active=null
this.$items=null
this.options.keyboard&&this.$element.on('keydown.bs.carousel',$.proxy(this.keydown,this))
this.options.pause=='hover'&&!('ontouchstart'in document.documentElement)&&this.$element.on('mouseenter.bs.carousel',$.proxy(this.pause,this)).on('mouseleave.bs.carousel',$.proxy(this.cycle,this))}
Carousel.VERSION='3.3.4'
Carousel.TRANSITION_DURATION=600
Carousel.DEFAULTS={interval:5000,pause:'hover',wrap:true,keyboard:true}
Carousel.prototype.keydown=function(e){if(/input|textarea/i.test(e.target.tagName))return
switch(e.which){case 37:this.prev();break
case 39:this.next();break
default:return}
e.preventDefault()}
Carousel.prototype.cycle=function(e){e||(this.paused=false)
this.interval&&clearInterval(this.interval)
this.options.interval&&!this.paused&&(this.interval=setInterval($.proxy(this.next,this),this.options.interval))
return this}
Carousel.prototype.getItemIndex=function(item){this.$items=item.parent().children('.item')
return this.$items.index(item||this.$active)}
Carousel.prototype.getItemForDirection=function(direction,active){var activeIndex=this.getItemIndex(active)
var willWrap=(direction=='prev'&&activeIndex===0)||(direction=='next'&&activeIndex==(this.$items.length-1))
if(willWrap&&!this.options.wrap)return active
var delta=direction=='prev'?-1:1
var itemIndex=(activeIndex+delta)%this.$items.length
return this.$items.eq(itemIndex)}
Carousel.prototype.to=function(pos){var that=this
var activeIndex=this.getItemIndex(this.$active=this.$element.find('.item.active'))
if(pos>(this.$items.length-1)||pos<0)return
if(this.sliding)return this.$element.one('slid.bs.carousel',function(){that.to(pos)})
if(activeIndex==pos)return this.pause().cycle()
return this.slide(pos>activeIndex?'next':'prev',this.$items.eq(pos))}
Carousel.prototype.pause=function(e){e||(this.paused=true)
if(this.$element.find('.next, .prev').length&&$.support.transition){this.$element.trigger($.support.transition.end)
this.cycle(true)}
this.interval=clearInterval(this.interval)
return this}
Carousel.prototype.next=function(){if(this.sliding)return
return this.slide('next')}
Carousel.prototype.prev=function(){if(this.sliding)return
return this.slide('prev')}
Carousel.prototype.slide=function(type,next){var $active=this.$element.find('.item.active')
var $next=next||this.getItemForDirection(type,$active)
var isCycling=this.interval
var direction=type=='next'?'left':'right'
var that=this
if($next.hasClass('active'))return(this.sliding=false)
var relatedTarget=$next[0]
var slideEvent=$.Event('slide.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
this.$element.trigger(slideEvent)
if(slideEvent.isDefaultPrevented())return
this.sliding=true
isCycling&&this.pause()
if(this.$indicators.length){this.$indicators.find('.active').removeClass('active')
var $nextIndicator=$(this.$indicators.children()[this.getItemIndex($next)])
$nextIndicator&&$nextIndicator.addClass('active')}
var slidEvent=$.Event('slid.bs.carousel',{relatedTarget:relatedTarget,direction:direction})
if($.support.transition&&this.$element.hasClass('slide')){$next.addClass(type)
$next[0].offsetWidth
$active.addClass(direction)
$next.addClass(direction)
$active.one('bsTransitionEnd',function(){$next.removeClass([type,direction].join(' ')).addClass('active')
$active.removeClass(['active',direction].join(' '))
that.sliding=false
setTimeout(function(){that.$element.trigger(slidEvent)},0)}).emulateTransitionEnd(Carousel.TRANSITION_DURATION)}else{$active.removeClass('active')
$next.addClass('active')
this.sliding=false
this.$element.trigger(slidEvent)}
isCycling&&this.cycle()
return this}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.carousel')
var options=$.extend({},Carousel.DEFAULTS,$this.data(),typeof option=='object'&&option)
var action=typeof option=='string'?option:options.slide
if(!data)$this.data('bs.carousel',(data=new Carousel(this,options)))
if(typeof option=='number')data.to(option)
else if(action)data[action]()
else if(options.interval)data.pause().cycle()})}
var old=$.fn.carousel
$.fn.carousel=Plugin
$.fn.carousel.Constructor=Carousel
$.fn.carousel.noConflict=function(){$.fn.carousel=old
return this}
var clickHandler=function(e){var href
var $this=$(this)
var $target=$($this.attr('data-target')||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,''))
if(!$target.hasClass('carousel'))return
var options=$.extend({},$target.data(),$this.data())
var slideIndex=$this.attr('data-slide-to')
if(slideIndex)options.interval=false
Plugin.call($target,options)
if(slideIndex){$target.data('bs.carousel').to(slideIndex)}
e.preventDefault()}
$(document).on('click.bs.carousel.data-api','[data-slide]',clickHandler).on('click.bs.carousel.data-api','[data-slide-to]',clickHandler)
$(window).on('load',function(){$('[data-ride="carousel"]').each(function(){var $carousel=$(this)
Plugin.call($carousel,$carousel.data())})})}(jQuery);+function($){'use strict';var Collapse=function(element,options){this.$element=$(element)
this.options=$.extend({},Collapse.DEFAULTS,options)
this.$trigger=$('[data-toggle="collapse"][href="#'+element.id+'"],'+'[data-toggle="collapse"][data-target="#'+element.id+'"]')
this.transitioning=null
if(this.options.parent){this.$parent=this.getParent()}else{this.addAriaAndCollapsedClass(this.$element,this.$trigger)}
if(this.options.toggle)this.toggle()}
Collapse.VERSION='3.3.4'
Collapse.TRANSITION_DURATION=350
Collapse.DEFAULTS={toggle:true}
Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width')
return hasWidth?'width':'height'}
Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return
var activesData
var actives=this.$parent&&this.$parent.children('.panel').children('.in, .collapsing')
if(actives&&actives.length){activesData=actives.data('bs.collapse')
if(activesData&&activesData.transitioning)return}
var startEvent=$.Event('show.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
if(actives&&actives.length){Plugin.call(actives,'hide')
activesData||actives.data('bs.collapse',null)}
var dimension=this.dimension()
this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded',true)
this.$trigger.removeClass('collapsed').attr('aria-expanded',true)
this.transitioning=1
var complete=function(){this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('')
this.transitioning=0
this.$element.trigger('shown.bs.collapse')}
if(!$.support.transition)return complete.call(this)
var scrollSize=$.camelCase(['scroll',dimension].join('-'))
this.$element.one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])}
Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return
var startEvent=$.Event('hide.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var dimension=this.dimension()
this.$element[dimension](this.$element[dimension]())[0].offsetHeight
this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded',false)
this.$trigger.addClass('collapsed').attr('aria-expanded',false)
this.transitioning=1
var complete=function(){this.transitioning=0
this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse')}
if(!$.support.transition)return complete.call(this)
this.$element
[dimension](0).one('bsTransitionEnd',$.proxy(complete,this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)}
Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']()}
Collapse.prototype.getParent=function(){return $(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each($.proxy(function(i,element){var $element=$(element)
this.addAriaAndCollapsedClass(getTargetFromTrigger($element),$element)},this)).end()}
Collapse.prototype.addAriaAndCollapsedClass=function($element,$trigger){var isOpen=$element.hasClass('in')
$element.attr('aria-expanded',isOpen)
$trigger.toggleClass('collapsed',!isOpen).attr('aria-expanded',isOpen)}
function getTargetFromTrigger($trigger){var href
var target=$trigger.attr('data-target')||(href=$trigger.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
return $(target)}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.collapse')
var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data&&options.toggle&&/show|hide/.test(option))options.toggle=false
if(!data)$this.data('bs.collapse',(data=new Collapse(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.collapse
$.fn.collapse=Plugin
$.fn.collapse.Constructor=Collapse
$.fn.collapse.noConflict=function(){$.fn.collapse=old
return this}
$(document).on('click.bs.collapse.data-api','[data-toggle="collapse"]',function(e){var $this=$(this)
if(!$this.attr('data-target'))e.preventDefault()
var $target=getTargetFromTrigger($this)
var data=$target.data('bs.collapse')
var option=data?'toggle':$this.data()
Plugin.call($target,option)})}(jQuery);+function($){'use strict';var backdrop='.dropdown-backdrop'
var toggle='[data-toggle="dropdown"]'
var Dropdown=function(element){$(element).on('click.bs.dropdown',this.toggle)}
Dropdown.VERSION='3.3.4'
Dropdown.prototype.toggle=function(e){var $this=$(this)
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
clearMenus()
if(!isActive){if('ontouchstart'in document.documentElement&&!$parent.closest('.navbar-nav').length){$('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click',clearMenus)}
var relatedTarget={relatedTarget:this}
$parent.trigger(e=$.Event('show.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.trigger('focus').attr('aria-expanded','true')
$parent.toggleClass('open').trigger('shown.bs.dropdown',relatedTarget)}
return false}
Dropdown.prototype.keydown=function(e){if(!/(38|40|27|32)/.test(e.which)||/input|textarea/i.test(e.target.tagName))return
var $this=$(this)
e.preventDefault()
e.stopPropagation()
if($this.is('.disabled, :disabled'))return
var $parent=getParent($this)
var isActive=$parent.hasClass('open')
if((!isActive&&e.which!=27)||(isActive&&e.which==27)){if(e.which==27)$parent.find(toggle).trigger('focus')
return $this.trigger('click')}
var desc=' li:not(.disabled):visible a'
var $items=$parent.find('[role="menu"]'+desc+', [role="listbox"]'+desc)
if(!$items.length)return
var index=$items.index(e.target)
if(e.which==38&&index>0)index--
if(e.which==40&&index<$items.length-1)index++
if(!~index)index=0
$items.eq(index).trigger('focus')}
function clearMenus(e){if(e&&e.which===3)return
$(backdrop).remove()
$(toggle).each(function(){var $this=$(this)
var $parent=getParent($this)
var relatedTarget={relatedTarget:this}
if(!$parent.hasClass('open'))return
$parent.trigger(e=$.Event('hide.bs.dropdown',relatedTarget))
if(e.isDefaultPrevented())return
$this.attr('aria-expanded','false')
$parent.removeClass('open').trigger('hidden.bs.dropdown',relatedTarget)})}
function getParent($this){var selector=$this.attr('data-target')
if(!selector){selector=$this.attr('href')
selector=selector&&/#[A-Za-z]/.test(selector)&&selector.replace(/.*(?=#[^\s]*$)/,'')}
var $parent=selector&&$(selector)
return $parent&&$parent.length?$parent:$this.parent()}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.dropdown')
if(!data)$this.data('bs.dropdown',(data=new Dropdown(this)))
if(typeof option=='string')data[option].call($this)})}
var old=$.fn.dropdown
$.fn.dropdown=Plugin
$.fn.dropdown.Constructor=Dropdown
$.fn.dropdown.noConflict=function(){$.fn.dropdown=old
return this}
$(document).on('click.bs.dropdown.data-api',clearMenus).on('click.bs.dropdown.data-api','.dropdown form',function(e){e.stopPropagation()}).on('click.bs.dropdown.data-api',toggle,Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api',toggle,Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api','[role="menu"]',Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api','[role="listbox"]',Dropdown.prototype.keydown)}(jQuery);+function($){'use strict';var Modal=function(element,options){this.options=options
this.$body=$(document.body)
this.$element=$(element)
this.$dialog=this.$element.find('.modal-dialog')
this.$backdrop=null
this.isShown=null
this.originalBodyPad=null
this.scrollbarWidth=0
this.ignoreBackdropClick=false
if(this.options.remote){this.$element.find('.modal-content').load(this.options.remote,$.proxy(function(){this.$element.trigger('loaded.bs.modal')},this))}}
Modal.VERSION='3.3.4'
Modal.TRANSITION_DURATION=300
Modal.BACKDROP_TRANSITION_DURATION=150
Modal.DEFAULTS={backdrop:true,keyboard:true,show:true}
Modal.prototype.toggle=function(_relatedTarget){return this.isShown?this.hide():this.show(_relatedTarget)}
Modal.prototype.show=function(_relatedTarget){var that=this
var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget})
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
this.isShown=true
this.checkScrollbar()
this.setScrollbar()
this.$body.addClass('modal-open')
this.escape()
this.resize()
this.$element.on('click.dismiss.bs.modal','[data-dismiss="modal"]',$.proxy(this.hide,this))
this.$dialog.on('mousedown.dismiss.bs.modal',function(){that.$element.one('mouseup.dismiss.bs.modal',function(e){if($(e.target).is(that.$element))that.ignoreBackdropClick=true})})
this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(that.$body)}
that.$element.show().scrollTop(0)
that.adjustDialog()
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in').attr('aria-hidden',false)
that.enforceFocus()
var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget})
transition?that.$dialog.one('bsTransitionEnd',function(){that.$element.trigger('focus').trigger(e)}).emulateTransitionEnd(Modal.TRANSITION_DURATION):that.$element.trigger('focus').trigger(e)})}
Modal.prototype.hide=function(e){if(e)e.preventDefault()
e=$.Event('hide.bs.modal')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=false
this.escape()
this.resize()
$(document).off('focusin.bs.modal')
this.$element.removeClass('in').attr('aria-hidden',true).off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal')
this.$dialog.off('mousedown.dismiss.bs.modal')
$.support.transition&&this.$element.hasClass('fade')?this.$element.one('bsTransitionEnd',$.proxy(this.hideModal,this)).emulateTransitionEnd(Modal.TRANSITION_DURATION):this.hideModal()}
Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal').on('focusin.bs.modal',$.proxy(function(e){if(this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.trigger('focus')}},this))}
Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keydown.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide()},this))}else if(!this.isShown){this.$element.off('keydown.dismiss.bs.modal')}}
Modal.prototype.resize=function(){if(this.isShown){$(window).on('resize.bs.modal',$.proxy(this.handleUpdate,this))}else{$(window).off('resize.bs.modal')}}
Modal.prototype.hideModal=function(){var that=this
this.$element.hide()
this.backdrop(function(){that.$body.removeClass('modal-open')
that.resetAdjustments()
that.resetScrollbar()
that.$element.trigger('hidden.bs.modal')})}
Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove()
this.$backdrop=null}
Modal.prototype.backdrop=function(callback){var that=this
var animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$('<div class="modal-backdrop '+animate+'" />').appendTo(this.$body)
this.$element.on('click.dismiss.bs.modal',$.proxy(function(e){if(this.ignoreBackdropClick){this.ignoreBackdropClick=false
return}
if(e.target!==e.currentTarget)return
this.options.backdrop=='static'?this.$element[0].focus():this.hide()},this))
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
if(!callback)return
doAnimate?this.$backdrop.one('bsTransitionEnd',callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
var callbackRemove=function(){that.removeBackdrop()
callback&&callback()}
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one('bsTransitionEnd',callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):callbackRemove()}else if(callback){callback()}}
Modal.prototype.handleUpdate=function(){this.adjustDialog()}
Modal.prototype.adjustDialog=function(){var modalIsOverflowing=this.$element[0].scrollHeight>document.documentElement.clientHeight
this.$element.css({paddingLeft:!this.bodyIsOverflowing&&modalIsOverflowing?this.scrollbarWidth:'',paddingRight:this.bodyIsOverflowing&&!modalIsOverflowing?this.scrollbarWidth:''})}
Modal.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:'',paddingRight:''})}
Modal.prototype.checkScrollbar=function(){var fullWindowWidth=window.innerWidth
if(!fullWindowWidth){var documentElementRect=document.documentElement.getBoundingClientRect()
fullWindowWidth=documentElementRect.right-Math.abs(documentElementRect.left)}
this.bodyIsOverflowing=document.body.clientWidth<fullWindowWidth
this.scrollbarWidth=this.measureScrollbar()}
Modal.prototype.setScrollbar=function(){var bodyPad=parseInt((this.$body.css('padding-right')||0),10)
this.originalBodyPad=document.body.style.paddingRight||''
if(this.bodyIsOverflowing)this.$body.css('padding-right',bodyPad+this.scrollbarWidth)}
Modal.prototype.resetScrollbar=function(){this.$body.css('padding-right',this.originalBodyPad)}
Modal.prototype.measureScrollbar=function(){var scrollDiv=document.createElement('div')
scrollDiv.className='modal-scrollbar-measure'
this.$body.append(scrollDiv)
var scrollbarWidth=scrollDiv.offsetWidth-scrollDiv.clientWidth
this.$body[0].removeChild(scrollDiv)
return scrollbarWidth}
function Plugin(option,_relatedTarget){return this.each(function(){var $this=$(this)
var data=$this.data('bs.modal')
var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option](_relatedTarget)
else if(options.show)data.show(_relatedTarget)})}
var old=$.fn.modal
$.fn.modal=Plugin
$.fn.modal.Constructor=Modal
$.fn.modal.noConflict=function(){$.fn.modal=old
return this}
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this)
var href=$this.attr('href')
var $target=$($this.attr('data-target')||(href&&href.replace(/.*(?=#[^\s]+$)/,'')))
var option=$target.data('bs.modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data())
if($this.is('a'))e.preventDefault()
$target.one('show.bs.modal',function(showEvent){if(showEvent.isDefaultPrevented())return
$target.one('hidden.bs.modal',function(){$this.is(':visible')&&$this.trigger('focus')})})
Plugin.call($target,option,this)})}(jQuery);+function($){'use strict';var Tooltip=function(element,options){this.type=null
this.options=null
this.enabled=null
this.timeout=null
this.hoverState=null
this.$element=null
this.init('tooltip',element,options)}
Tooltip.VERSION='3.3.4'
Tooltip.TRANSITION_DURATION=150
Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false,viewport:{selector:'body',padding:0}}
Tooltip.prototype.init=function(type,element,options){this.enabled=true
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
this.$viewport=this.options.viewport&&$(this.options.viewport.selector||this.options.viewport)
if(this.$element[0]instanceof document.constructor&&!this.options.selector){throw new Error('`selector` option must be specified when initializing '+this.type+' on the window.document object!')}
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin'
var eventOut=trigger=='hover'?'mouseleave':'focusout'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){options=$.extend({},this.getDefaults(),this.$element.data(),options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(self&&self.$tip&&self.$tip.is(':visible')){self.hoverState='in'
return}
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(obj.currentTarget,this.getDelegateOptions())
$(obj.currentTarget).data('bs.'+this.type,self)}
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
var inDom=$.contains(this.$element[0].ownerDocument.documentElement,this.$element[0])
if(e.isDefaultPrevented()||!inDom)return
var that=this
var $tip=this.tip()
var tipId=this.getUID(this.type)
this.setContent()
$tip.attr('id',tipId)
this.$element.attr('aria-describedby',tipId)
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement).data('bs.'+this.type,this)
this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var orgPlacement=placement
var $container=this.options.container?$(this.options.container):this.$element.parent()
var containerDim=this.getPosition($container)
placement=placement=='bottom'&&pos.bottom+actualHeight>containerDim.bottom?'top':placement=='top'&&pos.top-actualHeight<containerDim.top?'bottom':placement=='right'&&pos.right+actualWidth>containerDim.width?'left':placement=='left'&&pos.left-actualWidth<containerDim.left?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
var complete=function(){var prevHoverState=that.hoverState
that.$element.trigger('shown.bs.'+that.type)
that.hoverState=null
if(prevHoverState=='out')that.leave(that)}
$.support.transition&&this.$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()}}
Tooltip.prototype.applyPlacement=function(offset,placement){var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top=offset.top+marginTop
offset.left=offset.left+marginLeft
$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0)
$tip.addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){offset.top=offset.top+height-actualHeight}
var delta=this.getViewportAdjustedDelta(placement,offset,actualWidth,actualHeight)
if(delta.left)offset.left+=delta.left
else offset.top+=delta.top
var isVertical=/top|bottom/.test(placement)
var arrowDelta=isVertical?delta.left*2-width+actualWidth:delta.top*2-height+actualHeight
var arrowOffsetPosition=isVertical?'offsetWidth':'offsetHeight'
$tip.offset(offset)
this.replaceArrow(arrowDelta,$tip[0][arrowOffsetPosition],isVertical)}
Tooltip.prototype.replaceArrow=function(delta,dimension,isVertical){this.arrow().css(isVertical?'left':'top',50*(1-delta/dimension)+'%').css(isVertical?'top':'left','')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
$tip.find('.tooltip-inner')[this.options.html?'html':'text'](title)
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(callback){var that=this
var $tip=$(this.$tip)
var e=$.Event('hide.bs.'+this.type)
function complete(){if(that.hoverState!='in')$tip.detach()
that.$element.removeAttr('aria-describedby').trigger('hidden.bs.'+that.type)
callback&&callback()}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&$tip.hasClass('fade')?$tip.one('bsTransitionEnd',complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION):complete()
this.hoverState=null
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof($e.attr('data-original-title'))!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function($element){$element=$element||this.$element
var el=$element[0]
var isBody=el.tagName=='BODY'
var elRect=el.getBoundingClientRect()
if(elRect.width==null){elRect=$.extend({},elRect,{width:elRect.right-elRect.left,height:elRect.bottom-elRect.top})}
var elOffset=isBody?{top:0,left:0}:$element.offset()
var scroll={scroll:isBody?document.documentElement.scrollTop||document.body.scrollTop:$element.scrollTop()}
var outerDims=isBody?{width:$(window).width(),height:$(window).height()}:null
return $.extend({},elRect,scroll,outerDims,elOffset)}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=='left'?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}:{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}}
Tooltip.prototype.getViewportAdjustedDelta=function(placement,pos,actualWidth,actualHeight){var delta={top:0,left:0}
if(!this.$viewport)return delta
var viewportPadding=this.options.viewport&&this.options.viewport.padding||0
var viewportDimensions=this.getPosition(this.$viewport)
if(/right|left/.test(placement)){var topEdgeOffset=pos.top-viewportPadding-viewportDimensions.scroll
var bottomEdgeOffset=pos.top+viewportPadding-viewportDimensions.scroll+actualHeight
if(topEdgeOffset<viewportDimensions.top){delta.top=viewportDimensions.top-topEdgeOffset}else if(bottomEdgeOffset>viewportDimensions.top+viewportDimensions.height){delta.top=viewportDimensions.top+viewportDimensions.height-bottomEdgeOffset}}else{var leftEdgeOffset=pos.left-viewportPadding
var rightEdgeOffset=pos.left+viewportPadding+actualWidth
if(leftEdgeOffset<viewportDimensions.left){delta.left=viewportDimensions.left-leftEdgeOffset}else if(rightEdgeOffset>viewportDimensions.width){delta.left=viewportDimensions.left+viewportDimensions.width-rightEdgeOffset}}
return delta}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.getUID=function(prefix){do prefix+=~~(Math.random()*1000000)
while(document.getElementById(prefix))
return prefix}
Tooltip.prototype.tip=function(){return(this.$tip=this.$tip||$(this.options.template))}
Tooltip.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow'))}
Tooltip.prototype.enable=function(){this.enabled=true}
Tooltip.prototype.disable=function(){this.enabled=false}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=this
if(e){self=$(e.currentTarget).data('bs.'+this.type)
if(!self){self=new this.constructor(e.currentTarget,this.getDelegateOptions())
$(e.currentTarget).data('bs.'+this.type,self)}}
self.tip().hasClass('in')?self.leave(self):self.enter(self)}
Tooltip.prototype.destroy=function(){var that=this
clearTimeout(this.timeout)
this.hide(function(){that.$element.off('.'+that.type).removeData('bs.'+that.type)})}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data&&/destroy|hide/.test(option))return
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tooltip
$.fn.tooltip=Plugin
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);+function($){'use strict';var Popover=function(element,options){this.init('popover',element,options)}
if(!$.fn.tooltip)throw new Error('Popover requires tooltip.js')
Popover.VERSION='3.3.4'
Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:'right',trigger:'click',content:'',template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'})
Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype)
Popover.prototype.constructor=Popover
Popover.prototype.getDefaults=function(){return Popover.DEFAULTS}
Popover.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
var content=this.getContent()
$tip.find('.popover-title')[this.options.html?'html':'text'](title)
$tip.find('.popover-content').children().detach().end()[this.options.html?(typeof content=='string'?'html':'append'):'text'](content)
$tip.removeClass('fade top bottom left right in')
if(!$tip.find('.popover-title').html())$tip.find('.popover-title').hide()}
Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent()}
Popover.prototype.getContent=function(){var $e=this.$element
var o=this.options
return $e.attr('data-content')||(typeof o.content=='function'?o.content.call($e[0]):o.content)}
Popover.prototype.arrow=function(){return(this.$arrow=this.$arrow||this.tip().find('.arrow'))}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.popover')
var options=typeof option=='object'&&option
if(!data&&/destroy|hide/.test(option))return
if(!data)$this.data('bs.popover',(data=new Popover(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.popover
$.fn.popover=Plugin
$.fn.popover.Constructor=Popover
$.fn.popover.noConflict=function(){$.fn.popover=old
return this}}(jQuery);+function($){'use strict';function ScrollSpy(element,options){this.$body=$(document.body)
this.$scrollElement=$(element).is(document.body)?$(window):$(element)
this.options=$.extend({},ScrollSpy.DEFAULTS,options)
this.selector=(this.options.target||'')+' .nav li > a'
this.offsets=[]
this.targets=[]
this.activeTarget=null
this.scrollHeight=0
this.$scrollElement.on('scroll.bs.scrollspy',$.proxy(this.process,this))
this.refresh()
this.process()}
ScrollSpy.VERSION='3.3.4'
ScrollSpy.DEFAULTS={offset:10}
ScrollSpy.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)}
ScrollSpy.prototype.refresh=function(){var that=this
var offsetMethod='offset'
var offsetBase=0
this.offsets=[]
this.targets=[]
this.scrollHeight=this.getScrollHeight()
if(!$.isWindow(this.$scrollElement[0])){offsetMethod='position'
offsetBase=this.$scrollElement.scrollTop()}
this.$body.find(this.selector).map(function(){var $el=$(this)
var href=$el.data('target')||$el.attr('href')
var $href=/^#./.test(href)&&$(href)
return($href&&$href.length&&$href.is(':visible')&&[[$href[offsetMethod]().top+offsetBase,href]])||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){that.offsets.push(this[0])
that.targets.push(this[1])})}
ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset
var scrollHeight=this.getScrollHeight()
var maxScroll=this.options.offset+scrollHeight-this.$scrollElement.height()
var offsets=this.offsets
var targets=this.targets
var activeTarget=this.activeTarget
var i
if(this.scrollHeight!=scrollHeight){this.refresh()}
if(scrollTop>=maxScroll){return activeTarget!=(i=targets[targets.length-1])&&this.activate(i)}
if(activeTarget&&scrollTop<offsets[0]){this.activeTarget=null
return this.clear()}
for(i=offsets.length;i--;){activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(offsets[i+1]===undefined||scrollTop<offsets[i+1])&&this.activate(targets[i])}}
ScrollSpy.prototype.activate=function(target){this.activeTarget=target
this.clear()
var selector=this.selector+'[data-target="'+target+'"],'+
this.selector+'[href="'+target+'"]'
var active=$(selector).parents('li').addClass('active')
if(active.parent('.dropdown-menu').length){active=active.closest('li.dropdown').addClass('active')}
active.trigger('activate.bs.scrollspy')}
ScrollSpy.prototype.clear=function(){$(this.selector).parentsUntil(this.options.target,'.active').removeClass('active')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.scrollspy')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.scrollspy',(data=new ScrollSpy(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.scrollspy
$.fn.scrollspy=Plugin
$.fn.scrollspy.Constructor=ScrollSpy
$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old
return this}
$(window).on('load.bs.scrollspy.data-api',function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this)
Plugin.call($spy,$spy.data())})})}(jQuery);+function($){'use strict';var Tab=function(element){this.element=$(element)}
Tab.VERSION='3.3.4'
Tab.TRANSITION_DURATION=150
Tab.prototype.show=function(){var $this=this.element
var $ul=$this.closest('ul:not(.dropdown-menu)')
var selector=$this.data('target')
if(!selector){selector=$this.attr('href')
selector=selector&&selector.replace(/.*(?=#[^\s]*$)/,'')}
if($this.parent('li').hasClass('active'))return
var $previous=$ul.find('.active:last a')
var hideEvent=$.Event('hide.bs.tab',{relatedTarget:$this[0]})
var showEvent=$.Event('show.bs.tab',{relatedTarget:$previous[0]})
$previous.trigger(hideEvent)
$this.trigger(showEvent)
if(showEvent.isDefaultPrevented()||hideEvent.isDefaultPrevented())return
var $target=$(selector)
this.activate($this.closest('li'),$ul)
this.activate($target,$target.parent(),function(){$previous.trigger({type:'hidden.bs.tab',relatedTarget:$this[0]})
$this.trigger({type:'shown.bs.tab',relatedTarget:$previous[0]})})}
Tab.prototype.activate=function(element,container,callback){var $active=container.find('> .active')
var transition=callback&&$.support.transition&&(($active.length&&$active.hasClass('fade'))||!!container.find('> .fade').length)
function next(){$active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',false)
element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded',true)
if(transition){element[0].offsetWidth
element.addClass('in')}else{element.removeClass('fade')}
if(element.parent('.dropdown-menu').length){element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded',true)}
callback&&callback()}
$active.length&&transition?$active.one('bsTransitionEnd',next).emulateTransitionEnd(Tab.TRANSITION_DURATION):next()
$active.removeClass('in')}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tab')
if(!data)$this.data('bs.tab',(data=new Tab(this)))
if(typeof option=='string')data[option]()})}
var old=$.fn.tab
$.fn.tab=Plugin
$.fn.tab.Constructor=Tab
$.fn.tab.noConflict=function(){$.fn.tab=old
return this}
var clickHandler=function(e){e.preventDefault()
Plugin.call($(this),'show')}
$(document).on('click.bs.tab.data-api','[data-toggle="tab"]',clickHandler).on('click.bs.tab.data-api','[data-toggle="pill"]',clickHandler)}(jQuery);+function($){'use strict';var Affix=function(element,options){this.options=$.extend({},Affix.DEFAULTS,options)
this.$target=$(this.options.target).on('scroll.bs.affix.data-api',$.proxy(this.checkPosition,this)).on('click.bs.affix.data-api',$.proxy(this.checkPositionWithEventLoop,this))
this.$element=$(element)
this.affixed=null
this.unpin=null
this.pinnedOffset=null
this.checkPosition()}
Affix.VERSION='3.3.4'
Affix.RESET='affix affix-top affix-bottom'
Affix.DEFAULTS={offset:0,target:window}
Affix.prototype.getState=function(scrollHeight,height,offsetTop,offsetBottom){var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
var targetHeight=this.$target.height()
if(offsetTop!=null&&this.affixed=='top')return scrollTop<offsetTop?'top':false
if(this.affixed=='bottom'){if(offsetTop!=null)return(scrollTop+this.unpin<=position.top)?false:'bottom'
return(scrollTop+targetHeight<=scrollHeight-offsetBottom)?false:'bottom'}
var initializing=this.affixed==null
var colliderTop=initializing?scrollTop:position.top
var colliderHeight=initializing?targetHeight:height
if(offsetTop!=null&&scrollTop<=offsetTop)return'top'
if(offsetBottom!=null&&(colliderTop+colliderHeight>=scrollHeight-offsetBottom))return'bottom'
return false}
Affix.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset
this.$element.removeClass(Affix.RESET).addClass('affix')
var scrollTop=this.$target.scrollTop()
var position=this.$element.offset()
return(this.pinnedOffset=position.top-scrollTop)}
Affix.prototype.checkPositionWithEventLoop=function(){setTimeout($.proxy(this.checkPosition,this),1)}
Affix.prototype.checkPosition=function(){if(!this.$element.is(':visible'))return
var height=this.$element.height()
var offset=this.options.offset
var offsetTop=offset.top
var offsetBottom=offset.bottom
var scrollHeight=$(document.body).height()
if(typeof offset!='object')offsetBottom=offsetTop=offset
if(typeof offsetTop=='function')offsetTop=offset.top(this.$element)
if(typeof offsetBottom=='function')offsetBottom=offset.bottom(this.$element)
var affix=this.getState(scrollHeight,height,offsetTop,offsetBottom)
if(this.affixed!=affix){if(this.unpin!=null)this.$element.css('top','')
var affixType='affix'+(affix?'-'+affix:'')
var e=$.Event(affixType+'.bs.affix')
this.$element.trigger(e)
if(e.isDefaultPrevented())return
this.affixed=affix
this.unpin=affix=='bottom'?this.getPinnedOffset():null
this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix','affixed')+'.bs.affix')}
if(affix=='bottom'){this.$element.offset({top:scrollHeight-height-offsetBottom})}}
function Plugin(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.affix')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.affix',(data=new Affix(this,options)))
if(typeof option=='string')data[option]()})}
var old=$.fn.affix
$.fn.affix=Plugin
$.fn.affix.Constructor=Affix
$.fn.affix.noConflict=function(){$.fn.affix=old
return this}
$(window).on('load',function(){$('[data-spy="affix"]').each(function(){var $spy=$(this)
var data=$spy.data()
data.offset=data.offset||{}
if(data.offsetBottom!=null)data.offset.bottom=data.offsetBottom
if(data.offsetTop!=null)data.offset.top=data.offsetTop
Plugin.call($spy,data)})})}(jQuery);(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);var Futhead=function(){var that=this;this.Message=function(type,content){var messages=$('.messages');var template=messages.find('.alert:eq(0)').clone();template.addClass(type).append(content).show();messages.find('> div').append(template).end().show();};this.Error=function(content){new that.Message('alert-error',content);};this.Success=function(content){new that.Message('alert-success',content);};this.Information=function(content){new that.Message('alert-info',content);};this.JSONMessage=function(url,data,custom_success_func){var success_funcs=[handle_json_message];if(typeof custom_success_func!==undefined){success_funcs.push(custom_success_func);}
$.ajax({'url':url,'dataType':'json','data':(typeof data===undefined)?data:{},'success':success_funcs,'error':handle_json_error});};$('#notify-modal .modal-footer a').click(function(event){event.preventDefault();$('#notify-modal').modal('hide');})
this.notify=function(msg,css_classes){var notify_modal=$('#notify-modal'),body=notify_modal.find('.modal-body');if(typeof css_classes=='undefined'){css_classes=''}
body.html('<div class="'+css_classes+'">'+msg+'</div>');notify_modal.modal();}
var handle_json_error=function(){new that.Error('A server error occurred. Please try again in a few minutes.');};var handle_json_message=function(data){if(typeof data.type===undefined||typeof data.message===undefined){that.handle_json_error();}else{switch(data.type){case'error':new that.Error(data.message);break;case'success':new that.Success(data.message);break;case'info':new that.Information(data.message);break;default:that.handle_json_error();}}};};function update_relative_dates(selector){if(typeof selector=='undefined'){selector='body';}
$(selector).find('.relative-date').each(function(index,element){var element=$(element),timestamp=Date.parse(element.attr('data-iso-date'));if(typeof timestamp=='undefined'){element.text('???');}else{var diff=((new Date().getTime())-timestamp)/1000,text='';if(diff<86400){if(diff<300){text='Just Now';}else if(diff<(60*60*2)){var date=new Date(timestamp),hours=date.getHours(),minutes=date.getMinutes(),meridian='am';if(hours>12){hours=hours-12;meridian='pm';}else if(hours==0){hours=12;}
if(minutes<10){minutes='0'+minutes;}
text=hours+':'+minutes+meridian;}else{text=Math.floor(diff/3600)+' hours ago';}}else{var date=new Date(timestamp),months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];text=months[date.getMonth()]+'. '+(date.getDate()>9?date.getDate():'0'+date.getDate());if(diff>(86400*30*6))
{text+=', '+date.getFullYear();}}
element.text(text);}});}
function timeAgo(dt){if(!dt)
return'???';dt=Math.round(Date.now()/1000)-dt;if(dt<60)return'a moment ago';dt=Math.round(dt/60);if(dt<60)return dt+' minute'+(dt>1?'s':'')+' ago';dt=Math.round(dt/60);if(dt<24)return dt+' hour'+(dt>1?'s':'')+' ago';dt=Math.round(dt/24);if(dt<30)return dt+' day'+(dt>1?'s':'')+' ago';dt=Math.round(dt/30);return dt+' month'+(dt>1?'s':'')+' ago';}
var attr_string=function(position,year){if(position!='GK'){return{1:'PAC',2:'SHO',3:'PAS',4:'DRI',5:'DEF',6:parseInt(year)>14?'PHY':'HEA'};}else{return{1:'DIV',2:'HAN',3:'KIC',4:'REF',5:'SPE',6:'POS'};}};var card_class=function(size,year,rating,rare,revision,pid,extra){var level=(isNaN(rating)||rating<65)?'bronze':rating<75?'silver':'gold';return('playercard card-'+size+' fut'+year+' '+level+' '
+rare+' '+revision+' '+(extra||'')).trim();};var card_from_data=function(data,size,extra){if(data==undefined)
return'<span></span>';size=size||'small';var year=data.card_year||data.year;var rare=data.rare?'':'non-rare';var rev=data.revision_type?data.revision_type.toLowerCase():'';var pos=data.position;var work_rate=(year>11&&size=='small'&&data.workrates_short_string!='?/?')?data.workrates_short_string:'';var cls=card_class(size,year,data.rating,rare,rev,data.player_id,extra);return' \
	<div class="'+cls+'"> \
		<div class="playercard-art"></div> \
		<div class="playercard-rating"><span class="value">'+data.rating+'</span></div> \
		<div class="playercard-name playercard-thin">'+data.card_name+'</div> \
		<div class="playercard-position"><span class="value">'+pos+'</span></div> \
		<div class="playercard-nation"><img src="'+data.nation_image+'" /></div> \
		<div class="playercard-club"><img src="'+data.club_image+'" /></div> \
		<div class="playercard-picture"><img src="'+data.image+'" /></div> \
		<div class="playercard-workrates">'+work_rate+'</div> \
		<div class="playercard-attr playercard-attr1"><span class="value">'+data.attr1+'</span> <span class="playercard-thin">'+attr_string(pos)[1]+'</span></div> \
		<div class="playercard-attr playercard-attr2"><span class="value">'+data.attr2+'</span> <span class="playercard-thin">'+attr_string(pos)[2]+'</span></div> \
		<div class="playercard-attr playercard-attr3"><span class="value">'+data.attr3+'</span> <span class="playercard-thin">'+attr_string(pos)[3]+'</span></div> \
		<div class="playercard-attr playercard-attr4"><span class="value">'+data.attr4+'</span> <span class="playercard-thin">'+attr_string(pos)[4]+'</span></div> \
		<div class="playercard-attr playercard-attr5"><span class="value">'+data.attr5+'</span> <span class="playercard-thin">'+attr_string(pos)[5]+'</span></div> \
		<div class="playercard-attr playercard-attr6"><span class="value">'+data.attr6+'</span> <span class="playercard-thin">'+attr_string(pos,year)[6]+'</span></div> \
		<div class="playercard-chem hidee">CHE: <span class="value"></span></div> \
	</div>';};var w=$(window).width();var r_col=$('.col-right:not(.ignore-resize)');var l_col=r_col.siblings('div[class*="col-offset"]');if(w>900&&r_col.length>0&&l_col.length>0){if(r_col.height()>l_col.height())
l_col.css('height',r_col.height());else
r_col.css('height',l_col.height());}
function bindPricePlatform(){var icon=$('.price-platform');var fallback=$.cookie('futhead-settings-price-platform')||'ps';function toggle(platform){platform=platform||fallback;var enabled='[data-platform="'+platform+'"]';icon.filter(':not(.no-disable)').addClass('disabled').filter(enabled).removeClass('disabled');$('.price-platform-target').addClass('hidee').filter(enabled).removeClass('hidee');$('.price-platform-bg').removeClass('ps xb pc').addClass(platform);$('.price-platform-input-binding').val(platform);$.cookie('futhead-settings-price-platform',platform,{expires:999,path:'/'});}
toggle(fallback);icon.click(function(){var platform=$(this).attr('data-platform');toggle(platform);if($(this).hasClass('bin-platform-url'))
window.history.replaceState(window.state,document.title,preserve(location.href,'bin_platform',platform));});}
var futhead=null;$().ready(function(){futhead=new Futhead();bindPricePlatform();if($.cookie('show-randomizer')==undefined){$.cookie('show-randomizer','0',{'path':'/',domain:window.location.hostname});}
if($.cookie('show-randomizer')=='1'){$("#randomizer-toolbar").show();}
var verb=$.cookie('show-randomizer')=='0'?'Show':'Hide';$('.randomizer-toggle-link span').html(verb+" Randomizer Toolbar");$('.randomizer-toggle-link').on('click',function(e){e.preventDefault();$.cookie('show-randomizer',$.cookie('show-randomizer')=='0'?'1':'0',{expires:3650,path:'/',domain:window.location.hostname});var verb=$.cookie('show-randomizer')=='0'?'Show':'Hide';$('.randomizer-toggle-link span').html(verb+" Randomizer Toolbar");$("#randomizer-toolbar").toggle();$('.modal').modal('hide');});if($.cookie('hide-futhead-14-message')!=='1'){$('.futhead-14-message').fadeIn();}
$('.futhead-14-message .close').click(function(){$.cookie('hide-futhead-14-message','1',{'path':'/'});});update_relative_dates();$('*[rel="tooltip"]').tooltip();navsearchbox=$('.navbar input');navsearchbox.mousedown(function(){$(this).val('').attr('placeholder','').css('color','#fff');});navsearchbox.autocomplete({autoFocus:true,position:{offset:'0 2',collision:'none',my:'left top',at:'left bottom',},minLength:2,delay:500,source:'/quicksearch/player/',select:function(event,ui){window.location.href=ui.item.url;return false;},close:function(event,ui){$('body').css('overflow','auto').css('padding-right',0);},open:function(event,ui){var body_width=$('body').width();$('body').css('overflow','hidden');var new_body_width=jQuery('body').width();$('body').css('padding-right',(new_body_width-body_width)+'px');}}).keypress(function(e){if(e.keyCode===13){var player_id=$('.quicksearch li >:first-child').attr('data-id');$('.quicksearch >:first-child').addClass('ui-state-focus');if($('.navbar-search').val()!==''&&player_id!==undefined){window.location.href=ui.item.url;}
e.preventDefault();return false;}}).data("autocomplete")._renderItem=function(ul,item){$(ul).addClass('quicksearch').addClass('navsearch');var rating_color=get_level_display(item.level);var revision=item.revision_type?item.revision_type.toLowerCase():'';return $('<li class="'+rating_color+' '+revision+'"></li>').data("item.autocomplete",item).append('<a data-id="'+item.id+'"><img class="picture" src="'+item.image+'" /><img class="clubpicture" src="'+item.club_image+'" /><img class="nationpicture" src="'+item.nation_image+'" /><span class="name">'+item.full_name+'</span> ('+item.position+') <span class="quicksearch-rating '+rating_color+' '+revision+'">'+item.rating+'</span></a>').appendTo(ul);};var characters=500;$('.comment-text-counter').html('You have <strong>'+characters+'</strong> characters remaining');$('textarea.limited-text').keyup(function(){if($(this).val().length>characters){$(this).val($(this).val().substr(0,characters));}
var remaining=characters-$(this).val().length;$(this).siblings(".comment-text-counter").html("You have <strong>"+remaining+"</strong> characters remaining");});var toggleSearch=function(){if($('.navbar-search').hasClass('active')){$('.navbar-search').removeClass('no-bg').animate({width:"40px"},200,function(){$('.navbar-search').parent().siblings('li').not('.navbar-brand').show().animate({opacity:"100",},100);}).val('').removeClass('active').blur();}else{$('.navbar-search').addClass('no-bg').animate({width:"700px"},200).addClass('active').focus();$('.navbar-search').parent().siblings('li').not('.navbar-brand').animate({opacity:"0"},100).hide();}};$(document).click(function(e){if((!$(e.target).is('.navbar-search')&&$('.navbar-search').hasClass('active'))||($(e.target).is('.navbar-search')&&!$('.navbar-search').hasClass('active'))){toggleSearch();}});$(document).keyup(function(e){var focusedInputs=$("input:focus, textarea:focus");if(focusedInputs!==null&&focusedInputs.length>0){var inputHasFocus=true;}
if(!inputHasFocus){if(e.which==83){toggleSearch();e.preventDefault();}}
if($('.navbar-search').hasClass('active')){if(e.keyCode==27){toggleSearch();e.preventDefault();}}});if(window.location.href.indexOf('/13/squads/')!=-1){$('#squads-nav-link').addClass('active');}else if(window.location.href.indexOf('/13/players/')!=-1){$('#players-nav-link').addClass('active');}
var group_list=$('.mobile-group-list');$('.group-nav-link').click(function(){if(group_list.is(':visible')){group_list.slideUp('fast');}else{group_list.slideDown('fast');}});var search=$('.mobile-search-container');$('.mobile-search').click(function(){if(search.is(':visible')){search.slideUp('fast');}else{search.slideDown('fast');search.find('input').focus();}});if(md.phone()){$('.dropdown a').click(function(){$(this).closest('.dropdown').siblings().removeClass('dropdown-open');$(this).closest('.dropdown').toggleClass('dropdown-open');if($(this).closest('.dropdown').hasClass('open')){$(this).closest('.dropdown').removeClass('dropdown-open');}})
$('.show-hidden-subnav').click(function(){$(this).hide();$('.player-filters').removeClass('hidden-xs');})
$('.desktop-switch').click(function(){viewport=document.querySelector("meta[name=viewport]");viewport.setAttribute('content','width=1280');$('body').css('padding','0');$('.navbar-fixed-top').css('margin-bottom','0');$.cookie('mobile-desktop-site','1',{'path':'/'});})
$('.mobile-switch').click(function(){$.cookie('mobile-desktop-site','0',{'path':'/'});viewport=document.querySelector("meta[name=viewport]");viewport.setAttribute('content','width=device-width, initial-scale=1');})}
$('.btn-calc, .close-calc').click(function(){if($('.tax-calc').is(":visible")){$('.tax-calc').slideUp('fast');}else{$('.tax-calc').removeClass('hide');$('.tax-calc input').val('');$('.calc-you-get, .calc-ea-gets, .calc-sell-at').html('');$('.tax-calc').show();$('.tax-calc').slideDown('fast');$('.tax-calc input').focus();}});$('.clear-calc').click(function(){$('.tax-calc input').val('');$('.calc-you-get, .calc-ea-gets, .calc-sell-at').html('');$('.tax-calc input').focus();});calc_tax=function(str){digits=function(number){if(number===null){return'N/A';}else{return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,");}};var numberRegex=/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;if(numberRegex.test(str)){var post_tax=Math.round(str*0.95);var ea_tax=Math.round(str*0.05);var sell_at=Math.round(str/0.95);$('.calc-you-get').html(digits(post_tax));$('.calc-ea-gets').html(digits(ea_tax));$('.calc-sell-at').html(digits(sell_at));}};$('.tax-calc input').keyup(function(){calc_tax($(this).val());});$('.tax-click').click(function(){var calc=$('.tax-calc');var input=$('.tax-calc input');if(calc.is(":visible")){input.val($(this).html().replace(/,/g,''));calc_tax($('.tax-calc input').val());}else{calc.slideDown('fast');input.val($(this).html().replace(/,/g,''));calc_tax(input.val());}});$('.btn-modal').click(function(){var modal=$($(this).attr('href'));if(modal.is(':visible')){modal.modal('hide');}else{modal.modal('show');}});$('.modal-close').click(function(){var modal=$(this).parents('.modal');modal.modal('hide');});$('.login-modal .btn-futhead').click(function(){if($('.login-form').is(':visible')){$('.login-form').fadeOut('fast',function(){$('.reg-form').fadeIn('fast');$('.login-modal .btn-futhead').html('Already a user? Sign in!');});}else{$('.reg-form').fadeOut('fast',function(){$('.login-form').fadeIn('fast');$('.login-modal .btn-futhead').html('New to Futhead? Sign up!');});}});function centerModal(){$(this).css('display','block');var $dialog=$(this).find(".modal-dialog");var offset=($(window).height()-$dialog.height())/2;$dialog.css("margin-top",offset);}
$('.modal').on('show.bs.modal',centerModal);$(window).on("resize",function(){$('.modal:visible').each(centerModal);});$('#ShareModal').on('show.bs.modal',function(){setTimeout(function(){$('#share-url').select();},10);});$('.click-clear').click(function(){$(this).val('');});$('.social-popup').click(function(e){e.preventDefault();window.open($(this).attr('href'),'twitterwindow','height=450, width=550, top='+($(window).height()/2-225)+', left='+$(window).width()/2+', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');});$('.tooltip-enabled').tooltip();$('.random-card').tooltip();$('.enable-popover').hover(function(){$(this).popover('show');},function(){$(this).popover('hide');});$('.dropdown-list-btn').hoverIntent(function(){$(this).addClass('active');$(this).find('.dropdown-list').slideDown('fast');},function(){$(this).removeClass('active');$(this).find('.dropdown-list').slideUp('fast');});$('.futhead-list-add a').click(function(){$.ajax({url:$(this).attr('href')})
return false;})
$('*[data-form-submit]').click(function(){$('#'+$(this).data('form-submit')).submit();});$('.btn-submit').click(function(){$('.'+$(this).attr('data-form')).submit();})
$(document).on('click','.report-link',function(event){var report=$(this).parents('.report');content_type_id=report.attr('data-content-type-id'),object_id=report.attr('data-object-id');return(function(link,_event,_content_type_id,_object_id){_event.preventDefault();var report_modal=$('#report-modal'),object_type=link.attr('data-object-type');report_modal.find('textarea').val('');report_modal.find('#report-submit-success,#report-submit-error').hide();report_modal.find('.submit').html('Submit Report').removeClass('disabled');report_modal.find('.cancel').unbind();report_modal.find('.submit').unbind();report_modal.find('h3').text('Report '+object_type);report_modal.modal();report_modal.find('.cancel').click(function(event){return(function(link,_event,_report_modal){_event.preventDefault();_report_modal.modal('hide');})($(this),event,report_modal);});report_modal.find('.submit').click(function(event){return(function(link,_event,_report_modal,report_link,__content_type_id,__object_id){_event.preventDefault();report_modal.find('.submit').addClass('disabled').html('Submit Report <img src="/static/img/spinner.gif" />');$.post('/moderation/report/',{'reason':report_modal.find('select').val(),'description':report_modal.find('textarea').val(),'content_type':__content_type_id,'object_id':__object_id}).success(function(){return(function(__report_modal){__report_modal.find('#report-submit-success').show();__report_modal.find('.cancel').unbind();__report_modal.find('.submit').unbind();setTimeout(function(){__report_modal.modal('hide')},1500);})(_report_modal);}).error(function(){return(function(__report_modal){__report_modal.find('#report-submit-error').show();__report_modal.find('.submit').html('Submit Report').removeClass('disabled');})(_report_modal);});})($(this),event,report_modal,link,_content_type_id,_object_id);});})($(this),event,content_type_id,object_id)});(function(){var notifications=$('.notifications'),read_url=notifications.attr('data-read-url'),read_all_url=notifications.attr('data-read-all-url'),paginate_url=notifications.attr('data-paginate-url'),prev=$('#notifications-modal').find('.prev'),next=$('#notifications-modal').find('.next'),current_page=1,total_pages=parseInt(notifications.attr('data-total-pages'),10),replace_holder=notifications.find('.replace-holder'),read_all=$('#notifications-modal').find('.mark-all-read');update_relative_dates(notifications);function get_read_url(id){return read_url.replace('/0/','/'+id+'/');}
function get_pagination_url(page){return paginate_url.replace('/1/','/'+page+'/');}
function make_visible(el){el.removeClass('disabled');}
function make_invisible(el){el.addClass('disabled');}
read_all.click(function(event){event.preventDefault();$.post(read_all_url);make_invisible(read_all);notifications.find('.notification').removeClass('unread').find('.mark-read').hide();$('.unread-message-count').text('0');});prev.click(function(event){event.preventDefault();if(!$(this).hasClass('disabled')){current_page-=1;if(current_page==1){make_invisible(prev);}
make_visible(next);$.get(get_pagination_url(current_page),function(data){replace_holder.empty();replace_holder.append(data);$('.tooltip-enabled').tooltip();add_notification_handlers();});}});next.click(function(event){event.preventDefault();if(!$(this).hasClass('disabled')){current_page+=1;if(current_page==total_pages){make_invisible(next);}
make_visible(prev);$.get(get_pagination_url(current_page),function(data){replace_holder.empty();replace_holder.append(data);update_relative_dates(notifications);$('.tooltip-enabled').tooltip();add_notification_handlers();});}});function add_notification_handlers(){notifications.find('.notification').each(function(index,notification){var notification=$(notification),notification_id=notification.attr('data-id'),link=notification.find('.link'),mark_read=notification.find('.mark-read');mark_read.click(function(event){event.preventDefault();mark_read.hide();notification.removeClass('unread');$.post(get_read_url(notification_id));var unread_message_count=parseInt($('.unread-message-count').text(),10);if(!isNaN(unread_message_count)){$('.unread-message-count').text(unread_message_count-1);}});});}
add_notification_handlers();})();$('input.click-select').click(function(){$(this).select();})});function get_level_display(level){if(level===0){return'gold';}else if(level===1){return'silver';}else if(level===2){return'bronze';}}
function updateShareModal(data){$('.share-modal-title').text(data.modal_title);$('.twitter-share-button').attr('data-text',data.twitter_text);}
function sorted_by(sort){if(sort==undefined||sort.length<1)
return;sort=sort.replace(/^-/,'');var headers=$('table.table-sorted > thead > tr > th');var col_index=headers.length;for(;col_index>=0;col_index--)
if($(headers[col_index-1]).attr('data-sort-attr')==sort)
break;if(col_index>0){$('table.table-sorted > tbody > tr > td:nth-child('+col_index+')').each(function(){$(this).addClass('sorted');});}}
var badgify=function(value){var mod=parseInt(value);var max=[90,80,70,50,0];for(var i=0;i<max.length;i++)
if(mod>=max[i]){mod=max[i];break;}
return'igs-'+mod+' igs-value-'+value;};$().ready(function(){var add_player_hover=function(){$('.comment .content a').each(function(index,_element){var element=$(_element),href=element.attr('href'),player_pattern=/^(?:http:\/\/)?(?:www\.)?futhead\.com\/(\d{2})\/players?\/(\d+)\/.*$/g,player_match=player_pattern.exec(href),player_year=null,player_pk=null;if(player_match!==null){player_year=player_match[1];player_pk=player_match[2];}
if(player_pk!==null){var div_id='player-hover-'+Math.floor(Math.random()*10000);element.attr('data-player-hover-div',div_id);element.hover(function(){var element=$(this),div_id=element.attr('data-player-hover-div'),offset=element.offset();$('#'+div_id).css('top',offset.top-200+'px').css('left',offset.left+'px').show();},function(){var element=$(this),div_id=element.attr('data-player-hover-div');$('#'+div_id).hide();});$.ajax('/ut/card/'+player_year+'/'+player_pk+'/small/',{type:'get',success:function(data){var offset=element.offset(),div=$(data),full_name=div.attr('data-player-full-name'),rating=div.attr('data-player-rating'),revision_type=div.attr('data-player-revision-type'),new_text=full_name+' '+rating;if(revision_type!==''){new_text+=' '+revision_type;}
element.text(new_text);$('body').append($('<div class="hidee" id="'+div_id+'" style="z-index:99;position:absolute;">'+data+'</div>'));}});}});};var base_comments_url=$('body').attr('data-comments-url'),next_comment_page=null;if(typeof base_comments_url!='undefined'){var specific_comment_id=null;var updated_comments_url=base_comments_url;if(window.location.hash&&window.location.hash.slice(0,8)=='#comment'){specific_comment_id=window.location.hash.slice(8,20);var format_check=/^\d+$/.exec(specific_comment_id);if(format_check!==null){updated_comments_url+='?highlight_id='+specific_comment_id;}}
$.ajax(updated_comments_url,{type:'get',error:function()
{$('#comments-placeholder').text('Failed to load comments. Please refresh the page to try again.');},success:function(data){var comment_data=process_data(data);next_comment_page=parseInt(comment_data.find('.comments:eq(0)').attr('data-comments-start-page'),10)
$('#comments-placeholder').html(comment_data);add_player_hover();var top_reply=$('#comments-placeholder .top-level-reply .comment-form');if(top_reply)
{function enable_input()
{top_reply.find('textarea').prop('disabled',false);top_reply.find('.submit').prop('disabled',false);top_reply.find('.cancel').prop('disabled',false);top_reply.find('.spinner').hide();}
function disable_inputs()
{top_reply.find('textarea').prop('disabled',true);top_reply.find('.submit').prop('disabled',true);top_reply.find('.cancel').prop('disabled',true);top_reply.find('.spinner').show();}
function reset()
{enable_input();top_reply.find('textarea').val('');}
top_reply.find('.cancel').click(function(event)
{event.preventDefault();reset();});top_reply.submit(function(event)
{event.preventDefault();if(USER==null)
{alert('You must be logged in to reply.');return;}
$.ajax(top_reply.attr('action'),{type:'post',data:{content:top_reply.find('textarea').val()},success:function(form_submit_data)
{if(typeof form_submit_data.message!='undefined')
{enable_input();alert(form_submit_data.message);}else
{var processed_comment=process_data(form_submit_data);var children=$('.comments > .children');if(children.length)
{processed_comment.insertAfter(children.last());}else
{processed_comment.insertAfter($('.comment-header'));}
reset();}},error:function(data)
{alert('An unknown error occurred. Please try again.');enable_input();}});});}
$('#comments-placeholder').show();if(specific_comment_id!==null&&$('#comment-'+specific_comment_id).length){$('html, body').animate({scrollTop:$('#comment-'+specific_comment_id).offset().top-200},200);$('#comment-'+specific_comment_id).css('border','1px solid #940000');}
$('.add-comment').click(function(){$('.comment-form textarea').focus();return false;})}});$(document).on('click','.comments #paginate',function(event){$(this).addClass('loading').html('Loading');event.preventDefault();if(next_comment_page)
{var element=$(this),url=base_comments_url+'?comments_page='+next_comment_page;$.ajax(url,{type:'get',success:function(data){if(data.length<1){$('#paginate').removeClass('loading').html('No More comments').fadeOut('slow');}else{$(process_data(data)).insertBefore(element);$('#paginate').removeClass('loading').html('Load More Comments');}},error:function()
{alert('Loading additional comments failed. Please try again');$('#paginate').removeClass('loading').html('Load More Comments');}});next_comment_page+=1;}else
{alert('Loading additional comments failed. Please try again');$('#paginate').removeClass('loading').html('Load More Comments');}});function process_data(data)
{data=$('<div/>').append(data);data.find('.load-more-comments').click(function(event)
{event.preventDefault();var element=$(this);element.addClass('loading').find('strong').html('Loading');$.ajax(base_comments_url+'?expand_id='+element.attr('data-comment-id'),{type:'get',success:function(more_comment_data)
{var parent=element.parents('.load-more-comments-container');parent.siblings('.children').remove();process_data(more_comment_data).insertBefore(parent);element.hide();add_player_hover();},error:function()
{alert('There was an error loading more comments. Please try again.');element.removeClass('loading').find('strong').html('. . .');}});});data.find('.paginate-replies').click(function(event)
{event.preventDefault();var element=$(this),url=element.attr('data-pagination-url'),container=element.parents('.paginate-replies-container');$.ajax(url,{type:'get',success:function(reply_pagination_data)
{if(!data){element.removeClass('loading').html('No more replies');container.fadeOut('slow');container.remove();}else{$(process_data(reply_pagination_data)).insertBefore(container);container.remove();}},error:function()
{alert('There was an error loading more replies. Please try again.');}});});data.find('.comment').each(function(index,value)
{value=$(value);if(USER!=null)
{value.find('.report-link').show();}
var up_form=value.find('.up-vote-form'),down_form=value.find('.down-vote-form'),vote_sum=value.find('.sum');up_form.find('a').click(function(e){e.preventDefault();if(USER===null){alert('You must be logged in to vote.');return;}
$.ajax(up_form.attr('action'),{type:'post',success:function(data){if(typeof data.type!=null)
{if(data.type=="error")
{if(typeof data.message!=null)
{alert(data.message);return;}}else if(data.type=="success")
{var vote_sum_text=vote_sum.text();if(!isNaN(parseInt(vote_sum_text,10))){var new_sum=parseInt(vote_sum_text,10)+1;if(new_sum>0){vote_sum.text(new_sum);}else if(new_sum<0){vote_sum.text(new_sum);}else{vote_sum.text('0');}}
down_form.find('a').css('visibility','hidden');up_form.find('a').unbind().css('color','#D44A37').css('cursor','none').click(function(e){e.preventDefault();});return;}}
alert('An error occurred while voting. Please try again.');},error:function()
{alert('An error occurred while voting. Please try again.');}});});down_form.find('a').click(function(e){e.preventDefault();$(this).unbind();$.ajax(down_form.attr('action'),{type:'post',success:function(data){if(typeof data.type!=null)
{if(data.type=="error")
{if(typeof data.message!=null)
{alert(data.message);return;}}else if(data.type=="success")
{var vote_sum_text=vote_sum.text();if(!isNaN(parseInt(vote_sum_text,10))){var new_sum=parseInt(vote_sum_text,10)-1;if(new_sum>0){vote_sum.text(new_sum);}else if(new_sum<0){vote_sum.text(new_sum);}else{vote_sum.text('0');}}
up_form.find('a').css('visibility','hidden');down_form.find('a').unbind().css('color','#D44A37').css('cursor','none').click(function(e){e.preventDefault();});return;}}
alert('An error occurred while voting. Please try again.');}});});var user_pk=value.attr('data-author-pk'),badges=value.find('.badges');if(user_pk&&badges)
{$.ajax({url:'/profiles/comment_badges/'+user_pk+'/',success:function(data){badges.html((data.length===0)?'&nbsp;':data);}});}
var delete_comment=value.find('.delete-comment');if(delete_comment)
{if(USER_ID===parseInt(user_pk,10)||(USER!==null&&USER.is_staff))
{delete_comment.show();delete_comment.click(function(event)
{event.preventDefault();$.ajax($(this).attr('href'),{type:'get',success:function(data)
{if(data!=null&&typeof data.message!='undefined'){alert(data.message);}else{delete_comment.parents('.comment').fadeOut().remove();}},error:function()
{alert('There was an error deleting the comment. Please try again');}});});}else
{delete_comment.parent().hide();}}
var moderate_link=value.find('.moderate-link-entry');if(moderate_link)
{if(USER!==null&&USER.is_staff)
{moderate_link.show();moderate_link.click(function(event)
{event.preventDefault();$.ajax(moderate_link.attr('href'),{type:'post',success:function(){moderate_link.parents('.children').first().fadeOut().remove();},error:function()
{alert('There was an error moderating the comment. Please try again');}})});}else
{moderate_link.parent().hide();}}
if(USER==null)
{value.find('.report-link').parent().hide();}
value.find('.reply-link-entry').click(function(event)
{event.preventDefault();if(USER==null)
{alert('You must be logged in to reply.');return;}
var reply=value.find('.reply'),actions=value.find('.actions');actions.hide();reply.show();reply.find('textarea').focus();var form=reply.find('form');if(form)
{form.find('.cancel').click(function(event)
{event.preventDefault();form.unbind();reply.hide();actions.show();form.find('textarea').val('');});form.submit(function(event)
{event.preventDefault();function enable_input()
{form.find('textarea').prop('disabled',false);form.find('.submit').prop('disabled',false);form.find('.cancel').prop('disabled',false);form.find('.spinner').hide();}
function disable_inputs()
{form.find('textarea').prop('disabled',true);form.find('.submit').prop('disabled',true);form.find('.cancel').prop('disabled',true);form.find('.spinner').show();}
function reset()
{reply.hide();actions.show();enable_input();form.unbind();form.find('textarea').val('');}
$.ajax(form.attr('action'),{type:'post',data:{content:form.find('textarea').val()},success:function(form_submit_data)
{if(typeof form_submit_data.message!='undefined')
{enable_input();alert(form_submit_data.message);}else
{var processed_comment=process_data(form_submit_data);var parent=form.parents('.comment');if(parent.next('.children').length==0){$($('<div class="children"></div>').append(processed_comment)).insertAfter(parent);}else{processed_comment.prependTo(parent.next('.children'));}
reset();}},error:function(data)
{alert('An unknown error occurred. Please try again.');enable_input();}});});}});});$(document).on('click','.comment-hidden-show',function(event)
{event.preventDefault();var object_id=$(this).attr('data-object-pk');if(object_id)
{$('.comments').find('.comment[data-object-pk="'+object_id+'"]').show();}
$(this).parent().remove();});if(USER!==null){$.ajax({url:$('body').attr('data-vote-status-url'),dataType:'json',data:{},success:function(data){$.each(data.comments,function(index,vote){var comment=$('.comment[data-object-pk="'+vote.pk+'"]');if(comment.length>0){var down_vote=comment.find('.down-vote'),up_vote=comment.find('.up-vote');if(vote.direction===0){down_vote.css('visibility','hidden');up_vote.unbind().css('color','#D44A37');}else{up_vote.css('visibility','hidden');down_vote.unbind().css('color','#D44A37');}}});}});}
update_relative_dates(data);$('*[rel="tooltip"]').tooltip();return data;}}});var autocomplete_callback=function(type,year,select_func,admin){var source='/quicksearch/'+(admin?'admin/':'')+type+'/';if(year!=undefined)
source+=year+'/';return{autoFocus:true,minLength:2,delay:250,source:source,select:select_func}};var autocomplete_player_renderer=function(size){if(size==undefined)
size='short';return function(ul,item){$(ul).addClass('quicksearch '+size);var rating_color=get_level_display(item.level);var revision=item.revision_type?item.revision_type.toLowerCase():'';return $('<li class="'+rating_color+' '+revision+'"></li>').data('item.autocomplete',item).append('<a data-id="'+item.id+'" data-slug="'+item.slug+'"><img class="clubpicture" src="'+item.club_image+'" /><img class="nationpicture" src="'+item.nation_image+'" /><span class="name">'+item.full_name+'</span> ('+item.position+') <span class="quicksearch-rating '+rating_color+' '+revision+'">'+item.rating+'</span></a>').appendTo(ul);}};var autocomplete_group_renderer=function(size){if(size==undefined)
size='short';return function(ul,item){$(ul).addClass('quicksearch '+size);return $('<li></li>').data('item.autocomplete',item).append('<a data-id="'+item.pk+'"><img class="'+item.type+'picture" src="'+item.image+'" /><span class="name">'+item.name+'</span></a>').appendTo(ul);}};var autocomplete_user_renderer=function(){return function(ul,item){$(ul).addClass('quicksearch short');return $('<li></li>').data('item.autocomplete',item).append('<a href="'+item.url+'">'+item.username+'<span class="pull-right">'+item.id+'</span></a>').appendTo(ul);}};$(function(){$.smartbanner({title:'Futhead',author:'Curse, Inc.',iOSUniversalApp:false});});$().ready(function(){$('.form-link').hover(function(){$('.form-card.'+$(this).data('form')).fadeToggle('fast');})});var version='15';var pre_url='';var p1='';var p2='';function player_quick_search(year){$('input.player-search').autocomplete(autocomplete_callback('player',year,function(event,ui){window.location.href+=+ui.item.year+'-'+ui.item.id+'/';return false;})).data("autocomplete")._renderItem=autocomplete_player_renderer('short');}
var initialize=function(_version,_pre_url,_p1,_p2){version=_version;pre_url=_pre_url;p1=_p1;p2=_p2;$('.search').click(function(){$(this).select();});$('.current-version').each(function(){$(this).text(_version);player_quick_search(_version);});$('.search-year a').click(function(){var _version=$(this).data('version');$(this).parents('ul').siblings('button').find('.current-version').text($(this).text().substring(5));player_quick_search(_version);$(this).parents('.btn-group').siblings('.search').autocomplete('search');});$('.add-on.btn').click(function(){$(this).siblings('input').val('').focus();});console.log(version);};