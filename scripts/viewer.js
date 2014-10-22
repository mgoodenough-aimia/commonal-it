;(function($){
  // 'use strict';

  if (typeof jQuery === 'undefined' || !$.fn.tab) { throw new Error('This plugin requires jQuery and the Tab Plugin') };

  var Viewer = function($element,options){
    $element.data(this.namespace,this);
    this.init($element,options);
  };

  Viewer.prototype = $.extend(true,{},$.fn.tab.Constructor.prototype);

  Viewer.prototype.constructor = Viewer;

  var init = Viewer.prototype.init;

  Viewer.prototype.init = function($element,options){
    if ($('input.'+this.classes.active,$element).length) options.active = $('input.'+this.classes.active,$element).prop('value');

    init.call(this,$element,options);
  };

  var toggle = Viewer.prototype.toggle;

  Viewer.prototype.toggle = function(evt){
    toggle.call(this,evt);
    $('.'+this.classes.caption,this.$element).html(this.$toggle.data().caption);
  };

  Viewer.prototype.isDefault = function(){
    return $('.'+this.classes.viewerdefault,this.$element).hasClass(this.classes.active);
  };

  Viewer.prototype.namespace = 'viewer';

  Viewer.prototype.classes = {
    wrapper       : 'viewer',
    body          : 'viewer-content',
    toggle        : 'viewer-toggle',
    pane          : 'viewer-pane',
    caption       : 'viewer-image-caption',
    viewerdefault : 'viewer-default',
    lock          : 'viewer-lock',
    active        : 'active'
  };

  Viewer.prototype.events = {
    click     : 'click.viewer',
    select    : 'select.viewer',
    selected  : 'selected.viewer'
  };

  //########### jQuery Plugin Definition
  SetPlugin(Viewer, {
    namespace : Viewer.prototype.namespace,
    defaults : $.extend({}, $.fn.tab.defaults)
  });
  //###########

  $(function(){
    $('.viewer').viewer();
  });
})(window.jQuery);