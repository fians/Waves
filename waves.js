
/*!
 * Waves v0.2.0
 * https://publicis-indonesia.github.io/Waves
 *
 * Copyright 2014 Publicis Metro Indonesia, PT. and other contributors
 * Released under the BSD license
 * https://github.com/publicis-indonesia/Waves/blob/master/LICENSE
 */

;(function(window) {
    'use strict';

    function Waves() {

        var $$ = document.querySelectorAll.bind(document);

        var Effect = {

            show: function(e) {

                var el = this;

                // Create ripple
                var ripple = document.createElement('div');
                ripple.className = ripple.className + 'waves-ripple';
                el.appendChild(ripple);

                // Get click coordinate and element witdh
                var relativeX   = (e.pageX - el.offsetLeft);
                var relativeY   = (e.pageY - el.offsetTop);
                var width       = el.clientWidth;

                // Attach data to element
                ripple.setAttribute('data-hold', Date.now());
                ripple.setAttribute('data-x', relativeX);
                ripple.setAttribute('data-y', relativeY);

                // Start ripple
                var positionStyle = 'top:'+relativeY+'px;left:'+relativeX+'px;';
                var flowStyle = 'border-width:'+width+'px;margin-top:-'+width+'px;margin-left:-'+width+'px;opacity:1;';

                ripple.className = ripple.className + ' waves-notransition';
                ripple.setAttribute('style', positionStyle);
                ripple.offsetHeight;
                ripple.className = ripple.className.replace('waves-notransition', '');
                ripple.setAttribute('style', positionStyle+flowStyle);
                
            },

            hide: function(e) {
                
                var el = this;
                var width = el.clientWidth;
                
                // Get first ripple
                var ripple = null;

                for (var a = 0; a < el.children.length; a++) {
                    if (el.children[a].className.indexOf('waves-ripple') !== -1) {
                        ripple = el.children[a];
                        continue;
                    }
                }

                if (!ripple) {
                    return false;
                }

                var relativeX   = ripple.getAttribute('data-x');
                var relativeY   = ripple.getAttribute('data-y');

                // Get delay beetween mousedown and mouse leave
                var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
                var delay = 500 - diff;

                if (delay < 0) {
                    delay = 0;
                }

                // Fade out ripple after delay
                setTimeout(function() {

                    var style = 'top:'+relativeY+'px;left:'+relativeX+'px;border-width:'+width+'px;margin-top:-'+width+'px;margin-left:-'+width+'px;opacity:0;';

                    ripple.setAttribute('style', style);

                    setTimeout(function() {
                        try {
                            el.removeChild(ripple);
                        } catch(e) {
                            return false;
                        }
                    }, 300);

                }, delay);

            },
        };

        return {
            displayEffect: function() {

                Array.prototype.forEach.call($$('.waves-effect'), function(i) {

                    if (window.Touch) {
                        i.addEventListener('touchstart', Effect.show, false);
                        i.addEventListener('touchend', Effect.hide, false);
                    }

                    i.addEventListener('mousedown', Effect.show, false);
                    i.addEventListener('mouseup', Effect.hide, false);
                    i.addEventListener('mouseleave', Effect.hide, false);

                });

            }
        }
    }

    window.Waves = Waves;

})(window);
