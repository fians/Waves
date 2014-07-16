
/*!
 * Waves v0.1.0
 * https://publicis-indonesia.github.io/Waves/
 *
 * Copyright 2014 Publicis Metro Indonesia, PT. and other contributors
 * Released under the BSD license
 * https://github.com/publicis-indonesia/Waves/blob/master/LICENSE
 */

;(function(window, $) {

    var button = {};

    button.rippleShow = function(e) {

        var el = $(this);

        el.append('<div class="waves-ripple"></div>');

        // Get click coordinate and element witdh
        var offset      = el.offset();
        var relativeX   = (e.pageX - offset.left);
        var relativeY   = (e.pageY - offset.top);
        var width       = el.outerWidth();

        // Attach data to element
        el.data('hold', Date.now());
        el.data('relativeX', relativeX);
        el.data('relativeY', relativeY);

        var ripple = el.find('.waves-ripple');

        // Start ripple
        ripple
            .addClass('waves-notransition')
            .css({'top' : relativeY, 'left': relativeX});

        ripple['context'].offsetHeight;

        ripple
            .removeClass('waves-notransition')
                .css({
                'border-width': width,
                'margin-top': -width,
                'margin-left': -width,
                'opacity': 1
            });
    };

    button.rippleHide = function() {

        // Get element and ripple
        var el = $(this);
        var ripple = el.find('.waves-ripple');

        // Get delay beetween mousedown and mouse leave
        var diff = Date.now() - el.data('hold');
        var delay = 500 - diff;

        if (delay < 0) {
            delay = 0;
        }

        // Fade out ripple after delay
        setTimeout(function() {

            ripple.css({
                'top' : el.data('relativeY'), 
                'left': el.data('relativeX'),
                'opacity': 0,
            });

            setTimeout(function() {
                ripple.remove();
            }, 300);

        }, delay);

    }

    // Attach event
    $(document).on('ready', function() {
        $(this)
            .on('mousedown', '.waves-element', button.rippleShow)
            .on('mouseup mouseleave', '.waves-element', button.rippleHide);
    });

    

})(window, jQuery);

