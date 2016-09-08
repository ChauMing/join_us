'use strict';

window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

console.log(requestAnimationFrame);

var $sliceWrap = $('.slice-wrap');
var $stage = $('.stage');

(function init() {
    var str = '';
    for (var i = 1; i <= 24; i++) {
        str += '<div class="slice" style="background-image:url(dist/img/slice/' + i + '.png)"></div>';
    }
    $sliceWrap.html(str);

    var $slices = $sliceWrap.find('.slice');

    $slices.each(function (index, item) {
        $(item).css({
            transform: 'rotateY(' + -360 / 24 * index + 'deg) \n                        translateZ(-489px) \n                        translateY(460px)'
        });
    });
    $sliceWrap.css({
        transform: 'translateX(370px) translateZ(500px) translateY(-600px) rotateY(200deg)'
    });
})();

var sliceWrap = $sliceWrap[0];
var stage = $stage[0];

var startRotateY = 0,
    startRotateX = 0;

var initTranslateZ = parseInt(anime.getValue(stage, 'translateZ'));

var bodyTouchHandler = {};

bodyTouchHandler.start = function (touch) {
    startRotateX = parseFloat(anime.getValue(stage, 'rotateX'));
    startRotateY = parseFloat(anime.getValue(sliceWrap, 'rotateY'));
};

bodyTouchHandler.moving = function (touch) {
    var rotateY = startRotateY - touch.diffX / 2880 * 360,
        rotateX = startRotateX - touch.diffY / 2880 * 360;

    $sliceWrap.css({
        transform: 'translateX(370px) \n                    translateZ(500px) \n                    translateY(-600px) \n                    rotateY(' + rotateY + 'deg)'
    });
    var stageRotateX = anime.getValue(stage, 'rotateX');

    var currentZ = parseFloat(anime.getValue(stage, 'translateZ'));

    var targetZ = currentZ - absoluteValue(touch.diffX);

    var IcanHandlerIt = anime.getValue(stage, 'rotateX');

    $stage.css({
        transform: 'rotateX(' + IcanHandlerIt + ') translateZ(' + (targetZ - currentZ) * 2 + 'px)'
    });

    // anime({
    //     targets: stage,
    //     rotateX: stageRotateX,
    //     translateZ: (element, index) => {
    //         // console.log(touch.speed * 100);
    //         return initTranslateZ - Math.log(touch.speed * 1000000) * 100;
    //     }
    // });
    // setTimeout(() => {
    //    anime({
    //        targets: stage,
    //        rotateX: () => {
    //            return anime.getValue(stage, 'rotateX');
    //        },
    //        translateZ: (element, index) => {
    //            return initTranslateZ;
    //        }
    //    }); 
    // }, 100)

    if (rotateX > 40 || rotateX < -40) return;
    var translateZ = anime.getValue(stage, 'translateZ');
    $stage.css({
        transform: 'rotateX(' + rotateX + 'deg) translateZ(' + (targetZ - currentZ) * 2 + 'px)'
    });
};

(function moveToInitZ() {

    requestAnimationFrame(moveToInitZ);
    var currentZ = parseInt(anime.getValue(stage, 'translateZ'));
    var rotateX = anime.getValue(stage, 'rotateX');

    if (currentZ < 0) {
        currentZ /= 2;
        $stage.css({
            transform: 'rotateX(' + rotateX + ') translateZ(' + currentZ + 'px)'
        });
    }
})();

bodyMoving(bodyTouchHandler);

function bodyMoving(handler) {
    var startX = 0;
    var startY = 0;

    var $body = $('body');

    var time = 0;
    var preTime = 0;

    var preDiffX = 0;

    $body.on('touchstart', function (e) {
        var touch = e.touches[0];

        startX = touch.clientX;
        startY = touch.clientY;

        // console.log(startX);

        touch.movingX = touch.clientX;
        touch.movingY = touch.clientY;

        touch.startX = startX;
        touch.startY = startY;
        handler.start(touch);

        preTime = new Date();
    });

    $body.on('touchmove', function (e) {
        e.preventDefault();

        time = new Date();

        var speed = 0,
            t = time - preTime;
        preTime = time;

        var touch = e.touches[0],
            moveX = touch.clientX,
            moveY = touch.clientY,
            diffX = moveX - startX,
            diffY = moveY - startY;

        touch.moveX = moveX;
        touch.moveY = moveY;

        touch.diffX = diffX;
        touch.diffY = diffY;

        speed = absoluteValue(touch.diffX - preDiffX) / t;

        preDiffX = touch.diffX;
        touch.speed = speed;
        handler.moving(touch);
    });
    $body.on('touchend', function (e) {
        var touch = e.touches[0];
    });
}

function absoluteValue(v) {
    return v < 0 ? -v : v;
}
//# sourceMappingURL=jsmap/index.js.map
