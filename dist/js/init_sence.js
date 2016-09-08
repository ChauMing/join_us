'use strict';

var $sliceWrap = $('.slice-wrap'),
    sliceWrap = $sliceWrap[0];

var $stage = $('.stage'),
    stage = $stage[0];

(function (sliceWrap) {
    var str = '';

    for (var i = 1; i <= imageNumber; i++) {
        str += '<div class="slice" style="background-image:url(dist/img/slice/' + i + '.png)"></div>';
    }
    $sliceWrap.html(str);
    var $slices = $sliceWrap.find('.slice');

    function calculateTranlateZ(imageNumber, width) {
        var deg = 360 / imageNumber / 2;
        return width / 2 / Math.tan(2 * Math.PI * (deg / 360)) - 6;
    }

    $slices.each(function (index, item) {
        $(item).css({
            transform: 'rotateY(' + -360 / imageNumber * index + 'deg) translateZ(-' + calculateTranlateZ(imageNumber, imageWidth) + 'px) translateY(-50px)'
        });
    });

    $sliceWrap.css({
        transform: 'translateZ(' + sliceWrapTranslateZ + 'px) rotateY(' + sliceWrapRotateY + 'deg)'
    });

    $stage.css({
        transform: 'translateZ(' + initStageTranslateZ + 'px)'
    });
})(sliceWrap);
//# sourceMappingURL=jsmap/init_sence.js.map
