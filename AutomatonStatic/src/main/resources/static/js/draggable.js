(function( $ ) {

    var DRAGGABLE = '.jsDraggable';
    var PLUGIN_NAME = 'draggable';

    class Drag {
        constructor(context, $form, $draggable, options) {
            this.context = context;
            this.$form = $form;
            this.$draggable = $draggable;
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;

            if (this.$draggable) {
                this.$draggable.mousedown(this.dragMouseDown.bind(this));
            } else {
                this.$form.mousedown(this.dragMouseDown.bind(this));
            }
        }

        dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            this.x2 = e.clientX;
            this.y2 = e.clientY;

            $(document).mouseup(this.closeDragElement.bind(this));
            $(document).mousemove(this.elementDrag.bind(this));
        }

        elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            this.x1 = this.x2 - e.clientX;
            this.y1 = this.y2 - e.clientY;
            this.x2 = e.clientX;
            this.y2 = e.clientY;

            var offset = this.$form.offset();
            this.$form.css({top: (offset.top - this.y1) + 'px', left: (offset.left - this.x1) + 'px'});

            this.$form.find('.jsMovable').movable('move', this.$form);
        }

        closeDragElement() {
            $(document).unbind('mouseup');
            $(document).unbind('mousemove');
        }
    }

    var methods = {
        init: function(options) {
            return this.each(
                function() {
                    var $form = $(this);
                    var $draggable = $form.find(DRAGGABLE);
                    var data = $form.data(PLUGIN_NAME);

                    if (!data) {
                        $(this).data(PLUGIN_NAME, new Drag(this, $form, $draggable, options));
                    }
               }
            );
        }
    };

    $.fn[PLUGIN_NAME] = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
    };
})(jQuery);