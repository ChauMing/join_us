
var mask = document.querySelector('.mask');
// mask.style.width = '0';
let loadingWrap = document.querySelector('.loading-wrap');

setTimeout(() => {
    mask.style.width = '360px';
}, 0);

window.onload = () => {
    mask.style.width = '465px';

    setTimeout(() => {
        anime.speed = .5;
        anime({
            targets: loadingWrap,
            scale: 0,
        });
        let view = document.querySelector('#view');

        view.style.visibility = 'visible';
        setTimeout(() => {
            anime({
                targets: view,
                scale: 1
            })
        }, 500);
        
        
    }, 3000)
}