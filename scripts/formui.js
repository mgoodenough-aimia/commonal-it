/*****

 TODO:

 Add Radio / List / TextArea / etc
 Add labels
 Convert standard elements to hidden fields
 Toggle the state of hidden fields based on UI control

 ****/

;(function($){
  if (typeof jQuery === 'undefined') { throw new Error('This tutorial requires jQuery') }

  var Formui = function(element,options){
    element.data(this.namespace,this);
    this.init(element,options);
  };

  Formui.prototype.init = function(element,options){
    this.settings = options;
    this.$element = $(element);

    if (this.$element.is('label')) this.$control = $('#' + this.$element.attr('for'));

    if (this.$control) this.settings.type = this.$control.prop('type') || this.$control[0].tagName.toLowerCase();
    else this.settings.type = this.$element.prop('type') || this.$element[0].tagName.toLowerCase();

    $.extend(this,$.fn.formui.controls[this.settings.type].call(this));
  };

  Formui.prototype.namespace = 'formui';

  Formui.prototype.classes = {
    wrapper : 'formui',
    lock : 'lock',
    active : 'active',
    iconset : 'glyphicon'
  };

  Formui.prototype.events = {
    click : 'click.formui',
    change : 'change.formui',
    changed : 'changed.formui',
    submit : 'submit.formui'
  };

  Formui.prototype.templates = {
    checkbox : '<span>'
  };

  //########### jQuery Plugin Definition
  SetPlugin(Formui, {
    namespace : Formui.prototype.namespace,
    defaults : {}
  });

  // Extending 'formui' Plugin Definition
  $.fn.formui.controls = {
    form : function(){
      var $changed = $([]),
        $controls,
        data = {};

      var isClean = function(param){
        if(!param){
          return ($changed.length) ? false : true;
        }
        return $changed;
      };

      var getData = function(){
        return data;
      };

      var setData = function(){
        $controls.each(function(idx){
          var $this = $(this);

          if (($this.is(':checkbox') || $this.is(':radio'))) {
            if ($this.is(':checked')) data[$this.prop('name')] = $this.prop('value');
          } else {
            if ($this.prop('name').length) data[$this.prop('name')] = $this.prop('value');
          }
        });
      };

      var onChange = function(evt){
        var $control = $(evt.target);

        if ($control.data().ignore === this.namespace) {
          evt.stopPropagation();
          return;
        }

        if(!$.isPlainObject($control.data().defaultValue)){
          if($control.data().defaultValue !== $control.val()) $changed = $changed.add($control);
          else $changed = $changed.not($control);
        }else{
          if ($changed.length) $changed = $changed.not($changed.filter(function(){
            return $(this).prop('name') === $control.prop('name');
          }));
          if ($control.data().defaultValue.checked !== $control.is(':checked')) $changed = $changed.add($control);
        }
        setData();
        $control.trigger(this.events.changed);
      };

      var onSubmit = function(evt){
        console.log( 'submit' );

        this.lock && evt.preventDefault();
      };

      var init = function(){
        var $form = this.$element;
        $controls = $('input,textarea,button');

        if ($form.data().lock) {
          this.lock = true;
          $(document.body).on(this.events.submit,$form,$.proxy(onSubmit,this));
        }

        $controls.each(function(idx){
          var $this = $(this);

          if (($this.is(':checkbox') || $this.is(':radio'))) {
            $this.data().defaultValue = {
              checked : $this.is(':checked'),
              value : $this.val()
            };
          } else {
            $this.data().defaultValue = $this.val();
          }
        });

        setData();
        $(document.body).on(this.events.change,$form,$.proxy(onChange,this));
      }.call(this);

      return {
        isClean : isClean,
        getData : getData
      };
    },
    checkbox : function(){
      var toggle = function(param){
        this.$checkbox.toggleClass(this.classes.active,(param === undefined) ? !this.$checkbox.hasClass(this.classes.active) : param);
        this.active = this.$checkbox.hasClass(this.classes.active);
        this.$control.prop('checked',this.active).trigger(this.events.change);

        this.$checkbox.trigger('toggle',this.active);
      };

      var isActive = function(){
        if(this.active){
          return true;
        }
        return false;
      };

      var init = function(){
        this.$checkbox = $(this.templates.checkbox).addClass(this.settings.type + ' ' + this.classes.iconset + ' ' + this.classes.iconset + '-' + this.settings.icon).prependTo( this.$element )
        this.$control.hide();

        if(this.settings.lock) this.$checkbox.addClass(this.classes.lock);
        else this.$checkbox.on(this.events.click,$.proxy(toggle,this));

        this.$control.is(':checked') && toggle.call(this);
      }.call(this);

      return {
        toggle : toggle,
        isActive : isActive
      }
    },
    radio : function(){
      var init = function(){
        this.$control.is(':checked') && this.$element.addClass(this.classes.active);
      }.call(this);
    },
    textarea : function(){}
  };
  //###########

  $(function(){
    $('.formui').formui();
  });
})(window.jQuery);



/*



 */



//
// var icon = this.settings.icon || this.settings[this.settings.type].icon;

// this.$element.addClass(this.settings.type + ' ' + this.classes.iconset + ' ' + this.classes.iconset + '-' + icon)
