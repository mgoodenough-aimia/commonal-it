var SetPlugin = function(constructor,options){
  var Constructor = constructor,
    NAMESPACE = options.namespace,
    defaults = options.defaults;

  $.fn[NAMESPACE] = function(options){
    return this.each(function () {
      var $this = $(this),
        data = $this.data(NAMESPACE),
        settings = $.extend(true,{},$.fn[NAMESPACE].defaults,options,$this.data());

      if (!data) $this.data(NAMESPACE,(data = new Constructor($this,settings)));
    });
  };

  $.fn[NAMESPACE].Constructor = Constructor;

  $.fn[NAMESPACE].defaults = defaults;

  $.expr[':'][NAMESPACE] = function(elem){
    return !!$.data(elem,NAMESPACE);
  };
};

