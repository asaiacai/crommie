
jQuery.extend({
  randomColor: function() {
    return '#' + Math.floor(Math.random()*256*256*256).toString(16);
  }
});

(function(removeClass) {
  jQuery.fn.removeClass = function(value) {
    if(value && typeof value.test === 'function') {
      for(var i = 0; i < this.length; i++) {
        var elem = this[i];
        if( elem.nodeType === 1 && elem.className ) {
          var classNames = elem.className.split(/\s+/);
          for(var n = 0; n < classNames.length; n++) {
            if(value.test(classNames[n])) {
              classNames.splice(n, 1);
            }
          }
          elem.className = jQuery.trim(classNames.join(" "));
        }
      }
    } else {
      removeClass.call(this, value);
    }

    return this
  }
})(jQuery.fn.removeClass);

jQuery(document).ready(function() {
  jQuery('html').removeClass('no-js');
});

jQuery(document).foundation();


(function($) {
  "use strict";
  $(document).ready(function() {

    $('video').each(function() {
      this.muted = true;
    });

    $('.fadeinleft, .fadeinright, .fadein, .popin').appear(function() {
      var delay = $(this).data('delay');
      var that = this;

      setTimeout(function() {
        $(that).addClass('appear');
      }, delay)

    });

    // $('.popin').each(function() {
    //   $(this).addClass('appear');
    // });

    $(window).scroll(function() {

      var scroll = $(window).scrollTop();

      if ( scroll >= 40 ) {
        $('body').addClass('shrink');
      } else {
        $('body').removeClass('shrink');
      }

    });

    $('form#contact_form').validate({
      messages: { },
      submitHandler: function(form) {
        $.ajax({
          type: 'POST',
          url: 'send.php',
          data: $(form).serialize(),
          success: function(data) {
            if(data.match(/success/)) {
              $(form).trigger('reset');
              $('#thanks').show().fadeOut(5000);
            }
          }
        });
        return false;
      }
    });

    if($('.masonry-container').length > 0) {

      $('.masonry-container').each(function() {
        var that = $(this);

        // initialize Masonry after all images have loaded
        $(that).imagesLoaded(function() {

          setTimeout(function() {
            window.msnry = new Masonry($(that)[0], {
              itemSelector: '.mod',
              // columnWidth: '.mod',
              gutter: 30
            });

            // window.msnry.layout();

          }, 10);

        });

      });
    }


    // onepage nav scroll
    if ( $("nav.top-bar.onepage").length > 0 ) {
      $('.top-bar-section a[href=#top]').closest('li').addClass('active');

      var ctx = $("nav.top-bar.onepage");

      // var headerHeight = ctx.height();
      // $(window).scroll(function() {
      //   headerHeight = ctx.height();
      //   console.log(headerHeight);
      // });
      var headerHeight = 59;

      // use to mark whether the scrolling is caused by clicking
      var clickScrolling = false;
      // cache for current anchor id
      var currentAnchorId;

      $('.top-bar-section a', ctx).click(function(event) {
        $('.top-bar-section a', ctx).closest('li').removeClass('active');
        $(this).closest('li').addClass('active');
        clickScrolling = true;
        // console.log($(this).attr('href').offset());
        try {
          if ( $(this).attr('href') == '#top' ) {
            var distance = 0
          } else {
            var distance = $($(this).attr('href')).offset().top - headerHeight + 'px';
          }

          // console.log(distance);

          $('html, body').stop().animate({
            scrollTop: distance
          }, { duration: 1200, easing: "easeInOutExpo", complete: function() { clickScrolling = false; } });
          event.preventDefault();
        } catch(e) {}
      });


      // hightlight nav when scrolling
      var anchors = $('.top-bar-section a', ctx).map(function() {
        var anchor = $($(this).attr('href'));
        if(anchor.length) { return anchor; }
      });

      $(window).scroll(function() {
        if(clickScrolling) return false;

        var fromTop = $(this).scrollTop();
        var passedAnchors = anchors.map(function() {
          // add 1 to make the current nav change 1px before it should when scrolling top to bottom
          if(fromTop + headerHeight + 1 >= $(this).offset().top)
            return this;
        });
        // get the last anchor in the passedAnchors as the current one
        var currentAnchor = passedAnchors[passedAnchors.length - 1];
        if(currentAnchor) {
          if(currentAnchorId !== currentAnchor.attr('id')) {
            currentAnchorId = currentAnchor.attr('id');
            $('.top-bar-section a', ctx).closest('li').removeClass('active');
            $('.top-bar-section a[href=#'+currentAnchorId+']', ctx).closest('li').addClass('active');
          }
        }

      });


    }


  });
})(jQuery);
(function($) {
  Tc.Module.DefaultSlider = Tc.Module.extend({
    init: function($ctx, sandbox, modId) {
      this._super($ctx, sandbox, modId);
    },
    dependencies: function() {
      // this.require('jquery.sequence-min.js', 'plugin', 'onBinding');
    },
    onBinding: function() {
      var $ctx = this.$ctx;

      var options = {
        nextButton: true,
        prevButton: true,
        autoPlay: true,
        autoPlayDelay: 5000,
        cycle: true,
        // preloader: true,
        animateStartingFrameIn: true,
        pagination: true,
        preventDelayWhenReversingAnimations: true,
        fadeFrameWhenSkipped: false,
        swipeEvents: {
          left: "next",
          right: "prev"
        },
      }

      var autostop = $('.sequence', $ctx).data('autostop') == 'on' ? true : false;
      var timeout = $('.sequence', $ctx).data('timeout');

      if ( timeout == '0' ) {
        options.autoPlay = false;
      } else {
        options.autoPlay = true;
        options.autoPlayDelay = parseInt(timeout);
      }

      if ( autostop ) {
        options.autoStop = true;
      } else {
        options.autoStop = false;
      }

      // console.log(options);

      var sequence = $(".sequence", $ctx).sequence(options).data("sequence");
      sequence.beforeCurrentFrameAnimatesOut = function() {
        var sequence = this;
        var removeStatic = function() {
          jQuery(".frame.static").removeClass('static');
          if ( !window.sequenceAutoStarted && sequence.settings.autoPlay ) {
            sequence.startAutoPlay(sequence.settings.autoPlayDelay);
            window.sequenceAutoStarted = true;
          }
        }
        setTimeout(removeStatic, 1000);

        // when the next frame is the last one
        if ( sequence.nextFrameID == sequence.frames.length && options.autoStop ) {
          // console.log(sequence.nextFrameID);
          sequence.stopAutoPlay();
        }

      }


    }
  })
})(Tc.$);
