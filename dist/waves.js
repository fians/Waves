/*!
 * Waves v0.7.0
 * http://fian.my.id/Waves 
 * 
 * Copyright 2014 Alfiana E. Sibuea and other contributors 
 * Released under the MIT license 
 * https://github.com/fians/Waves/blob/master/LICENSE 
 */

;(function(window, factory) {
    "use strict";

    // AMD. Register as an anonymous module.  Wrap in function so we have access
    // to root via `this`.
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return factory.apply(window);
        });
    }

    // Node. Does not work with strict CommonJS, but only CommonJS-like
    // environments that support module.exports, like Node.
    else if (typeof exports === "object") {
        module.exports = factory.call(window);
    }

    // Browser globals.
    else {
        window.Waves = factory.call(window);
    }
})(typeof global === "object" ? global : this, function () {
    "use strict";

    var Waves = Waves || {};
    var $$ = document.querySelectorAll.bind(document);
    var isTouchAvailable = 'ontouchstart' in window;

    // Find exact position of element
    function isWindow(obj) {
        return obj !== null && obj === obj.window;
    }

    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    function offset(elem) {
        var docElem, win,
            box = {top: 0, left: 0},
            doc = elem && elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
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

        // Effect duration
        duration: 750,

        // Effect delay (check for scroll before showing effect)
        delay: 200,
        
        drag: true,

        show: function(e, element, velocity) {

            // Disable right click
            if (e.button === 2) {
                return false;
            }

            var el = element || this;

            // Create ripple
            var ripple = document.createElement('div');
            ripple.className = 'waves-ripple waves-rippling';
            el.appendChild(ripple);

            // Get click coordinate and element witdh
            var pos         = offset(el);
            var relativeY   = (e.pageY - pos.top);
            var relativeX   = (e.pageX - pos.left);
            var scale       = 'scale('+((el.clientWidth / 100) * 3)+')';
            var translate   = 'translate(0,0)';
            
            if (velocity) {
                translate = 'translate(' + (velocity.x) + 'px, ' + (velocity.y) + 'px)';
            }
            
            // Support for touch devices
            if ('touches' in e && e.touches.length) {
              relativeY   = (e.touches[0].pageY - pos.top);
              relativeX   = (e.touches[0].pageX - pos.left);
            }

            // Attach data to element
            ripple.setAttribute('data-hold', Date.now());
            ripple.setAttribute('data-x', relativeX);
            ripple.setAttribute('data-y', relativeY);
            ripple.setAttribute('data-scale', scale);
            ripple.setAttribute('data-translate', translate);

            // Set ripple position
            var rippleStyle = {
                'top': relativeY+'px',
                'left': relativeX+'px'
            };
            
            ripple.className = ripple.className + ' waves-notransition';
            ripple.setAttribute('style', convertStyle(rippleStyle));
            ripple.className = ripple.className.replace('waves-notransition', '');

            // Scale the ripple
            rippleStyle['-webkit-transform'] = scale + ' ' + translate;
            rippleStyle['-moz-transform'] = scale + ' ' + translate;
            rippleStyle['-ms-transform'] = scale + ' ' + translate;
            rippleStyle['-o-transform'] = scale + ' ' + translate;
            rippleStyle.transform = scale + ' ' + translate;
            rippleStyle.opacity = '1';

            var duration = e.type === 'mousemove' ? 2500 : Effect.duration;
            rippleStyle['-webkit-transition-duration'] = duration + 'ms';
            rippleStyle['-moz-transition-duration']    = duration + 'ms';
            rippleStyle['-o-transition-duration']      = duration + 'ms';
            rippleStyle['transition-duration']         = duration + 'ms';

            ripple.setAttribute('style', convertStyle(rippleStyle));
        },

        hide: function(e, element) {
            
            var el = element ? element : this;
            
            var ripples = el.getElementsByClassName('waves-rippling');
            
            for (var i=0; i<ripples.length; i+=1) {
                removeRipple(e, el, ripples[i]);
            }
        },

        // Little hack to make <input> can perform waves effect
        wrapInput: function(elements) {
            
            for (var a = 0; a < elements.length; a++) {
                
                var el = elements[a];
                
                if (el.tagName.toLowerCase() === 'input') {
                    
                    var parent = el.parentNode;

                    // If input already have parent just pass through
                    if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf('waves-effect') !== -1) {
                        continue;
                    }

                    // Put element class and style to the specified parent
                    var wrapper = document.createElement('i');
                    wrapper.className = el.className + ' waves-input-wrapper';

                    var elementStyle = el.getAttribute('style');

                    if (!elementStyle) {
                        elementStyle = '';
                    }

                    wrapper.setAttribute('style', elementStyle);
                    
                    el.className = 'waves-button-input';
                    el.removeAttribute('style');

                    // Put element as child
                    parent.replaceChild(wrapper, el);
                    wrapper.appendChild(el);
                }
            }
        }
    };
    
    
    /**
     * Hide the effect and remove the ripple. Must be
     * a separate function to pass the JSLint...
     */
    function removeRipple(e, el, ripple) {
        
        ripple.className = ripple.className.replace('waves-rippling', '');

        var relativeX   = ripple.getAttribute('data-x');
        var relativeY   = ripple.getAttribute('data-y');
        var scale       = ripple.getAttribute('data-scale');
        var translate   = ripple.getAttribute('data-translate');

        // Get delay beetween mousedown and mouse leave
        var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
        var delay = 350 - diff;

        if (delay < 0) {
            delay = 0;
        }
        if (e.type === 'mousemove') {
            delay = 150;
        }

        // Fade out ripple after delay
        var duration = e.type === 'mousemove' ? 2500 : Effect.duration;
        
        setTimeout(function() {
            
            var style = {
                'top': relativeY+'px',
                'left': relativeX+'px',
                'opacity': '0',

                // Duration
                '-webkit-transition-duration': duration + 'ms',
                '-moz-transition-duration': duration + 'ms',
                '-o-transition-duration': duration + 'ms',
                'transition-duration': duration + 'ms',
                '-webkit-transform': scale + ' ' + translate,
                '-moz-transform': scale + ' ' + translate,
                '-ms-transform': scale + ' ' + translate,
                '-o-transform': scale + ' ' + translate,
                'transform': scale + ' ' + translate,
            };

            ripple.setAttribute('style', convertStyle(style));

            setTimeout(function() {
                try {
                    el.removeChild(ripple);
                } catch(e) {
                    return false;
                }
            }, duration);
            
        }, delay);
    }


    /**
     * Disable mousedown event for 500ms during and after touch
     */
    var TouchHandler = {
        
        /* uses an integer rather than bool so there's no issues with
         * needing to clear timeouts if another touch event occurred
         * within the 500ms. Cannot mouseup between touchstart and
         * touchend, nor in the 500ms after touchend. */
        touches: 0,
        
        allowEvent: function(e) {
            
            var allow = true;

            if ((e.type === 'mousedown' || e.type === 'mousemove') && TouchHandler.touches > 0) {
                allow = false;
            }

            return allow;
        },
        registerEvent: function(e) {
            
            if (e.type === 'touchstart') {
                
                TouchHandler.touches += 1; //push
                
            } else if (e.type === 'touchend' || e.type === 'touchcancel') {
                
                setTimeout(function() {
                    if (TouchHandler.touches > 0) {
                        TouchHandler.touches -= 1; //pop after 500ms
                    }
                }, 500);
                
            }
        }
    };


    /**
     * Delegated click handler for .waves-effect element.
     * returns null when .waves-effect element not in "click tree"
     */
    function getWavesEffectElement(e) {
        
        if (TouchHandler.allowEvent(e) === false) {
            return null;
        }

        var element = null;
        var target = e.target || e.srcElement;

        while (target.parentElement !== null) {
            if (!(target instanceof SVGElement) && target.className.indexOf('waves-effect') !== -1) {
                element = target;
                break;
            } else if (target.classList.contains('waves-effect')) {
                element = target;
                break;
            }
            target = target.parentElement;
        }

        return element;
    }

    /**
     * Bubble the click and show effect if .waves-effect elem was found
     */
    function showEffect(e) {
        
        TouchHandler.registerEvent(e);
        
        var element = getWavesEffectElement(e);

        if (element !== null) {
            
            if (e.type === 'touchstart' && Effect.delay) {
                
                var hidden = false;
                
                var timer = setTimeout(function () {
                    timer = null;
                    Effect.show(e, element);
                }, Effect.delay);

                var hideEffect = function(hideEvent) {
                    
                    // if touch hasn't moved, and effect not yet started: start effect now
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                        Effect.show(e, element);
                    }
                    if (!hidden) {
                        hidden = true;
                        Effect.hide(hideEvent, element);
                    }
                };

                var touchMove = function(moveEvent) {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    hideEffect(moveEvent);
                };

                element.addEventListener('touchmove', touchMove, false);
                element.addEventListener('touchend', hideEffect, false);
                element.addEventListener('touchcancel', hideEffect, false);
                
            } else {
                
                Effect.show(e, element);

                if (isTouchAvailable) {
                    element.addEventListener('touchend', Effect.hide, false);
                    element.addEventListener('touchcancel', Effect.hide, false);
                }

                element.addEventListener('mouseup', Effect.hide, false);
                element.addEventListener('mouseleave', Effect.hide, false);
            }
        }
    }
    
    /**
     * The dragging ripple effect.
     * Only works with mouse events for the time being.
     */
    var lastDrag    = new Date();
    var lastCoord   = {
        x: 0, 
        y: 0
    };
    
    function dragEffect(e) {
        
        if (!TouchHandler.allowEvent(e)) {
            return;
        }
        
        var element = getWavesEffectElement(e);
        
        if (lastDrag.getTime() < (e.timeStamp - 200) || allowRipple(element)) {
            
            lastDrag    = new Date();
            lastCoord   = {x: e.x, y: e.y};
            
            var velocity = null;
            
            if (e.movementX || e.movementY) {
                velocity = {
                    x: e.movementX, 
                    y: e.movementY
                };
            }
            
            Effect.show(e, element, velocity);
            Effect.hide(e, element);
        }
        
        function allowRipple(element) {
            
            var v = {
                x: e.x - lastCoord.x, 
                y: e.y - lastCoord.y
            };
            
            return (Math.max(element.clientWidth, element.clientTop) / 7) < magnitude(v);
        }
        
        function magnitude(coord) {
            return Math.sqrt(Math.pow(coord.x, 2) + Math.pow(coord.y, 2));
        }
    }

    Waves.init = function(options) {
        
        options = options || {};

        if ('duration' in options) {
            Effect.duration = options.duration;
        }
        if ('delay' in options) {
            Effect.delay = options.delay;
        }
        
        //Wrap input inside <i> tag
        Effect.wrapInput($$('.waves-effect'));
        
        if (isTouchAvailable) {
            document.body.addEventListener('touchstart', showEffect, false);
            document.body.addEventListener('touchcancel', TouchHandler.registerEvent, false);
            document.body.addEventListener('touchend', TouchHandler.registerEvent, false);
        }
        
        document.body.addEventListener('mousedown', showEffect, false);
    };

    
    /**
     * Attach Waves to dynamically loaded inputs, or add .waves-effect and other
     * waves classes to a set of elements. Set drag to true if the ripple mouseover
     * or skimming effect should be applied to the elements.
     */
    Waves.attach = function(elements, classes, drag) {
        
        classes     = classes ? classes : '';
        
        var es = [];
        
        if (typeof elements == 'string' || elements instanceof String) {
            // selector
            es = $$(elements);
        } else if (Object.prototype.toString.call(elements) === '[object Array]') {
            // array of HTML elements
            es = elements;
        } else {
            // single HTML element
            es = [elements];
        }
        
        for (var i=0; i<es.length; i+=1) {
            
            var element = es[i];
            
            if (element.tagName.toLowerCase() === 'input') {
                Effect.wrapInput([element]);
                element = element.parentElement;
            }

            element.className += ' waves-effect ' + classes;
            
            if (drag) {
                element.addEventListener('mousemove', dragEffect, false);
            }
        }
    };

    return Waves;
});
