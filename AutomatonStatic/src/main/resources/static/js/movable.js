(function( $ ) {

    var MOVABLE = '.jsMovable';
    var PLUGIN_NAME = 'movable';

    class Movable {
        constructor(context, $element, options) {
            this.context = context;
            this.$element = $element;

            if(options) {
                if(options.onmove) {
                    this.onmove = options.onmove;
                }
            }
        }
    }

    var methods = {
        init: function(options) {
            return this.each(
                function() {
                    var $element = $(this);
                    var data = $element.data(PLUGIN_NAME);

                    if (!data) {
                        $(this).data(PLUGIN_NAME, new Movable(this, $element, options));
                    }
               }
            );
        },

        onmove: function(handler) {
            return this.each(
                function() {
                    var data = $(this).data(PLUGIN_NAME);
                    if (data) {
                        if(data.onmove) {
                            console.log('Rewrite onmove handler');
                        }
                        data.onmove = handler;
                    }
               }
            );
        },

        move: function(parent) {
            return this.each(
                function() {
                    var data = $(this).data(PLUGIN_NAME);
                    if (data) {
                        if(data.onmove) {
                            var parentPosition = parent.position();
                            var movablePosition = data.$element.position();

                            var position = {
                                top: parentPosition.top + movablePosition.top,
                                left: parentPosition.left + movablePosition.left
                            }

                            data.onmove.call(data.context, position);
                        }
                    }
               }
            );
        }
    };

    $.fn[PLUGIN_NAME] = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments );
        }
    };
})(jQuery);