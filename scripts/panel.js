;(function($,window,document,undefined){
  'use strict';

  if (!$) return;

  var Panel = function(element,options){
    this.settings = options;
    this.$element = $(element)
      .on('select.viewer','.viewer',$.proxy(this.onSelect,this))
      .on('click','button',$.proxy(this.onClick,this));

    this.form = $('form.formui').data().formui;
    this.viewer = $('.viewer',this.$element).data().viewer;
    this.checkbox = $('label.formui',$('[data-id="' + this.$element.data().target + '"]')).data().formui;
    this.checkbox.$checkbox.on('toggle',$.proxy(this.setState,this));

    this.$lastSaved = $('input[name="lastSaved"]',this.$element);
    this.$lastSavedTimeStamp = $('input[name="lastSavedTimeStamp"]',this.$element);
    this.$text = $('.btn-group',this.$element);
    this.$submit = $('button.submit',this.$element);

    this.setState();
    this.setLastSaved();
  };

  Panel.prototype.isDefault = function(){
    if (!$(':radio',this.$text).first().is(':checked') || !this.viewer.isDefault()) {
      return false;
    }
    return true;
  };

  Panel.prototype.setState = function(evt,isActive){
    if($.isPlainObject(isActive)) {
      this.state = 'loading';
    }else if(!this.checkbox.isActive() && !this.$lastSavedTimeStamp.val()){
      this.state = 'open';
    }else if(!this.checkbox.isActive() && this.$lastSavedTimeStamp.val()){
      this.state = 'edit';
    }else{
      this.state = 'complete';
    }
    this.toggleView();
  };

  Panel.prototype.onSelect = function(evt){
    var $selectedImgInput = $('input:hidden',this.viewer.$element);

    if ($selectedImgInput.val() !== this.viewer.id) $selectedImgInput.val(this.viewer.id).trigger('change');
  };

  Panel.prototype.onClick = function(evt){
    evt.preventDefault();

    if($(evt.target).button().data('bs.button').state === 'complete') this.update();
    else this.confirm();
  };

  Panel.prototype.update = function(response){
    $(document.body).animate({
      scrollTop : 0
    },'fast','swing', $.proxy(function(){
      this.checkbox.toggle();
      if (this.state === 'complete') this.setLastSaved(response);
    },this));
  };

  Panel.prototype.confirm = function(evt){
    var $modal = $('#modal');

    if (this.isDefault() && !evt) {
      $modal.modal('toggle').data('target',this.$element);
    } else {
      evt && $modal.modal('hide');
      this.request();
    }
  };

  Panel.prototype.toggleView = function(){
    var state = this.state;

    this.$submit.button((state === 'edit') ? 'reset' : state).toggleClass('processing',(state === 'loading'));
    this.viewer.toggleLock((state === 'complete'));

    if(state !== 'loading') $('.btn',this.$text).each(function(){
      $(this).toggleClass('disabled',(state === 'complete'));
    });
  };

  Panel.prototype.setLastSaved = function(data){
    var $lastSaved = $('.last-saved',this.$element),
      message = 'The last save was made by {USER} on {TIMESTAMP}',
      lastSaved = this.$lastSaved.val() || false,
      timeStamp = this.$lastSavedTimeStamp.val() || false;

    if(data){
      this.$lastSaved.val(lastSaved = data.lastSaved);
      this.$lastSavedTimeStamp.val(timeStamp = data.lastSavedTimeStamp);
    }

    if (lastSaved && timeStamp) $('strong',$lastSaved).html(message.replace('{USER}',lastSaved).replace('{TIMESTAMP}',timeStamp));
  };

  Panel.prototype.request = function(){
    var settings = {
      url : this.form.$element.prop('action'),
      data : this.form.getData(),
      type : this.form.$element.prop('method'),
      beforeSend : $.proxy(this.setState,this),
      success : $.proxy(this.update,this)
    };

    /*
    $.mockjax && $.mockjax({
      url: settings.url,
      responseTime: 2000,
      responseText: {
        "lastSaved": "Carol Johnson",
        "lastSavedTimeStamp": "10/10/14 - 12:26:23"
      }
    });
    */

    $.ajax(settings);
  };

  $(function(){
    // Initialise the individual Panels
    $('.tab-pane').each(function(idx,val){
      var $this   = $(this),
        data    = $this.data('panel'),
        options = $.extend({}, Panel.DEFAULTS, $this.data(), typeof option == 'object' && option, {id : $this.attr('id')})

      if (!data) $this.data('panel',(data = new Panel(this,options)));
    });

    // Init Page Level
    $(document.body)
      .on('click','.modal',function(evt){
        var $modal = $(evt.currentTarget),
          $target = $modal.data().target,
          api = $target.data().panel;

        api.confirm(evt);
      })
      .on('timeup',function(){
        // console.log('hide');
      });
  });
})(window.jQuery,this,this.document);