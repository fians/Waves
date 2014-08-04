
/*!
 * Waves v0.5.0-dev
 * https://publicis-indonesia.github.io/Waves
 *
 * Copyright 2014 Publicis Metro Indonesia, PT. and other contributors
 * Released under the BSD license
 * https://github.com/publicis-indonesia/Waves/blob/master/LICENSE
 */

;(function(window) {
    'use strict';

    var circleBlack = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT9JREFUeNrsmu0NgyAQhm0ncIMyihvoBh2hbtQRiBPoBq5gJ2AEKgkmlFCjFsq9Fy95f4o83PF1R1EwsUuCNqtZwipkk9VAbTBMh9tZ/Sy9U739VuQEMCMvD3T+m6Rt868eiAkQAkruIRMGKiHEImX/Fd3KxF5Y804ZE2LMALFojAGTGyIKDBWIn2EkIQh3zuxenTRRtXv2CUUYRG3dZyRhiM0hVgFALPo4zlw9kAfQyf2+Njc0mETIIw3gfaoJgdSAIHXohqiRb7lXZ7VCtcoFEcAggiUIvLEDuXEBeZ2hRQxkAmaYWIGwO6IYGwAhhtBk7wBBOnYXK8TEw6YEBGzygW06iFWCjk3KlHKIySNrNJuyAiUYFlWrKBAuDHwx1F/NoMvT/j4D/2DAP87EBHrmzniKgsCjmvOZEzV7CzAAfRfSinqQv9YAAAAASUVORK5CYII="/>';
    var circleWhite = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZRJREFUeNrsmgttwzAQhu0hCIN5DDYGLYKWwSAsFIqgKoJASIogYZAxWIZgZeBdpFsVWW4ek93cb/WXTpGqPPz1zo87W6lEpEO/0Fq7oYth86nrTWvdiPonqOGGLCer7XLV/KxZE2BDVtpwKtmbd/VASAAfkIkN0YfBj42v/ht5DIAsshfGvJOFhGjtemrnwOgpCLrUZK8rD46fZFsasi+LQQRBzIJ5GnmwEAShuC3Ff0YnqcpnhRaP4S1ZpmSqD603CrFuKrSOgiEUt+046hFeItQgC97tcOHpeuQDaOX+7vUI940vsDTk5a+vDD2yB8yn9r7Q2gGC7HyhZSFTXNLVI3dNaOKk1tfQMgpXJkkQeCUH8pwKyPcjtISBdMAMXVIgaS1RWA0ghzexOgOCnNNNrPiHCgiiGlZS3HnkBARyujkhclWiAvFG4y0+OH0Fv0DHNxwEe+PgQkylkKXAum95c2IcAYHaVkhmo2dOiEFsvS2Bwd4MdYCwt6fdeQb+wIADFPoIR7FqxVPKoZrHMSdp+hVgAFDueSKuGHB/AAAAAElFTkSuQmCC"/>';
    
    var Waves = Waves || {};
    var $$ = document.querySelectorAll.bind(document);

    // Find exact position of element
    function position(obj) {

        var left = 0;
        var top = 0;
        
        if (obj.offsetParent) {
            do {
                left += obj.offsetLeft;
                top += obj.offsetTop;
            } while (obj === obj.offsetParent);
        }

        return {
            top: top, 
            left: left
        };
    }

    function convertStyle(obj) {

        var style = '';

        for (var a in obj) {
            if (obj.hasOwnProperty(a)) {
                style += (a + ':' + obj[a] + ';');
            }
        }

        return style;
    }

    var Effect = {

        // Effect delay
        duration: 500,

        show: function(e) {

            var el = this;

            // Create ripple
            var ripple = document.createElement('div');
            ripple.className = 'waves-ripple';
            el.appendChild(ripple);

            // Get click coordinate and element witdh
            var pos         = position(el);
            var relativeY   = (e.pageY - pos.top);
            var relativeX   = (e.pageX - pos.left);
            var width       = el.clientWidth * 1.4;

            // Attach data to element
            ripple.setAttribute('data-hold', Date.now());
            ripple.setAttribute('data-x', relativeX);
            ripple.setAttribute('data-y', relativeY);

            // Set ripple position
            var rippleStyle = {
                'top': relativeY+'px',
                'left': relativeX+'px'
            };
            
            ripple.className = ripple.className + ' waves-notransition';
            ripple.setAttribute('style', convertStyle(rippleStyle));
            ripple.className = ripple.className.replace('waves-notransition', '');

            rippleStyle['border-width'] = width+'px';
            rippleStyle['margin-top']   = '-'+width+'px';
            rippleStyle['margin-left']  = '-'+width+'px';
            rippleStyle.opacity         = '1';

            rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
            rippleStyle['-moz-transition-duration']    = Effect.duration + 'ms';
            rippleStyle['-o-transition-duration']      = Effect.duration + 'ms';
            rippleStyle['transition-duration']         = Effect.duration + 'ms';

            ripple.setAttribute('style', convertStyle(rippleStyle));

        },

        hide: function() {
            
            var el = this;

            var width = el.clientWidth * 1.4;
            
            // Get first ripple
            var ripple = null;

            var childrenLength = el.children.length;

            for (var a = 0; a < childrenLength; a++) {
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

                var style = {
                    'top': relativeY+'px',
                    'left': relativeX+'px',
                    'border-width': width+'px',
                    'margin-top': '-'+width+'px',
                    'margin-left': '-'+width+'px',
                    'opacity': '0',

                    // Duration
                    '-webkit-transition-duration': Effect.duration + 'ms',
                    '-moz-transition-duration': Effect.duration + 'ms',
                    '-o-transition-duration': Effect.duration + 'ms',
                    'transition-duration': Effect.duration + 'ms',
                };

                ripple.setAttribute('style', convertStyle(style));

                setTimeout(function() {

                    try {
                        el.removeChild(ripple);
                    } catch(e) {
                        return false;
                    }

                    
                }, 300);

            }, delay);

        },

        // Little hack to make <input> can perform waves effect
        wrapInput: function(elements) {

            for (var a = 0; a < elements.length; a++) {

                var el = elements[a];

                if (el.tagName.toLowerCase() === 'input') {

                    var parent = el.parentNode;

                    // If input already have parent just pass through
                    if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf('waves-effect') !== -1) {
                        return false;
                    }

                    // Put element class and style to the specified parent
                    var wrapper = document.createElement('i');
                    wrapper.className = el.className + ' waves-input-wrapper';

                    var elementStyle = el.getAttribute('style');
                    var dimensionStyle = 'width:'+el.offsetWidth+'px;height:'+el.clientHeight+'px;';

                    if (!elementStyle) {
                        elementStyle = '';
                    }

                    wrapper.setAttribute('style', dimensionStyle+elementStyle);
                    
                    el.className = 'waves-button-input';
                    el.removeAttribute('style');

                    // Put element as child
                    parent.replaceChild(wrapper, el);
                    wrapper.appendChild(el);

                }
                
            }
        }
    };

    Waves.displayEffect = function(options) {

        options = options || {};

        if ('duration' in options) {
            Effect.duration = options.duration;
        }
        
        //Wrap input inside <i> tag
        Effect.wrapInput($$('.waves-effect'));

        Array.prototype.forEach.call($$('.waves-effect'), function(i) {
            
            if (window.Touch) {
                i.addEventListener('touchstart', Effect.show, false);
                i.addEventListener('touchend', Effect.hide, false);
            }

            i.addEventListener('mousedown', Effect.show, false);
            i.addEventListener('mouseup', Effect.hide, false);
            i.addEventListener('mouseleave', Effect.hide, false);

        });

    };

    window.Waves = Waves;

})(window);