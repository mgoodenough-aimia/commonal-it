;(function($){
  // 'use strict';

  if (typeof jQuery === 'undefined') { throw new Error('This plugin requires jQuery') };

  var Tab = function($element,options){
    $element.data(this.namespace,this);
    this.init($element,options);
  };

  Tab.prototype.init = function($element,options){
    this.settings = options;
    this.$element = $element.on(this.events.click, '.'+this.classes.toggle, $.proxy(this.toggle,this));
    this.$default = $('.'+this.classes.toggle,this.$element).eq(this.settings.tabdefault).addClass(this.classes.tabdefault);

    if(this.settings.active) var $toggle = $('.' + this.classes.toggle + '[data-id="' + this.settings.active + '"]',this.$element);
    else var $toggle = $('.' + this.classes.toggle,this.$element).eq(this.settings.tabdefault);

    this.toggle($toggle.data().id);
  };

  Tab.prototype.toggle = function(evt){
    if(typeof evt !== "string") evt.preventDefault();
    if (this.settings.lock) return;

    var $toggle = (typeof evt === 'string') ? $('.' + this.classes.toggle + '[data-id="' + evt + '"]',this.$element) : $(evt.currentTarget);
    var $target = $('.' + this.classes.pane + '[data-target="' + $toggle.data().id + '"]',this.$element);

    if(this.$toggle && $toggle[0] === this.$toggle[0]) return;

    this.$toggle && this.$toggle.removeClass(this.classes.active);
    this.$target && this.$target.hide();

    this.id = $toggle.data().id;
    this.$toggle = $toggle.addClass(this.classes.active).trigger(this.events.select,this);
    this.$target = $target.fadeIn($.proxy(function(){
      this.$target.addClass(this.classes.active);
      this.$toggle.trigger(this.events.selected,this);
    },this));
  };

  Tab.prototype.toggleLock = function(param){
    this.settings.lock = param || false;

    this.$element.toggleClass(this.classes.lock,this.settings.lock);
  };

  Tab.prototype.namespace = 'tab';

  Tab.prototype.classes = {
    wrapper : 'tab',
    body : 'tab-content',
    toggle : 'tab-toggle',
    pane : 'tab-pane',
    tabdefault : 'tab-default',
    lock : 'tab-lock',
    active : 'active'
  };

  Tab.prototype.events = {
    click : 'click.tab',
    select : 'select.tab',
    selected : 'selected.tab'
  };

  //########### jQuery Plugin Definition
  SetPlugin(Tab, {
    namespace : Tab.prototype.namespace,
    defaults : {
      tabdefault : 0,
      deeplink : false
    }
  });
  //###########

  $(function(){
    $('.tab').tab();
  });
})(window.jQuery);