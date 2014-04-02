/**
 * autoWarning.js v1.0.0
 * A minimal jQuery modal that automatically shows and loads jQuery if needed.
 * Author: Momba - http://momba.github.com/
 * URL: https://github.com/momba/autoWarning.js
 */

/*jslint browser: true*/

! function() {
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
            script.onreadystatechange = function() {
                if ("loaded" == script.readyState || "complete" == script.readyState) {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function() {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    if (window.jQuery) {
        _warningModal(jQuery);
    } else {
        loadScript("http://code.jquery.com/jquery-latest.min.js", function() {
            _warningModal(jQuery);
        });
    }
}();

var _warningModal = function(a) {
    "use strict";
    var methods = {
        init: function(options) {

            var defaults = {
                top: 'auto',
                autoOpen: false,
                overlayOpacity: 0.5,
                overlayColor: '#000',
                overlayClose: true,
                overlayParent: 'body',
                closeOnEscape: true,
                closeButtonClass: '.close',
                transitionIn: '',
                transitionOut: '',
                onOpen: false,
                onClose: false,
                zIndex: function() {
                    return (function(value) {
                        return value === -Infinity ? 0 : value + 1;
                    }(Math.max.apply(Math, a.makeArray(a('*').map(function() {
                        return a(this).css('z-index');
                    }).filter(function() {
                        return a.isNumeric(this);
                    }).map(function() {
                        return parseInt(this, 10);
                    })))));
                },
                updateZIndexOnOpen: true
            };

            options = a.extend(defaults, options);

            return this.each(function() {

                var o = options,
                    $overlay = a('<div class="lean-overlay"></div>'),
                    $modal = a(this);

                $overlay.css({
                    'display': 'none',
                    'position': 'fixed',
                    // When updateZIndexOnOpen is set to true, we avoid computing the z-index on initialization,
                    // because the value would be replaced when opening the modal.
                    'z-index': (o.updateZIndexOnOpen ? 0 : o.zIndex()),
                    'top': 0,
                    'left': 0,
                    'height': '100%',
                    'width': '100%',
                    'background': o.overlayColor,
                    'opacity': o.overlayOpacity,
                    'overflow': 'auto'
                }).appendTo(o.overlayParent);

                $modal.css({
                    'display': 'none',
                    'position': 'fixed',
                    // When updateZIndexOnOpen is set to true, we avoid computing the z-index on initialization,
                    // because the value would be replaced when opening the modal.
                    'z-index': (o.updateZIndexOnOpen ? 0 : o.zIndex() + 1),
                    'left': 50 + '%',
                    'top': parseInt(o.top, 10) > -1 ? o.top + 'px' : 50 + '%'
                });

                $modal.bind('openModal', function() {
                    var overlayZ = o.updateZIndexOnOpen ? o.zIndex() : parseInt($overlay.css('z-index'), 10),
                        modalZ = overlayZ + 1;

                    if (o.transitionIn !== '' && o.transitionOut !== '') {
                        $modal.removeClass(o.transitionOut).addClass(o.transitionIn);
                    }
                    $modal.css({
                        'display': 'block',
                        'margin-left': -($modal.outerWidth() / 2) + 'px',
                        'margin-top': (parseInt(o.top, 10) > -1 ? 0 : -($modal.outerHeight() / 2)) + 'px',
                        'z-index': modalZ
                    });

                    $overlay.css({
                        'z-index': overlayZ,
                        'display': 'block'
                    });

                    if (o.onOpen && typeof o.onOpen === 'function') {
                        // onOpen callback receives as argument the modal window
                        o.onOpen($modal[0]);
                    }
                });

                $modal.bind('closeModal', function() {
                    if (o.transitionIn !== '' && o.transitionOut !== '') {
                        $modal.removeClass(o.transitionIn).addClass(o.transitionOut);
                        $modal.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                            $modal.css('display', 'none');
                            $overlay.css('display', 'none');
                        });
                    } else {
                        $modal.css('display', 'none');
                        $overlay.css('display', 'none');
                    }
                    if (o.onClose && typeof o.onClose === 'function') {
                        // onClose callback receives as argument the modal window
                        o.onClose($modal[0]);
                    }
                });

                // Close on overlay click
                $overlay.click(function() {
                    if (o.overlayClose) {
                        $modal.trigger('closeModal');
                    }
                });

                a(document).keydown(function(e) {
                    // ESCAPE key pressed
                    if (o.closeOnEscape && e.keyCode === 27) {
                        $modal.trigger('closeModal');
                    }
                });

                // Close when button pressed
                $modal.on('click', o.closeButtonClass, function(e) {
                    $modal.trigger('closeModal');
                    e.preventDefault();
                });

                // Automatically open modal if option set
                if (o.autoOpen) {
                    $modal.trigger('openModal');
                }

            });

        }
    };

    a.fn.easyModal = function(method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }

        a.error('Method ' + method + ' does not exist on jQuery.easyModal');

    };
    var modalDom = {};
    modalDom.cssSrc = "#modal1 {background: #FF2D55;text-align: center;width: 600px;padding: 5px 0;color: #FFF;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);font-weight: 600;}#modal1 h1 {font-weight: 600;font-size: 24px;padding-top: 45px;padding-bottom: 45px;}#modal1 p {padding-bottom: 45px;}";
    modalDom.cssTag = a("<style>").text(modalDom.cssSrc).appendTo(a("head"));
    modalDom.modal = a("<div id='modal1' style='display: none; position: fixed; z-index: 2; left: 50%; top: 200px; margin-left: -300px; margin-top: 0px;'>").appendTo(a("body"));
    modalDom.h1 = a("<h1></h1>").text("Changing this content can break things.").appendTo(modalDom.modal);
    modalDom.p = a("<p></p>").text("If you are not completely sure about how to make changes, please contact a developer.").appendTo(modalDom.modal);
    modalDom.overlay = a("<div class='lean-overlay' style='display: none; position: fixed; z-index: 1; top: 0px; left: 0px; height: 100%; width: 100%; background-color: #000000; opacity: 0.5; overflow: auto;''></div >").appendTo(a("body"));
    a("#modal1").easyModal({
        top: 200,
        overlay: 0.2,
        autoOpen: !0
    });
};
