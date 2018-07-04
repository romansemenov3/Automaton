(function( $ ) {

    var DRAGGABLE = '.jsConnector';
    var PLUGIN_NAME = 'connector';
    var CONNECTOR_SHIFT = 20;

    class Connector {
        constructor(context, $line, options) {
            this.context = context;
            this.$line = $line;
            this.$from = $(options.from);
            this.$to = $(options.to);

            this.leftLink = true;
            this.rightLink = true;
            this.topLink = false;
            this.bottomLink = false;

            this.fromPos = this.getMovablePosition(this.$from);
            this.toPos = this.getMovablePosition(this.$to);
            this.updateConnector();

            this.$from.movable({
                onmove: function(pos) {
                    this.fromPos = pos;
                    this.updateConnector();
                }.bind(this)
            });

            this.$to.movable({
                onmove: function(pos) {
                    this.toPos = pos;
                    this.updateConnector();
                }.bind(this)
            });
        }

        getMovablePosition($element) {
            var parentPosition = $element.parent().position();
            var movablePosition = $element.position();

            return {
                top: parentPosition.top + movablePosition.top,
                left: parentPosition.left + movablePosition.left
            }
        }

        getPoints(pos, $element, leftLink, rightLink, topLink, bottomLink) {
            var result = [];

            var height = pos.top + $element.height()/2;
            var width = pos.left + $element.width()/2;
            if(leftLink) {
                result.push({
                    left: pos.left,
                    leftShift: pos.left - CONNECTOR_SHIFT,
                    top: height,
                    topShift: height
                });
            }
            if(rightLink) {
                result.push({
                    left: pos.left + $element.width(),
                    leftShift: pos.left + $element.width() + CONNECTOR_SHIFT,
                    top: height,
                    topShift: height
                });
            }
            if(topLink) {
                result.push({
                    left: width,
                    leftShift: width,
                    top: pos.top,
                    topShift: pos.top - CONNECTOR_SHIFT
                });
            }
            if(bottomLink) {
                result.push({
                    left: width,
                    leftShift: width,
                    top: pos.top + $element.height(),
                    topShift: pos.top + $element.height() + CONNECTOR_SHIFT
                });
            }
            return result;
        }

        getDistance(source, target) {
            return Math.abs(source.leftShift - target.leftShift) + Math.abs(source.topShift - target.topShift);
        }

        getClosestPoints() {
            var fromPoints = this.getPoints(this.fromPos, this.$from, this.leftLink, this.rightLink, this.topLink, this.bottomLink);
            var toPoints = this.getPoints(this.toPos, this.$to, this.leftLink, this.rightLink, this.topLink, this.bottomLink);

            var fromPoint = 0;
            var toPoint = 0;
            var distance = this.getDistance(fromPoints[fromPoint], toPoints[toPoint]);

            for(var from = 0; from < fromPoints.length; ++from) {
                for(var to = 0; to < toPoints.length; ++to) {
                    var newDistance = this.getDistance(fromPoints[from], toPoints[to]);
                    if(distance > newDistance) {
                        fromPoint = from;
                        toPoint = to;
                        distance = newDistance;
                    }
                }
            }

            return [fromPoints[fromPoint], toPoints[toPoint]];
        }

        updateConnector() {
            var closestPoints = this.getClosestPoints();

            var points = [closestPoints[0],
                         {
                            left: closestPoints[0].leftShift,
                            top: closestPoints[0].topShift
                         },
                         {
                            left: closestPoints[1].leftShift,
                            top: closestPoints[1].topShift
                         },
                         closestPoints[1]];

            var d = this.buildPath(points);
            this.$line.attr('d', d);
        }

        buildPath(points) {
            var result = 'M ' + points[0].left + ' ' + points[0].top;

            for(var i = 1; i < points.length; ++i) {
                result += ' L ' + points[i].left + ' ' + points[i].top;
            }

            return result;
        }
    }

    var methods = {
        init: function(options) {
            return this.each(
                function() {
                    var $line = $(this);
                    var data = $line.data(PLUGIN_NAME);

                    if (!data) {
                        $line.data(PLUGIN_NAME, new Connector(this, $line, options));
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