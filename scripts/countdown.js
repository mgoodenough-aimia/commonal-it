;(function($){
  // TO DO
  // separate setting clock and updating clock
  // add before/loaded/complete events
  // try and forgive yourself

  var Countdown = function($element,options){
    $element.data(this.namespace,this);
    this.init($element,options);
  };

  Countdown.prototype.init = function($element,options){
    var $this = this, endDate, endTime;
    $this.settings = options;

    // * before load event here * //
    this.template($element, options);

    // if data-enddate, parse new endDate
    if($element.data().enddate) {
      endDate = $element.data().enddate.split('-');
    }else{
      endDate = $element.find('input').val().split('-');
    }

    // if data-endtime, add time to new date
    if($element.data().endtime) {
      endTime = $element.data().endtime.split(':');
      options.endDate = new Date(endDate[2], endDate[0] - 1, endDate[1], endTime[0], endTime[1]);
    }else if($element.find('input').attr('data-endtime')) {
    // else check for input
      endTime = $element.find('input').attr('data-endtime').split(':');
      options.endDate = new Date(endDate[2], endDate[0] - 1, endDate[1], endTime[0], endTime[1]);
    }else{
    // else leave time out of Date()
      options.endDate = new Date(endDate[2], endDate[0] - 1, endDate[1]);
    }

    // if autostart = true, run set interval for update()
    if(this.settings.autostart) $element.timer = setInterval(function(){ $this.update($element, options) }, options.refresh);

  };

  Countdown.prototype.update = function($element, options){
    var d             = new Date().getTime(), // current date
        milliseconds  = options.endDate.getTime() - d,
        seconds       = Math.floor(( milliseconds / 1000 ) % 60),
        minutes       = Math.floor(((milliseconds / (1000 * 60)) % 60)),
        hours         = Math.floor(((milliseconds / (1000 * 60 * 60)) % 24)),
        days          = Math.floor(  milliseconds / (1000 * 60 * 60 * 24)),
        container     = $('.' + this.classes.wrapper),
        numbers       = container.find($('.' + this.classes.numbers)); //should be changeable

    // if more than 24 hours, show days
    if(days > 0){
      $element.find(numbers).find($('.' + this.classes.days)).text(days);
    }else{
      // else show hours, minutes, seconds
      $element.addClass(this.classes.dayof); // should be changeable

      // if countdown reaches 0 or hours go negative
      if(hours <= 0 && minutes <= 0 && seconds <= 0 || hours < 0){
        // * oncomplete event here * //
        clearInterval($element.timer);
        $element.find(numbers).find('span').text(0);
        $element.trigger('timeup');
      }else{
        $element.find(numbers).find($('.' + this.classes.hours)).text(hours);
        $element.find(numbers).find($('.' + this.classes.minutes)).text(minutes);
        $element.find(numbers).find($('.' + this.classes.seconds)).text(seconds);
      }

    }

    $element.addClass('active');
  };

  Countdown.prototype.namespace = 'countdown';

  Countdown.prototype.classes = {
    wrapper : 'countdown',
    numbers : 'numbers',
    labels  : 'labels',
    days    : 'days',
    hours   : 'hours',
    minutes : 'minutes',
    seconds : 'seconds',
    dayof   : 'dayof'
  };

  Countdown.prototype.events = {
    onbefore    : '',
    onload      : '',
    onfinish    : ''
  };

  Countdown.prototype.template = function($element, options){
    var template = '<div class="time-remaining">' +
                     '<div class="'+ this.classes.numbers +'">' +
                       '<span class="'+ this.classes.days +'">0</span>' +
                       '<span class="'+ this.classes.hours +'">0</span>' +
                       '<span class="'+ this.classes.minutes +'">0</span>' +
                       '<span class="'+ this.classes.seconds +'">0</span>' +
                     '</div><!-- numbers -->' +
                     '<div class="'+ this.classes.labels +'">' +
                       '<span class="'+ this.classes.days +'">days</span>' +
                       '<span class="'+ this.classes.hours +'">hours</span>' +
                       '<span class="'+ this.classes.minutes +'">minutes</span>' +
                       '<span class="'+ this.classes.seconds +'">seconds</span>' +
                     '</div><!-- labels -->' +
                   '</div><!-- time-remaining -->';

    $element.prepend(template);
  };

  //########### jQuery Plugin Definition
  SetPlugin(Countdown, {
    namespace : Countdown.prototype.namespace,
    defaults : {
      autostart : true,
      refresh : 1000
    }
  });
  //###########

  $(function(){
    $('.countdown').countdown();
  });

})(window.jQuery);