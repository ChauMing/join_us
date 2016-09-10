'use strict';

var orienterStartRotateX = 0;
var orienterStartRotateY = 0;

function throttle(method, delay, duration) {
    var timer = null;
    var begin = new Date();
    return function () {
        var context = this,
            args = arguments,
            current = new Date();

        clearTimeout(timer);

        if (current - begin >= duration) {
            method.apply(context, args);
            begin = current;
        } else {
            timer = setTimeout(function () {
                method.apply(context, args);
            }, delay);
        }
    };
}

function bodyMoving(handler) {
    var $body = $('body');

    var startX = 0;
    var startY = 0;

    var p = 0;

    $body.on('touchstart', function (e) {
        var touch = e.touches[0];

        startX = touch.clientX;
        startY = touch.clientY;

        touch.startX = startX;
        touch.startY = startY;
        p = touch.clientX;

        handler.start && handler.start(touch);
    });

    $body.on('touchmove', function (e) {
        e.preventDefault();

        var touch = e.touches[0];

        touch.pdiffX = Math.abs(touch.clientX - p);
        p = touch.clientX;

        // console.log(touch.pdiffX);
        touch.diffX = touch.clientX - startX;
        touch.diffY = touch.clientY - startY;

        handler.moving && handler.moving(touch);
    });
    $body.on('touchend', function (e) {
        var touch = e.touches[0];
        handler.end && handler.end(touch);
    });
}

(function moveToInitZ() {

    requestAnimationFrame(moveToInitZ);
    var currentZ = parseInt(anime.getValue(stage, 'translateZ'));

    var a = (currentZ + initStageTranslateZ * 2) / 3;
    $stage.css({
        transform: 'translateZ(' + a + 'px)'
    });
})();

var bodyOnTouchHandler = {};

bodyOnTouchHandler.start = function (touch) {
    stopOrienter = true;
    this.startRotateY = parseFloat(anime.getValue(sliceWrap, 'rotateY'));
    this.startRotateX = parseFloat(anime.getValue(sliceWrap, 'rotateX'));
};

bodyOnTouchHandler.moving = function (touch) {
    var _this = this;

    throttle(function (X) {

        var rotateY = _this.startRotateY - touch.diffX / (imageNumber * imageWidth) * 360 * 1.5;
        var rotateX = _this.startRotateX + touch.diffY / (imageNumber * imageWidth) * 360 * 1.5;

        if (rotateX > allowRotateX) {
            rotateX = allowRotateX;
        } else if (rotateX < -allowRotateX) {
            rotateX = -allowRotateX;
        }

        $sliceWrap.css({
            transform: 'translateZ(' + sliceWrapTranslateZ + 'px) \n                    rotateX(' + rotateX + 'deg) \n                    rotateY(' + rotateY + 'deg)'
        });

        requestAnimationFrame(function () {
            var z = parseFloat(anime.getValue(stage, 'translateZ'));

            var tz = z - X * 30;
            var a = (z + tz) / 2;
            $stage.css({
                transform: 'translateZ(' + a + 'px)'
            });
        });
    }, 0, 100)(touch.pdiffX);
};

bodyOnTouchHandler.end = function () {
    window.orienterStartRotateX = parseFloat(anime.getValue(sliceWrap, 'rotateX'));
    window.orienterStartRotateY = parseFloat(anime.getValue(sliceWrap, 'rotateY'));
    stopOrienter = false;
};

bodyMoving(bodyOnTouchHandler);

// 以下是重力感应

var first = true;
function orienter(handler) {
    var o = new Orienter();
    var latitude = 0;
    var longitude = 0;
    var p = 0;
    o.handler = function (obj) {
        if (first) {
            latitude = obj.lat; // 维度
            longitude = obj.lon; // 经度
            first = false;
            handler.start({
                Y: latitude,
                X: longitude
            });
            p = longitude;
            return;
        }

        var diffY = obj.lat - latitude;
        var diffX = obj.lon - longitude;
        var pdiffX = Math.abs(longitude - p);

        handler.moving({
            diffX: diffX,
            diffY: diffY,
            pdiffX: pdiffX
        });
    };
    o.init();
}

orienter({
    start: function start(pos) {
        orienterStartRotateX = parseFloat(anime.getValue(sliceWrap, 'rotateX'));
        orienterStartRotateY = parseFloat(anime.getValue(sliceWrap, 'rotateY'));
    },
    moving: function moving(pos) {

        if (stopOrienter === true) {
            first = true;
            return;
        }

        var rotateX = orienterStartRotateX + pos.diffY / 2;
        var rotateY = orienterStartRotateY - pos.diffX;

        if (rotateX > 40) {
            rotateX = 40;
        } else if (rotateX < -40) {
            rotateX = -40;
        }

        $sliceWrap.css({
            transform: 'translateZ(' + sliceWrapTranslateZ + 'px)  \n                        rotateX(' + rotateX + 'deg) \n                        rotateY(' + rotateY + 'deg)'
        });

        throttle(function (X) {

            requestAnimationFrame(function () {
                var z = parseFloat(anime.getValue(stage, 'translateZ'));

                var tz = z - X * 3;
                var a = (z + tz) / 2;
                $stage.css({
                    transform: 'translateZ(' + a + 'px)'
                });
            });
        }, 0, 100)(pos.pdiffX);

        $('#test').html('diffX=' + pos.diffX + '<br>diffY=' + pos.diffY);
    }
});
//# sourceMappingURL=jsmap/eventHandler.js.map
